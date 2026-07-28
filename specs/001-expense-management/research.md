# Phase 0 Research: Gestão de Despesas com Autenticação

**Feature**: 001-expense-management | **Date**: 2026-07-28

Este documento resolve as incógnitas técnicas do plano. A stack é fixada pela Constituição; a pesquisa foca em *como* integrar cada peça na versão correta.

> **Nota de ambiente**: O MCP do Context7 estava indisponível nesta sessão (chave de API inválida — deve iniciar com `ctx7sk`). As decisões específicas do Next.js 16 foram validadas contra os guias em `node_modules/next/dist/docs/`. As integrações de Better Auth, Prisma 7 e next-safe-action baseiam-se em conhecimento da biblioteca e DEVEM ser reconfirmadas via Context7 na implementação.

---

## 1. Autenticação — Better Auth com e-mail/senha

- **Decisão**: Usar Better Auth com o provedor `emailAndPassword` habilitado e sessões persistidas em banco via adaptador Prisma. Configuração do servidor em `lib/auth.ts` (`betterAuth({ database: prismaAdapter(prisma, { provider: "sqlite" }), emailAndPassword: { enabled: true } })`). Handler HTTP montado em `app/api/auth/[...all]/route.ts` via `toNextJsHandler(auth)`. Cliente em `lib/auth-client.ts` via `createAuthClient` (`better-auth/react`), expondo `signIn`, `signUp`, `signOut`, `useSession`.
- **Racional**: Better Auth é parte obrigatória da stack (Constituição). Sessões em banco atendem ao requisito de segurança de isolamento (FR-005/FR-006) e são recomendadas pelo guia de autenticação do Next.js para verificações seguras. O adaptador Prisma reaproveita o mesmo banco SQLite, evitando uma segunda camada de persistência.
- **Alternativas consideradas**:
  - *Implementação manual (Jose + cookies)* — rejeitada: reinventa hashing, sessão e verificação; o guia do Next.js explicitamente recomenda uma biblioteca de auth; violaria a stack ratificada.
  - *Sessões stateless (JWT em cookie)* — rejeitada para a fonte de verdade: menos seguras para revogação; Better Auth já gerencia sessões em banco. Um cookie de sessão ainda é usado para a checagem otimista no `proxy.ts`.

## 2. Verificação de sessão do lado do servidor

- **Decisão**: Centralizar a verificação em `lib/dal.ts` com `verifySession()` e `getCurrentUser()`, memoizados com a `cache` do React por render pass. `verifySession()` chama `auth.api.getSession({ headers: await headers() })` e redireciona para `/login` quando não há sessão. Server Components, funções de `data/` e Server Actions obtêm o `userId` a partir dessa camada — nunca confiando em entrada do cliente.
- **Racional**: Segue o padrão Data Access Layer recomendado pelo guia de autenticação do Next.js 16. Concentrar a checagem evita esquecimento de autorização e garante SC-003/SC-004. `headers()` é assíncrono no Next.js 16 (`await`).
- **Alternativas consideradas**:
  - *Checar sessão em cada `layout.tsx`* — rejeitada: o guia alerta que layouts não re-renderizam a cada navegação (Partial Rendering); a checagem deve ficar próxima da fonte de dados.
  - *Confiar apenas no `proxy.ts`* — rejeitada: proxy faz apenas checagem otimista por cookie e não deve ser a única linha de defesa.

## 3. Proteção de rotas (Next.js 16 — Proxy)

- **Decisão**: Criar `proxy.ts` no root do projeto (função `proxy`, export nomeado ou default) para redirecionamento otimista: usuários sem cookie de sessão em rotas do grupo `(app)` vão para `/login`; usuários autenticados em `/login` ou `/signup` vão para `/dashboard`. Somente leitura de cookie — sem consulta ao banco. `matcher` exclui `api`, `_next/static`, `_next/image` e assets.
- **Racional**: No Next.js 16 o middleware foi renomeado para **Proxy** (`proxy.ts`), com a mesma funcionalidade (confirmado em `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`). Proxy é ideal para checagens otimistas de permissão e centraliza redirecionamentos. A autorização real permanece na DAL/actions.
- **Alternativas consideradas**:
  - *Arquivo `middleware.ts`* — rejeitada: nome legado; Next.js 16 padroniza `proxy.ts`.
  - *Sem proxy, só DAL* — funciona para segurança, mas piora a UX (renderização parcial antes do redirect); o proxy melhora o fluxo sem custo de segurança.

## 4. Persistência — Prisma 7 sobre SQLite

- **Decisão**: `datasource db { provider = "sqlite"; url = env("DATABASE_URL") }` com `DATABASE_URL="file:./dev.db"`. `PrismaClient` como singleton em `lib/prisma.ts` (padrão global em dev para evitar múltiplas instâncias no hot reload). Migrações via `prisma migrate dev`. Todo acesso encapsulado em `data/`.
- **Racional**: Prisma 7 e SQLite são exigidos pelo prompt/Constituição. SQLite zera a fricção de infraestrutura para um MVP local. O singleton evita esgotamento de conexões. O isolamento em `data/` cumpre o Princípio II.
- **Alternativas consideradas**:
  - *Postgres/MySQL* — rejeitados para esta versão: exigem serviço externo; o prompt especifica SQLite.
  - *Prisma chamado direto em componentes* — proibido pela Constituição.
- **Ponto de atenção (reconfirmar via Context7)**: SQLite não possui tipo `Decimal` nativo com precisão arbitrária no Prisma. Ver decisão 6 sobre representação monetária.

