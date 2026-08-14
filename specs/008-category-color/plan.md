# Implementation Plan: Cor da categoria

**Branch**: `008-category-color` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-category-color/spec.md`

## Summary

Permitir que cada categoria tenha uma cor escolhida a partir de uma paleta fechada derivada
dos tokens de tema (`--cat-*` em `app/globals.css`). A cor é persistida na entidade `Category`
(compartilhada pela residência), definida na criação e edição via um seletor de swatches com
**rótulos neutros de cor** (Azul, Verde…) e uma opção de **limpar** (volta ao padrão derivado), e
usada de forma consistente na lista de categorias e no gráfico do Dashboard.

Abordagem técnica: adicionar uma coluna `color` **nullable** em `Category`, centralizar a paleta
e o resolvedor de cor num único módulo (`lib/category-colors.ts`), validar a cor com um
`z.enum` derivado dessa paleta nas server actions existentes, e resolver a cor de exibição com
`category.color ?? pickCategoryColor(category.id)`. O fallback determinístico preserva a
aparência atual das categorias existentes (FR-010) e garante que toda categoria sempre exibe uma
cor (FR-005), sem migração de dados arriscada.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router)

**Primary Dependencies**: Prisma 7 (PostgreSQL), next-safe-action, react-hook-form + zod,
shadcn/ui (Radix), recharts, lucide-react, Better Auth

**Storage**: PostgreSQL via Prisma — nova coluna `color String?` em `model Category`

**Testing**: Validação manual via `quickstart.md` (o projeto não possui suíte automatizada);
`pnpm lint` e `pnpm build` como portões de qualidade

**Target Platform**: Aplicação web (SSR + Client Components)

**Project Type**: Web application (Next.js App Router, single project)

**Performance Goals**: Sem impacto perceptível; a cor é lida junto das categorias já carregadas,
sem consultas adicionais

**Constraints**: Cores exclusivamente dos tokens `--cat-*` (sem hex livre); medidas em `rem`;
sem componentes do zero quando houver equivalente shadcn/ui; Prisma apenas em `data/`; server
actions com `next-safe-action` + `protectedActionClient`

**Scale/Scope**: Poucas categorias por residência; 3 arquivos de exibição afetados (lista,
ícone/resolvedor, gráfico), 2 server actions, 1 schema de validação, 1 migração

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Interface com shadcn/ui e Design Tokens**: PASS — o seletor de cor usará o componente
  shadcn `ToggleGroup` (single-select) para os swatches, cada um com **rótulo neutro de cor**
  (Azul, Verde…) via `aria-label`/tooltip (FR-001a) e uma opção de **limpar** que retorna ao
  padrão derivado (FR-005a); nenhuma cor hard-coded (apenas tokens `--cat-*`); medidas em `rem`;
  ícones via `lucide-react`. Verificação de shadcn antes de criar qualquer componente atendida
  (não há ColorPicker nativo; `ToggleGroup` é o equivalente correto).
- **II. Camada de Dados Isolada**: PASS — leituras continuam por `data/categories.ts` e
  `data/dashboard.ts`; nenhum componente chama Prisma diretamente.
- **III. Server Actions Seguras**: PASS — reutiliza `create-category.ts` e `update-category.ts`
  com `protectedActionClient`, `.inputSchema` e checagem de pertencimento à residência (FR-007).
- **IV. Clean Code e Convenções de TypeScript**: PASS — paleta e resolvedor centralizados
  (DRY, elimina a lista duplicada em `category-icon.tsx`); kebab-case; sem comentários; ESLint
  limpo.
- **V. Documentação e Código via MCP**: PASS — Context7 para APIs (shadcn ToggleGroup, Prisma
  migrate, next-safe-action) e guia em `node_modules/next/dist/docs/` antes de código Next.

**Resultado**: Nenhuma violação. Complexity Tracking não é necessário.

## Project Structure

### Documentation (this feature)

```text
specs/008-category-color/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── create-category.md
│   └── update-category.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma                         # + Category.color String?
└── migrations/<ts>_add_category_color/   # nova migração

lib/
├── category-colors.ts                    # NOVO: paleta fechada, slugs, default, enum, resolver
└── validation/category.ts               # + campo color (z.enum) em create/update

actions/
├── create-category.ts                    # persiste color
└── update-category.ts                    # persiste color

data/
├── categories.ts                         # retorna color (findMany já retorna colunas)
└── dashboard.ts                          # inclui color no byCategory

components/
├── ui/toggle-group.tsx                   # NOVO (via shadcn CLI)
├── categories/
│   ├── category-color-picker.tsx         # NOVO: swatches (ToggleGroup), rótulos neutros + limpar
│   ├── category-form.tsx                 # + seletor de cor (Controller)
│   ├── category-list.tsx                 # passa color ao CategoryIcon
│   └── category-icon.tsx                 # usa resolver de lib/category-colors.ts
└── dashboard/
    └── category-breakdown.tsx            # usa color resolvida do byCategory

app/globals.css                            # (sem mudança — tokens --cat-* já existem)
```

**Structure Decision**: Projeto único Next.js App Router já estabelecido. A feature adiciona um
módulo compartilhado (`lib/category-colors.ts`) como fonte única da paleta e do resolvedor,
consumido por UI (lista, picker, gráfico) e validação (actions), eliminando a duplicação atual
da lista de cores em `category-icon.tsx` e `category-breakdown.tsx`.

## Complexity Tracking

> Sem violações constitucionais. Nenhuma justificativa necessária.
