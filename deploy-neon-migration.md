# Migração SQLite → Postgres (Neon) para deploy na Vercel

> **Como usar este arquivo:** em uma nova sessão, peça ao Claude:
> _"Execute o plano em `docs/deploy-neon-migration.md`"_.
> Ele contém todo o contexto necessário para retomar do zero.

## Objetivo

Tornar o projeto funcional em produção na Vercel, trocando o banco **SQLite (`better-sqlite3`)** — que não funciona em ambiente serverless — por **Postgres hospedado no Neon**.

## Por que essa migração é necessária

O SQLite grava em `file:./prisma/dev.db`. Na Vercel isso falha porque:

1. O filesystem das funções serverless é **read-only** (só `/tmp` é gravável) → toda escrita (cadastro, login, despesas) quebra.
2. O filesystem é **efêmero** → dados não persistem entre requisições nem são compartilhados entre instâncias.
3. `better-sqlite3` é **módulo nativo** → compila por plataforma, mais um ponto de fragilidade no build da Vercel.

O build (`pnpm build`), TypeScript e ESLint já passam limpos. O problema é **exclusivamente** o banco e a configuração de deploy.

---

## Estado atual (antes da migração)

Arquivos e trechos relevantes:

- **`prisma/schema.prisma`** — `datasource db { provider = "sqlite" }`.
- **`lib/prisma.ts`** — usa `PrismaBetterSqlite3` de `@prisma/adapter-better-sqlite3`:
  ```ts
  import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
  import { PrismaClient } from "@prisma/client";

  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
  export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  ```
- **`lib/auth.ts`** — Better Auth com `prismaAdapter(prisma, { provider: "sqlite" })` (o `provider` precisa mudar).
- **`prisma.config.ts`** — lê `DATABASE_URL` via `env()`; schema e migrations em `prisma/`.
- **`package.json`** — dependências `@prisma/adapter-better-sqlite3` e `better-sqlite3`; **não há** script `postinstall` nem `prisma generate` no `build`. `pnpm.onlyBuiltDependencies` inclui `better-sqlite3`.
- **`prisma/migrations/`** — 3 migrations feitas para SQLite (`20260801011053_init`, `20260809120000_add_household_management`, `20260809203653_add_invitation_author`) + `migration_lock.toml` com `provider = "sqlite"`. **Serão descartadas** (dialetos incompatíveis).
- **`.env`** (local, fora do git) — `DATABASE_URL="file:./prisma/dev.db"`, `BETTER_AUTH_SECRET=...`, `BETTER_AUTH_URL="http://localhost:3000"`.

> Confirmar nomes/versões exatas dos pacotes do adapter Neon via **Context7** no momento da execução (regra do projeto).

---

## Passo a passo

### 1. Provisionar o banco no Neon
- Criar projeto Postgres no Neon (direto no site ou pela integração do marketplace da Vercel).
- **Recomendado:** conectar via painel da Vercel (Integrations → Neon) para que a `DATABASE_URL` seja injetada automaticamente nos ambientes.
- Guardar a connection string (formato `postgresql://user:password@host/db?sslmode=require`).

### 2. Trocar as dependências
```bash
pnpm remove @prisma/adapter-better-sqlite3 better-sqlite3
pnpm add @prisma/adapter-neon @neondatabase/serverless
```
- Remover `better-sqlite3` de `pnpm.onlyBuiltDependencies` no `package.json` (não é mais módulo nativo relevante).

### 3. Atualizar `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
}
```
- Revisar os tipos do schema para Postgres (o schema atual usa `String`, `Int`, `Boolean`, `DateTime` — todos compatíveis, sem mudança esperada).

### 4. Atualizar `lib/prisma.ts` para o adapter Neon
```ts
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```
> Validar a API exata do `PrismaNeon` (nome do parâmetro: `connectionString` vs `url`) via Context7.

### 5. Atualizar `lib/auth.ts`
```ts
database: prismaAdapter(prisma, { provider: "postgresql" }),
```

### 6. Recriar as migrations
- Apagar a pasta `prisma/migrations/` inteira (migrations SQLite não servem para Postgres).
- Com `DATABASE_URL` local apontando para um banco Postgres (Neon de dev ou Postgres local), gerar a migration inicial:
  ```bash
  pnpm prisma migrate dev --name init
  ```
- Conferir que `prisma/migrations/migration_lock.toml` passou para `provider = "postgresql"`.

### 7. Ajustar scripts de build no `package.json`
```json
"scripts": {
  "dev": "next dev",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "eslint",
  "postinstall": "prisma generate"
}
```
- Garante o Prisma Client gerado em instalação limpa na Vercel.

### 8. Aplicar migrations em produção
- Rodar contra o banco de produção do Neon:
  ```bash
  pnpm prisma migrate deploy
  ```
- Pode ser feito manualmente (uma vez) ou incorporado ao fluxo de deploy.

### 9. Configurar variáveis de ambiente na Vercel
No painel do projeto (Settings → Environment Variables), para Production (e Preview, se usar):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | connection string do Neon (injetada automaticamente se usar a integração) |
| `BETTER_AUTH_SECRET` | segredo forte (pode gerar novo: `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | **URL de produção** (ex.: `https://seu-app.vercel.app`) — NÃO deixar `localhost` |

> `BETTER_AUTH_URL` errado é a causa nº 1 de login quebrado em produção (cookies/redirects).

### 10. Atualizar arquivos de referência local
- `.env.example` → trocar `DATABASE_URL` para o formato Postgres e documentar as 3 variáveis.
- `.env` local → apontar para um Postgres de desenvolvimento (Neon dev ou local).

---

## Deploy na Vercel — passo a passo detalhado

