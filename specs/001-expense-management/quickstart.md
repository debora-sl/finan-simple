# Quickstart & Validation Guide: Gestão de Despesas

**Feature**: 001-expense-management | **Date**: 2026-07-28

Guia para preparar o ambiente e validar a feature ponta a ponta contra os cenários de aceite do [spec.md](./spec.md). Detalhes de dados e contratos: [data-model.md](./data-model.md), [contracts/](./contracts/).

> A Constituição proíbe usar `npm run dev` para validar mudanças. Use `pnpm build` para verificar a compilação e `pnpm lint` como portão de qualidade. A validação funcional dos cenários é feita manualmente na aplicação.

## Pré-requisitos

- pnpm instalado; Node.js 20+.
- Dependências a adicionar durante a implementação: `better-auth`, `@prisma/client` + `prisma` (dev), `next-safe-action`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, e os pacotes de peer do shadcn/ui.
- **Context7**: configurar uma chave de API válida (`ctx7sk...`) antes de implementar, para confirmar as APIs de Better Auth, Prisma 7 e next-safe-action (a chave estava inválida no planejamento).

## Setup (ordem sugerida)

1. **Variáveis de ambiente** (`.env`):
   - `DATABASE_URL="file:./dev.db"`
   - `BETTER_AUTH_SECRET=<openssl rand -base64 32>`
   - `BETTER_AUTH_URL="http://localhost:3000"`
2. **Prisma**: definir `prisma/schema.prisma` (provider `sqlite` + modelos de [data-model.md](./data-model.md)); rodar `pnpm prisma migrate dev --name init`.
3. **Better Auth**: `lib/auth.ts` (server), `lib/auth-client.ts` (client), handler em `app/api/auth/[...all]/route.ts`.
4. **shadcn/ui**: inicializar e gerar componentes (`button`, `input`, `label`, `form`, `card`, `table`, `select`, `sheet`, `dialog`, `switch`/`checkbox`, `badge`, `sonner`).
5. **Infra de dados/actions**: `lib/prisma.ts`, `lib/dal.ts`, `lib/action-client.ts`.
6. **Proteção**: `proxy.ts` no root com checagem otimista de cookie.

## Portões de qualidade (rodar antes de concluir)

```bash
pnpm prisma generate
pnpm lint      # DEVE passar sem erros (Constituição, Princípio IV)
pnpm build     # DEVE compilar sem erros de tipo
```

## Cenários de validação (mapeados ao spec)

### US1 — Autenticação (P1)
1. Cadastrar com nome, e-mail válido e senha → acesso à área autenticada (US1.1).
2. Sair e entrar novamente com as mesmas credenciais → sucesso (US1.2).
3. Cadastrar com e-mail já usado → recusa com mensagem clara (US1.3).
4. Login com senha errada → negado, mensagem neutra sem indicar o campo (US1.4).
5. Encerrar sessão → área autenticada fica inacessível (US1.5).
6. Acessar `/dashboard` ou `/expenses` sem sessão → redirecionado a `/login` (SC-004; edge case de acesso não autenticado).

### US2 — Despesas (P1)
1. Criar despesa com descrição, valor e data válidos → aparece na lista (US2.1).
2. Salvar despesa com valor ausente/≤0 → recusada com mensagem de correção (US2.2; FR-008).
3. Conferir que a lista mostra apenas despesas do próprio usuário (US2.3; SC-003).
4. Editar e remover uma despesa → mudança refletida na lista (US2.4).

### US3 — Categorias (P2)
1. Criar categoria com nome → disponível para associação (US3.1).
2. Associar categoria a uma despesa na criação/edição (US3.2).
3. Listar categorias → apenas as do usuário (US3.3).
4. Remover categoria associada a despesas → despesas permanecem sem categoria (US3.4; FR-014).

### US4 — Marcar como paga (P2)
1. Marcar despesa não paga como paga → consta como paga (US4.1).
2. Marcar de volta como não paga → volta a pendente (US4.2).
3. Lista distingue claramente pagas de pendentes (US4.3).

### US5 — Dashboard (P3)
1. Com despesas: ver total e divisão pago/pendente corretos (US5.1; SC-005).
2. Com várias categorias: ver gastos agrupados por categoria (US5.2).
3. Sem nenhuma despesa: ver estado vazio informativo (US5.3; FR-017).
4. Dashboard reflete apenas dados do próprio usuário (US5.4; SC-003).

## Validação de isolamento (crítica — SC-003/SC-004)

Criar duas contas (A e B), registrar despesas/categorias em cada uma e confirmar que:
- A lista, a dashboard e as consultas de A nunca exibem dados de B (e vice-versa).
- Tentar editar/remover por id uma despesa ou categoria de B autenticado como A → recusado por autorização.

## Critérios de aprovação

- Todos os cenários acima passam manualmente.
- `pnpm lint` e `pnpm build` sem erros.
- Nenhum acesso ao Prisma fora de `data/`; nenhuma mutação fora de `actions/` com `protectedActionClient`.
- Cores apenas via tokens; medidas em `rem`; ícones `lucide-react`; imagens via `next/image`.
