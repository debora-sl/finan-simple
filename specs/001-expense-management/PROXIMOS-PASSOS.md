# Próximos passos — Design System + Spec Kit

> **Como usar este arquivo:** abra um chat novo (para não estourar o contexto) e peça:
> _"Execute o PROXIMOS-PASSOS.md em `specs/001-expense-management/`, começando pelo Passo 1."_
> Este documento é autocontido: contém todo o contexto necessário para retomar sem depender do chat anterior.

## Onde paramos (estado atual)

- O **Design System** do Claude-Design foi trazido para o repo em `design/` (referência, ~2.1 MB).
- Os **tokens** foram portados para `app/globals.css` (Tailwind v4 `@theme`), com o **contrato de variáveis do shadcn/ui** já mapeado para a camada semântica do DS. Dark mode via `data-theme="dark"`.
- Fonte trocada para **Inter + JetBrains Mono**; `lang="pt-BR"` em `app/layout.tsx`.
- `design/` excluído do ESLint (`eslint.config.mjs`) e do TypeScript (`tsconfig.json`).
- ESLint passa limpo (exit 0). Commit: `9f632aa` ("feat: adopt Controle Financeiro design system tokens").

## Política do Design System (vale para toda a implementação)

- **`design/` é referência, não código de produção.** Nada em `design/` é importado por `app/` ou `components/`.
- **Tokens (`design/tokens/*.css`) → já portados** para `app/globals.css`. Usar sempre cores do tema; nunca hard-coded.
- **Componentes (`design/components/**/*.jsx`) → NÃO copiar.** São especificação visual; reconstruir com **shadcn/ui**. Ler o `.prompt.md` de cada um.
- **Telas (`design/ui_kits/*`) → alvo de layout.**
- Detalhe completo em `design/USO-NO-PROJETO.md`.

### Mapeamento DS → shadcn/ui

| Componente do DS | Implementação |
|---|---|
| Button, Input, Select, Switch, Badge, Card | shadcn: `button`, `input`, `select`, `switch`, `badge`, `card` |
| SegmentedControl | shadcn `tabs` ou `toggle-group` |
| ProgressBar | shadcn `progress` |
| SummaryCard, TransactionRow, BillItem, CategoryBar | componentes próprios em `components/`, compostos de primitivos shadcn |
| CategoryDonut | shadcn `chart` (recharts) |
| CategoryIcon | `lucide-react` + o mapa fixo das 9 categorias (`--cat-*`) |

### Escopo da feature 001

O DS cobre um produto maior (mobile, marketing, metas, receitas). **Usar só o que serve à feature 001:** dashboard, despesas, categorias, autenticação. Ignorar mobile/marketing/metas (referência para o futuro).

---

## Passo 1 — Referenciar o DS no plan.md e quickstart.md

**Objetivo:** ancorar os artefatos do Spec Kit no Design System, para que o `speckit-tasks` gere tarefas que apontem para telas e specs de componentes concretos.

**O que fazer:**

1. Em `specs/001-expense-management/plan.md`:
   - Adicionar uma subseção (ex.: em "Project Structure" ou uma nova "Design System / UI") registrando que a fonte de verdade visual é `design/`, com a política referência-only e o mapeamento DS → shadcn acima.
   - Registrar que os tokens já estão em `app/globals.css` e que toda tela/componente deve consumir os tokens do tema.
   - Apontar as telas relevantes: `design/ui_kits/dashboard/` (dashboard desktop) e os specs em `design/components/finance/` e `design/components/core/`.

2. Em `specs/001-expense-management/quickstart.md`:
   - Adicionar, nos cenários/telas, a referência visual correspondente do DS (ex.: dashboard → `design/ui_kits/dashboard/DashboardScreen.jsx`; linha de despesa → `design/components/finance/TransactionRow.prompt.md`; etc.).

**Restrições:** docs em pt-BR (commits em inglês). Não duplicar o conteúdo do DS — apenas referenciar caminhos. Manter consistência com a constituição (`.specify/memory` / `CLAUDE.md`).

**Verificação:** os dois arquivos passam a citar `design/` e telas/specs concretos; nada em `app/` foi alterado neste passo.

**Commit sugerido (inglês):** `docs: reference design system in plan and quickstart`

---

## Passo 2 — Rodar speckit-tasks e depois speckit-implement

**2a. `speckit-tasks`**
- Invocar a skill `speckit-tasks` para gerar `specs/001-expense-management/tasks.md`.
- Conferir que as tarefas resultantes **referenciam o DS** (telas de `design/ui_kits/` e specs de `design/components/`) e respeitam a política referência-only.
- Se alguma tarefa mandar copiar `.jsx` do DS ou usar cor hard-coded, corrigir para "reconstruir com shadcn + tokens do tema".

**2b. `speckit-implement`**
- Executar a skill `speckit-implement` seguindo `tasks.md`.
- Durante a implementação, respeitar a constituição (`CLAUDE.md`), em especial:
  - shadcn/ui como única biblioteca de componentes; verificar shadcn antes de criar do zero.
  - Cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; imagens via `next/image`.
  - Prisma só em `data/`; mutações via Server Actions com `next-safe-action` + `protectedActionClient` (base: `actions/create-booking.ts`); usar `.inputSchema` (nunca `.schema`).
  - Não rodar `npm run dev`; ESLint sem erros como portão de qualidade.
  - Usar Context7 para docs (se a chave estiver válida) e Serena para retrieval/edição semântica.
- Provável necessidade antes/durante: inicializar shadcn/ui e Better Auth + Prisma no projeto (hoje `app/` só tem `layout.tsx`, `page.tsx`, `globals.css`).

**Verificação:** `pnpm lint` limpo; telas batendo com as referências do DS; fluxos do `quickstart.md` validados manualmente.

**Commits sugeridos (inglês):** `docs: generate tasks for expense management` (2a) e commits incrementais por tarefa/tela na fase 2b.