> Tudo que é código já está feito e verificado localmente (build, lint e smoke test contra o Neon passaram). Esta seção cobre **apenas o que precisa ser feito no painel da Vercel e no banco de produção**.

### A. Importar o projeto na Vercel (se ainda não existe)
1. Acesse **https://vercel.com** → **Add New… → Project**.
2. Selecione o repositório `finan-simple` (autorize o GitHub se for a primeira vez).
3. Em **Framework Preset**, a Vercel detecta **Next.js** automaticamente — não mude.
4. **Package Manager**: a Vercel detecta o `pnpm` pelo `pnpm-lock.yaml`. Não é preciso alterar o Build Command — o script `build` do `package.json` (`prisma generate && next build`) já roda o `prisma generate`.
5. **NÃO clique em Deploy ainda** — primeiro configure as variáveis de ambiente (passo B). Um deploy sem elas vai falhar no build/runtime.

### B. Configurar as variáveis de ambiente
No projeto → **Settings → Environment Variables**. Adicione as 4 variáveis abaixo marcando os ambientes **Production** e **Preview** (Development é opcional):

| Variável | Valor | Observação |
|---|---|---|
| `DATABASE_URL` | URL **pooled** do Neon (host com `-pooler`) | usada pelo app em runtime via adapter Neon |
| `DIRECT_URL` | URL **direta** do Neon (host sem `-pooler`) | usada pelo Prisma CLI nas migrations |
| `BETTER_AUTH_SECRET` | segredo forte **novo** (`openssl rand -hex 32`) | não reutilize o segredo de desenvolvimento |
| `BETTER_AUTH_URL` | **URL de produção** (ex.: `https://finan-simple.vercel.app`) | nunca `localhost` |

Como pegar cada URL no Neon: painel do Neon → seu projeto → **Connection Details**. Com o toggle **"Pooled connection"** ligado você vê a `DATABASE_URL`; desligado, a `DIRECT_URL`.

> **Se você conectou o Neon pela integração da Vercel** (Marketplace), a `DATABASE_URL` (e às vezes `DATABASE_URL_UNPOOLED`) já foi criada automaticamente. Confira os nomes: se só existir `DATABASE_URL_UNPOOLED` e não `DIRECT_URL`, crie a `DIRECT_URL` copiando o valor da unpooled.

> ⚠️ `BETTER_AUTH_URL` errado é a causa nº 1 de login quebrado em produção (quebra cookies/redirects de sessão). Depois do primeiro deploy, se a Vercel gerar um domínio diferente do que você colocou, **atualize `BETTER_AUTH_URL`** e faça redeploy.

### C. Aplicar as migrations no banco de produção
- Se o banco de produção for **o mesmo** que você usou no dev (a URL que está no `.env` local), as migrations **já estão aplicadas** — pule este passo.
- Se for um banco **diferente** (recomendado separar dev de prod), rode localmente uma única vez apontando para a URL **direta** de produção:
  ```bash
  DATABASE_URL="<url-direta-de-prod>" DIRECT_URL="<url-direta-de-prod>" pnpm prisma migrate deploy
  ```
  > `migrate deploy` só aplica migrations já existentes (não cria novas nem pede confirmação) — seguro para produção.

### D. Fazer o deploy
1. Volte ao projeto na Vercel e clique em **Deploy** (ou faça `git push` na branch de produção — a Vercel builda automaticamente).
2. Acompanhe os **Build Logs**. O build deve rodar `prisma generate` e `next build` sem erros.
3. Se o build falhar, quase sempre é variável de ambiente faltando ou `DATABASE_URL` inválida — confira o passo B.

### E. Validar em produção
Abra a URL de produção e execute o fluxo crítico:
1. **Cadastro** de novo usuário → deve persistir (recarregue a página).
2. **Login/logout** → sessão persiste.
3. Criar **household, categoria e despesa** → dados aparecem após refresh.
4. **Trocar household ativo** → persiste após refresh.

Se algo falhar, veja **Deployments → (deploy) → Functions/Logs**:
- Erro de conexão/timeout no banco → `DATABASE_URL` errada ou faltando.
- Login não persiste / redirect loop → `BETTER_AUTH_URL` errado.

---

## Verificação (antes e depois do deploy)

Local:
```bash
pnpm prisma generate
pnpm build      # deve passar
pnpm lint       # deve passar sem erros
```
Testar manualmente o fluxo crítico com o banco Postgres conectado:
1. Cadastro de novo usuário → deve persistir.
2. Login/logout → sessão persiste.
3. Criar household, categoria e despesa → dados aparecem após refresh.
4. Trocar household ativo (`activeHouseholdId`) → persiste.

Na Vercel:
- Deploy concluído sem erro de build.
- Acessar a URL, repetir o fluxo crítico acima em produção.
- Conferir logs da função caso algo falhe (geralmente `DATABASE_URL` ou `BETTER_AUTH_URL`).

---

## Checklist rápido

- [x] Banco Neon provisionado
- [x] `@prisma/adapter-neon` + `@neondatabase/serverless` instalados; `better-sqlite3` removido
- [x] `schema.prisma` → `provider = "postgresql"`
- [x] `lib/prisma.ts` → `PrismaNeon`
- [x] `lib/auth.ts` → `provider: "postgresql"`
- [x] Migrations recriadas para Postgres (`20260810033842_init`)
- [x] `package.json` → `build` e `postinstall` com `prisma generate`
- [x] `prisma.config.ts` → migrations usam `DIRECT_URL` (conexão direta do Neon)
- [ ] `migrate deploy` aplicado no banco de produção (rodar se o banco de prod for diferente do de dev)
- [ ] Variáveis na Vercel (`DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`)
- [x] `.env.example` atualizado
- [x] Fluxo crítico testado local (smoke test: query + transação interativa contra o Neon); produção pendente