## 5. Server Actions — next-safe-action

- **Decisão**: `lib/action-client.ts` define `actionClient` (base) e `protectedActionClient` (via `.use` de middleware que injeta o usuário autenticado da DAL no `ctx`, lançando erro se não houver sessão). Cada mutação em `actions/` usa `protectedActionClient.inputSchema(zodSchema).action(async ({ parsedInput, ctx }) => { ... })`. Autorização de posse (a despesa/categoria pertence a `ctx.user.id`) é checada dentro de cada action antes de mutar. Cliente chama via `useAction`.
- **Racional**: Exigido pela Constituição (Princípio III), que também obriga `.inputSchema` (nunca `.schema`) e `protectedActionClient`. O middleware de autenticação evita repetição de checagem (DRY) em todas as actions.
- **Alternativas consideradas**:
  - *Server Actions "cruas" com `useActionState`* — rejeitada: a Constituição obriga next-safe-action com `useAction`.
  - *`.schema()`* — proibido explicitamente; usar `.inputSchema()`.

## 6. Representação de valores monetários

- **Decisão**: Armazenar o valor como **inteiro em centavos** (`Int`) no campo `amountInCents` da despesa. Validar no Zod como número positivo com no máximo 2 casas decimais e converter para centavos na borda (action). Formatar para exibição em BRL com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
- **Racional**: Evita erros de ponto flutuante em somatórios da dashboard (SC-005) e contorna a ausência de `Decimal` robusto no SQLite. Inteiros somam-se com exatidão. Atende FR-008 (valor monetário positivo) e ao edge case de muitas casas decimais.
- **Alternativas consideradas**:
  - *`Float`* — rejeitado: imprecisão em agregações compromete SC-005.
  - *`Decimal` do Prisma* — evitado no SQLite por limitações de precisão do provider; centavos inteiros são portáveis e simples.

## 7. Remoção de categoria com despesas associadas

- **Decisão**: `categoryId` na despesa é **opcional** (`String?`) com `onDelete: SetNull` na relação. Ao remover uma categoria, as despesas associadas permanecem e ficam sem categoria.
- **Racional**: Cumpre exatamente FR-014 e o cenário de aceite da História 3 (manter despesas sem categoria em vez de excluí-las). `SetNull` expressa isso no nível do schema, evitando lógica manual propensa a erro.
- **Alternativas consideradas**:
  - *`onDelete: Cascade`* — rejeitado: apagaria despesas do usuário, violando FR-014.
  - *`onDelete: Restrict`* — rejeitado: bloquearia a remoção, contrariando a expectativa de comportamento previsível descrita no spec.

## 8. Interface — shadcn/ui + Tailwind v4

- **Decisão**: Inicializar shadcn/ui e gerar apenas os componentes necessários: `button`, `input`, `label`, `form`, `card`, `table`, `select`, `sheet`, `dialog`, `checkbox`/`switch`, `sonner` (toasts), `badge`. Formulários usam o wrapper `Form` do shadcn com `react-hook-form` + resolver Zod. Cores exclusivamente via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`.
- **Racional**: Constituição (Princípio I) obriga verificar o shadcn antes de criar qualquer componente. Tailwind v4 já está instalado; shadcn integra-se via tokens CSS, preservando a regra de cores do tema. O `Sheet` traz botão de fechar próprio (não recriar).
- **Alternativas consideradas**:
  - *Componentes próprios do zero* — proibidos quando há equivalente shadcn.
  - *Cores hard-coded do Tailwind* — proibidas; usar tokens.

## 9. Dashboard — agregações

- **Decisão**: `data/dashboard.ts` expõe `getDashboardSummary(userId)` que retorna total geral, total pago, total pendente e lista `{ categoria, total }` por categoria (incluindo o bucket "Sem categoria"). Agregação feita no banco via `prisma.expense.aggregate`/`groupBy` filtrando por `userId`, com fallback a estado vazio quando não há despesas.
- **Racional**: Agregar no banco é exato e eficiente (SC-005). Filtrar por `userId` na consulta garante isolamento (SC-003). Retorno explícito de estado vazio atende FR-017.
- **Alternativas consideradas**:
  - *Somar no cliente* — rejeitado: exporia todas as despesas e arriscaria imprecisão/segurança.
  - *Somar em memória no servidor após buscar tudo* — aceitável no volume do MVP, mas `groupBy` é mais direto e escalável.

---

## Resumo das decisões

| # | Tema | Decisão |
|---|------|---------|
| 1 | Autenticação | Better Auth, e-mail/senha, sessão em banco (adaptador Prisma) |
| 2 | Verificação de sessão | DAL em `lib/dal.ts` com `cache` (React) |
| 3 | Proteção de rotas | `proxy.ts` (Next.js 16) — checagem otimista por cookie |
| 4 | Persistência | Prisma 7 + SQLite; singleton; acesso só em `data/` |
| 5 | Server Actions | next-safe-action; `protectedActionClient`; `.inputSchema` |
| 6 | Moeda | Inteiro em centavos (`amountInCents`); formatação `Intl` BRL |
| 7 | Remoção de categoria | `categoryId` opcional; `onDelete: SetNull` |
| 8 | UI | shadcn/ui + tokens de tema; `rem`; `lucide-react` |
| 9 | Dashboard | Agregação no banco por `userId`; estado vazio explícito |

**Todas as incógnitas (NEEDS CLARIFICATION) resolvidas.** Nenhuma pendência bloqueia a Fase 1.
