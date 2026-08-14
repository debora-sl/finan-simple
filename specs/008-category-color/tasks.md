---
description: "Task list for feature: Cor da categoria"
---

# Tasks: Cor da categoria

**Input**: Design documents from `/specs/008-category-color/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Nenhuma suíte automatizada no projeto — validação é manual via `quickstart.md`. Nenhuma task de teste é gerada (conforme spec).

**Organization**: Tasks agrupadas por user story para permitir implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story a que a task pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

Projeto único Next.js App Router (raiz do repositório): `prisma/`, `lib/`, `actions/`, `data/`, `components/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Adicionar o componente shadcn necessário antes de qualquer código de UI.

- [X] T001 Adicionar o componente shadcn ToggleGroup via CLI (`pnpm dlx shadcn@latest add toggle-group`), gerando `components/ui/toggle-group.tsx`. Confirmar que o arquivo foi criado e usa os tokens de tema.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistência e módulo central de cores — pré-requisitos que TODAS as user stories consomem.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [X] T002 Adicionar `color String?` ao `model Category` em `prisma/schema.prisma` (campo nullable, sem default — data-model VR-002).
- [X] T003 Gerar e aplicar a migração `pnpm prisma migrate dev --name add_category_color` (coluna `color TEXT NULL`, sem backfill), atualizando o Prisma Client em `prisma/migrations/`.
- [X] T004 Criar o módulo central `lib/category-colors.ts` exportando: `CATEGORY_COLOR_SLUGS` (9 slugs: moradia, mercado, transporte, saude, educacao, lazer, cartao, fixas, outros), `CATEGORY_COLOR_LABELS` (rótulos neutros pt-BR: Azul, Verde, Âmbar, Vermelho, Roxo, Rosa, Ciano, Verde-água, Cinza), `categoryColorEnum = z.enum(CATEGORY_COLOR_SLUGS)`, `pickCategoryColor(seed)` (hash determinístico — mover a lógica hoje em `components/categories/category-icon.tsx`), `resolveCategoryColor({ id, color })` (`color ?? pickCategoryColor(id)`) e `categoryColorVar(slug)` (`var(--cat-${slug})`).

**Checkpoint**: Persistência pronta e paleta centralizada — user stories podem começar.

---

## Phase 3: User Story 1 - Escolher a cor ao criar/editar uma categoria (Priority: P1) 🎯 MVP

**Goal**: Usuário seleciona (ou limpa) a cor de uma categoria na criação e edição; a cor é validada contra a paleta fechada e persistida no escopo da residência.

**Independent Test**: Criar uma categoria escolhendo uma cor, salvar, reabrir a edição e confirmar que a mesma cor aparece selecionada e persistida; limpar a cor e confirmar retorno à derivada.

### Implementation for User Story 1

- [X] T005 [US1] Estender os schemas em `lib/validation/category.ts`: adicionar `color: categoryColorEnum.optional()` a `createCategorySchema` e `updateCategorySchema` (importando `categoryColorEnum` de `lib/category-colors.ts`), conforme contracts/create-category.md e contracts/update-category.md.
- [X] T006 [US1] Persistir `color` na server action `actions/create-category.ts`: incluir `color` no `data` do `prisma.category.create` (quando `undefined` → `null`), mantendo `protectedActionClient`, `.inputSchema`, escopo da residência ativa e os `revalidatePath` de `/categories`, `/expenses`, `/dashboard`.
- [X] T007 [US1] Persistir `color` na server action `actions/update-category.ts`: atualizar `color` no `prisma.category.update` após a checagem de posse `{ id, householdId }` (FR-007), substituindo a cor anterior; coagir `color` `undefined` para `null` no `data` (permite limpar — FR-005a; sem isso o Prisma ignora o campo e mantém a cor antiga); manter `.inputSchema` e os `revalidatePath`.
- [X] T008 [P] [US1] Criar `components/categories/category-color-picker.tsx` usando o shadcn `ToggleGroup` (`type="single"`): renderizar um swatch por slug com fundo `style={{ backgroundColor: categoryColorVar(slug) }}`, `aria-label`/tooltip com `CATEGORY_COLOR_LABELS`, e uma ação de **limpar** que retorna o valor a vazio/null (FR-001a/FR-005a). Sem cor hard-coded; medidas em `rem`; ícones via `lucide-react`.
- [X] T009 [US1] Integrar o seletor em `components/categories/category-form.tsx` via `Controller` do react-hook-form: default = cor explícita persistida quando existir, senão vazio (não pré-selecionar a derivada — evita converter `color = null` em valor explícito ao salvar); enviar `color` na chamada da action com `useAction` (quando vazio → `undefined`/`null`), e refletir a cor persistida ao reabrir a edição.

**Checkpoint**: US1 completa — escolher, limpar e persistir cor funciona de ponta a ponta (MVP demonstrável).

---

## Phase 4: User Story 2 - Ver a cor da categoria na lista de categorias (Priority: P2)

**Goal**: Cada categoria exibe seu indicador de cor na lista, usando a cor explícita ou a derivada.

