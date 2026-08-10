# Implementation Plan: Melhorias de Experiência e Visual Antes do Deploy

**Branch**: `004-pre-deploy-refinements` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-pre-deploy-refinements/spec.md`

## Summary

Conjunto de refinamentos de pré-lançamento aplicados sobre o sistema de controle financeiro por residências já existente. O trabalho combina: (1) uma alteração de modelo de dados no `Invitation` (referência ao autor + estado `REJECTED`), (2) novas Server Actions de resposta/recusa de convite, exclusão de conta e exclusão de residência reaproveitando a lógica de saída de residência já existente, (3) uma camada central de mapeamento de erros de autenticação para mensagens em português, e (4) polimento de UI/UX (saudação, landing, responsividade com navegação lateral colapsável) usando exclusivamente o design system shadcn/ui e os tokens de tema. Nenhuma nova dependência é introduzida; toda a stack fixada na constituição é reutilizada.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router, Server Components + Server Actions)

**Primary Dependencies**: next-safe-action (Server Actions), Better Auth (autenticação, `deleteUser`, `databaseHooks`), Prisma 7 (`prisma-client-js`), shadcn/ui + Tailwind CSS, lucide-react, react-hook-form + zod, sonner (toasts)

**Storage**: SQLite via Prisma 7 (`prisma/schema.prisma`)

**Testing**: Validação manual via `quickstart.md` (o projeto não possui suíte automatizada de testes; ESLint é o portão obrigatório)

**Target Platform**: Aplicação web responsiva (celular ≈360px, tablet ≈768px, desktop ≥1024px)

**Project Type**: Web application (Next.js App Router monolítico — sem separação frontend/backend)

**Performance Goals**: Percepção de resposta imediata em ações do usuário; landing 100% estática (sem consulta ao banco); sem regressão de tempo de carregamento das telas internas

**Constraints**: Sem rolagem horizontal indevida nas larguras representativas (SC-008); mensagens de erro 100% em pt-BR sem texto cru do provedor (SC-003); nenhuma exclusão pode deixar registros órfãos (FR-015); `npm run dev` NUNCA usado para validar

**Scale/Scope**: 7 histórias de usuário (P1–P3); ~5 novas Server Actions, 1 migração Prisma, 1 módulo de mapeamento de erros, ~6 componentes novos/ajustados e polimento responsivo transversal

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade do plano |
|-----------|-----------------------|
| I. Interface com shadcn/ui e Design Tokens | PASS — Toda UI nova (dialogs de confirmação, navegação mobile, badges de status) usa componentes shadcn existentes (`Dialog`, `Sheet`, `Badge`, `Card`, `Button`, `Field`). Cores apenas via tokens de `app/globals.css`; medidas em `rem`; ícones via `lucide-react`. O botão de fechar do `Sheet` não será recriado. |
| II. Camada de Dados Isolada | PASS — Toda leitura/escrita nova de Prisma vive em `data/` (ex.: `getInvitationsForHousehold` com autor, `getUserByEmail`, helpers de exclusão de residência). Nenhum componente chama Prisma diretamente. |
| III. Server Actions Seguras | PASS — Novas actions (`reject-invitation`, `delete-account`, `delete-household`) usam `protectedActionClient`, `.inputSchema`, e checagem de autenticação/autorização, tendo `create-booking`/actions existentes como base. |
| IV. Clean Code e Convenções TS | PASS — kebab-case em arquivos, nomes descritivos, sem comentários, DRY (reuso de `handleAdminDeparture` e de um único mapa de erros). ESLint deve passar. |
| V. Documentação e Código via MCP | PASS — Context7 consultado para Better Auth (`deleteUser`, códigos de erro de sign-in); guias em `node_modules/next/dist/docs/` devem ser lidos antes de escrever código Next; Serena usado para retrieval/edição semântica. |
| Restrições de Stack | PASS — Nenhuma dependência nova. |

**Resultado**: PASS (sem violações). Seção de Complexity Tracking não aplicável.

## Project Structure

### Documentation (this feature)

```text
specs/004-pre-deploy-refinements/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0 — decisões de pesquisa
├── data-model.md        # Phase 1 — entidades e migração
├── quickstart.md        # Phase 1 — roteiro de validação manual
├── contracts/           # Phase 1 — contratos de Server Actions
│   ├── invitations.md
│   ├── account-deletion.md
│   ├── household-deletion.md
│   └── error-messages.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma                     # + Invitation.invitedById (FK autor), status REJECTED

lib/
├── auth.ts                           # habilitar user.deleteUser + beforeDelete (limpeza convites-autor)
├── auth-errors.ts                    # NOVO — mapa central de códigos Better Auth → mensagens pt-BR
└── validation/
    ├── invitation.ts                 # reuso (invitationIdSchema para recusar)
    └── household.ts                  # + schema de exclusão de residência (householdId)

data/
├── memberships.ts                    # getPendingInvitations* incluir autor (nome)
├── households.ts                     # + helper de exclusão de residência / reajuste de ativa
└── users.ts                          # NOVO — getUserByEmail (pré-check de login), leituras de conta

actions/
├── invite-member.ts                  # ajuste: bloquear e-mail com convite RECUSADO (não reabrir)
├── reject-invitation.ts             # NOVO — convidado recusa (status → REJECTED)
├── delete-account.ts                 # NOVO — exclusão de conta (Better Auth deleteUser + confirmação)
└── delete-household.ts              # NOVO — admin exclui residência + reajuste de ativa

components/
├── auth/login-form.tsx               # usar auth-errors + distinção sem-conta/senha-incorreta
├── auth/signup-form.tsx              # usar auth-errors (e-mail já cadastrado, senha fraca)
├── profile/password-form.tsx         # usar auth-errors
├── profile/delete-account-card.tsx   # NOVO — zona de perigo + dialog de confirmação
├── households/incoming-invitations.tsx # mensagem amigável c/ autor + ações Aceitar/Recusar
├── households/invitations-list.tsx   # exibir status Enviado/Aceito/Recusado
├── households/delete-household-button.tsx # NOVO — dialog de confirmação (somente ADMIN)
├── layout/app-sidebar.tsx            # navegação responsiva (Sheet em telas pequenas)
├── layout/app-header.tsx             # NOVO — saudação "Olá, {nome}" + trigger mobile
└── marketing/*                       # destaque de CTAs Entrar/Cadastrar no hero (polimento)

app/
├── (app)/layout.tsx                  # injetar header com saudação; detectar convites pendentes
├── (app)/profile/page.tsx            # incluir delete-account-card
└── page.tsx                          # garantir redirect de autenticado → /dashboard
```

**Structure Decision**: Aplicação Next.js App Router monolítica já estabelecida. O plano estende as pastas convencionais existentes (`data/`, `actions/`, `lib/`, `components/`, `app/`) sem introduzir novas camadas ou projetos. A separação de responsabilidades segue a constituição: Prisma isolado em `data/`, operações de servidor como Server Actions em `actions/`, UI em `components/` com shadcn/ui.

## Complexity Tracking

> Não aplicável — Constitution Check sem violações.