**Independent Test**: Definir cores distintas em duas categorias e confirmar que a lista exibe cada uma com sua respectiva cor; uma categoria legada (color null) exibe a cor derivada.

### Implementation for User Story 2

- [X] T010 [US2] Refatorar `components/categories/category-icon.tsx` para consumir `resolveCategoryColor`/`categoryColorVar` de `lib/category-colors.ts` (remover a lista de cores duplicada e o hash local), recebendo `color` além de `id`.
- [X] T011 [US2] Em `components/categories/category-list.tsx`, repassar `category.color` (e `id`) ao `CategoryIcon` para que o indicador use a cor resolvida (FR-008/FR-010).
- [X] T012 [P] [US2] Confirmar que `data/categories.ts` retorna o campo `color` no tipo/consulta usado pela lista (ajustar o `select` apenas se houver seleção explícita de colunas).

**Checkpoint**: US1 e US2 funcionam independentemente — a cor escolhida aparece na lista.

---

## Phase 5: User Story 3 - Ver a cor da categoria no gráfico do Dashboard (Priority: P3)

**Goal**: As fatias do gráfico de gastos por categoria usam a cor de cada categoria.

**Independent Test**: Definir cores em categorias com despesas no período e confirmar que as fatias correspondentes do gráfico usam essas cores; cores repetidas são permitidas.

### Implementation for User Story 3

- [X] T013 [US3] Incluir `color` por categoria no `byCategory` de `data/dashboard.ts`: adicionar `color` ao `select` de `prisma.category.findMany` e propagá-lo no mapeamento consumido pelo gráfico.
- [X] T014 [US3] Em `components/dashboard/category-breakdown.tsx`, usar `resolveCategoryColor({ id, color })` (de `lib/category-colors.ts`) no lugar do `pickCategoryColor` importado de `category-icon.tsx`, colorindo cada fatia com a cor da sua categoria (FR-009; repetição permitida). Para a fatia "sem-categoria" (`categoryId = null`, sem id/cor), usar `pickCategoryColor(categoryName)` como fallback, preservando o comportamento atual.

**Checkpoint**: Todas as user stories funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Portões de qualidade e validação end-to-end.

- [X] T015 Rodar `pnpm lint` e corrigir todos os erros de ESLint (Constituição IV).
- [X] T016 Rodar `pnpm build` e garantir compilação sem erros de tipo (campo `color` disponível no Prisma Client). Não usar `pnpm dev`.
- [ ] T017 Executar a validação manual de `specs/008-category-color/quickstart.md` (Cenários 1–8), confirmando SC-001 a SC-005.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as user stories.
- **User Stories (Phase 3–5)**: Todas dependem da Fase 2. Podem ser feitas em ordem de prioridade (P1 → P2 → P3) ou em paralelo por arquivos distintos.
- **Polish (Phase 6)**: Depende das user stories desejadas estarem completas.

### User Story Dependencies

- **US1 (P1)**: Após Fase 2. Independente — entrega o MVP.
- **US2 (P2)**: Após Fase 2. Independentemente testável; consome o resolvedor central (T004) e reflete cores da US1 quando existirem.
- **US3 (P3)**: Após Fase 2. Independentemente testável; T014 depende de T004 e é facilitado pelo T010 (remoção da dependência de `pickCategoryColor` em `category-icon.tsx`).

### Within Each User Story

- Validação (T005) antes das actions (T006, T007).
- Módulo central (T004) antes do picker (T008) e dos consumidores de exibição (T010, T014).

### Parallel Opportunities

- T006 e T007 tocam arquivos diferentes (`create-category.ts` vs `update-category.ts`) e podem rodar em paralelo após T005.
- T008 (`[P]`) pode ser desenvolvido em paralelo às actions.
- T012 (`[P]`) é independente dentro da US2.
- Após a Fase 2, US1, US2 e US3 podem ser trabalhadas por pessoas diferentes.

---

## Parallel Example: User Story 1

```bash
# Após T005 (schemas de validação), em paralelo:
Task: "Persistir color em actions/create-category.ts (T006)"
Task: "Persistir color em actions/update-category.ts (T007)"
Task: "Criar components/categories/category-color-picker.tsx (T008)"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Fase 1: Setup (T001)
2. Fase 2: Foundational (T002–T004) — CRÍTICO, bloqueia tudo
3. Fase 3: User Story 1 (T005–T009)
4. **PARAR e VALIDAR**: testar US1 isoladamente (quickstart Cenários 1–5)
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → testar → MVP
3. US2 → testar → cor na lista
4. US3 → testar → cor no gráfico
5. Polish (lint, build, quickstart)

---

## Notes

- [P] = arquivos diferentes, sem dependências.
- [Story] mapeia a task à user story para rastreabilidade.
- Fonte única da paleta em `lib/category-colors.ts` — não reintroduzir listas duplicadas.
- Apenas tokens `--cat-*`; sem hex hard-coded; medidas em `rem`.
- Prisma somente em `data/`; actions com `next-safe-action` + `protectedActionClient` + `.inputSchema`.
- Sem comentários no código; corrigir ESLint; não rodar `pnpm dev`.
- Commit após cada task ou grupo lógico.
