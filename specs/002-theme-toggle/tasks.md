---
description: "Task list for Alternância de Tema Claro/Escuro"
---

# Tasks: Alternância de Tema Claro/Escuro

**Input**: Design documents from `/specs/002-theme-toggle/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/theme-toggle.md, quickstart.md

**Tests**: Não solicitados. O projeto não possui suíte de testes automatizados; a validação é
manual via `quickstart.md` + `pnpm lint` (conforme plan.md). Nenhuma task de teste é gerada.

**Organization**: Tasks agrupadas por user story para implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a task pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

- **Single project** (Next.js App Router): código na raiz do repositório (`app/`, `components/`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar pré-requisitos e consultar documentação antes de escrever código

- [X] T001 Confirmar que `next-themes` (^0.4.6) está em `package.json` (dependência já instalada) e que `app/globals.css` já define o bloco `[data-theme="dark"] { … }` e o `@custom-variant dark (&:is([data-theme="dark"] *))` — nenhuma nova paleta deve ser criada
- [X] T002 Ler o guia do App Router em `node_modules/next/dist/docs/` referente a Client Components e layout raiz (conforme `AGENTS.md`), e revisar a API pública do `next-themes` v0.4 (`ThemeProvider`, `useTheme`, `attribute`, `defaultTheme`, `enableSystem`) descrita em `specs/002-theme-toggle/research.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Provider de tema e integração no layout — sem isto, nenhum tema é aplicado e nenhuma user story funciona

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase estar completa

- [X] T003 [P] Criar `components/providers/theme-provider.tsx` como Client Component (`"use client"`) que reexporta um wrapper do `NextThemesProvider` (`next-themes`) repassando `children` e configurando `attribute="data-theme"` (para casar com `[data-theme="dark"]` de `app/globals.css`); sem cores hard-coded, sem `px`
- [X] T004 Editar `app/layout.tsx`: adicionar `suppressHydrationWarning` ao elemento `<html>` e envolver `{children}` (dentro do `<body>`, mantendo o `<Toaster />`) com `<ThemeProvider>` importado de `components/providers/theme-provider.tsx`

**Checkpoint**: Provider ativo — a interface passa a responder ao atributo `data-theme`. User stories podem começar.

---

## Phase 3: User Story 1 - Alternar entre tema claro e escuro (Priority: P1) 🎯 MVP

**Goal**: Um único botão na sidebar alterna toda a interface entre claro e escuro imediatamente, com ícone refletindo o estado atual.

**Independent Test**: Numa tela autenticada, acionar o botão de tema na sidebar e verificar que toda a interface troca de tema imediatamente (sem recarregar), com o ícone alternando entre `Sun` e `Moon` (quickstart C1).

### Implementation for User Story 1

- [X] T005 [US1] Criar `components/layout/theme-toggle.tsx` como Client Component (`"use client"`) reutilizando o `Button` do shadcn (`components/ui/button.tsx`, `variant="ghost"`), usando `useTheme()` do `next-themes`: alternar via `setTheme(resolvedTheme === "dark" ? "light" : "dark")` em uma única ação, exibir ícone `Sun`/`Moon` do `lucide-react` refletindo o `resolvedTheme` (estado atual: `Sun` em claro, `Moon` em escuro), e incluir `aria-label` textual descrevendo a ação alvo (ex.: "Alternar para tema escuro"). Ícone comunica o estado; rótulo comunica a ação — manter essa distinção consistente. Confirmar que a troca é percebida como imediata, < 1s (FR-001, FR-002, FR-003, FR-008, SC-001, SC-002)
- [X] T006 [US1] Em `components/layout/theme-toggle.tsx`, adicionar guarda de montagem (`mounted`) para não depender de `resolvedTheme` antes de montar, renderizando um placeholder neutro de mesmo tamanho no primeiro paint, evitando mismatch de hidratação (contracts/theme-toggle.md — Estabilidade de hidratação)
- [X] T007 [US1] Editar `components/layout/app-sidebar.tsx` para renderizar `<ThemeToggle />` na sidebar imediatamente junto/acima do `Button` "Sair", importando de `components/layout/theme-toggle.tsx` (FR-004)

**Checkpoint**: User Story 1 totalmente funcional e testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Persistência da preferência entre sessões (Priority: P2)

**Goal**: O tema escolhido permanece após recarregar a página e ao abrir uma nova sessão no mesmo navegador.

**Independent Test**: Escolher o tema escuro, recarregar (F5) e abrir uma nova aba — a aplicação permanece no tema escuro em ambos os casos (quickstart C2).

### Implementation for User Story 2

- [X] T008 [US2] Garantir persistência em `components/providers/theme-provider.tsx`: manter o comportamento padrão de persistência do `next-themes` (`localStorage`, chave `theme`) — NÃO definir `storageKey` divergente nem desabilitar a persistência; confirmar que a preferência é reaplicada em recarregamentos e novas sessões (FR-005, data-model.md — Armazenamento)

**Checkpoint**: User Stories 1 e 2 funcionam de forma independente.

---

## Phase 5: User Story 3 - Respeitar o tema do sistema na primeira visita (Priority: P3)

**Goal**: Sem preferência salva, a aplicação adota o tema do SO e, enquanto não houver escolha explícita, acompanha em tempo real mudanças de `prefers-color-scheme`.

**Independent Test**: Remover a chave `theme` do `localStorage`, configurar o SO em modo escuro e recarregar → a aplicação abre no tema escuro; repetir em modo claro → abre no tema claro (quickstart C3).

### Implementation for User Story 3

- [X] T009 [US3] Configurar explicitamente `defaultTheme="system"` e `enableSystem` (true) no `NextThemesProvider` dentro de `components/providers/theme-provider.tsx`, para que a primeira visita siga o SO e o app acompanhe `prefers-color-scheme` em tempo real na ausência de escolha explícita (FR-006)

**Checkpoint**: Todas as user stories funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Anti-flash, acessibilidade, consistência visual e portão de qualidade transversais às três stories

- [X] T010 Validar ausência de "flash of incorrect theme": confirmar que `suppressHydrationWarning` está no `<html>` de `app/layout.tsx` e que o script anti-flash do `next-themes` é injetado, recarregando várias vezes com tema escuro salvo (FR-007, SC-004, quickstart C4) — verificado por revisão de código (`suppressHydrationWarning` presente em `app/layout.tsx`; script anti-flash é injetado automaticamente pelo `NextThemesProvider`). Confirmação visual em navegador fica a cargo do usuário via quickstart C4
- [X] T011 [P] Validar acessibilidade do controle em `components/layout/theme-toggle.tsx`: foco visível via Tab, acionamento por Enter/Espaço e presença de `aria-label` textual (FR-008, quickstart C5) — verificado por revisão de código (`aria-label` textual presente; `Button` usa elemento `<button>` nativo com estilos `focus-visible`, herdando foco/ativação por teclado)
- [X] T012 [P] Validar consistência visual em ambos os temas nas telas autenticadas `/dashboard`, `/expenses` e `/categories` — textos, cards, tabelas, gráficos e badges legíveis usando somente tokens de `app/globals.css`. As telas `/login` e `/signup` não possuem o toggle (sem sidebar) e seguem o tema do SO; confirmar que também permanecem legíveis em claro e escuro (FR-009, quickstart C6) — verificado por revisão de código (nenhuma cor hard-coded do Tailwind em `app/` ou `components/`; apenas tokens de `globals.css`). Confirmação visual definitiva fica a cargo do usuário via quickstart C6
- [X] T013 [P] Validar edge case de storage indisponível: bloquear `localStorage` e confirmar que a alternância ainda funciona na sessão atual sem quebrar a aplicação (quickstart C7) — verificado por revisão do código-fonte de `next-themes` (todo acesso a `localStorage` está envolto em `try/catch`, sem lançar exceções)
- [X] T014 [P] Validar acompanhamento do SO em tempo real: sem preferência explícita salva (remover a chave `theme` do `localStorage`), com a tela aberta, alterar o `prefers-color-scheme` do SO e confirmar que a aplicação troca de tema imediatamente, sem recarregar (FR-006, Clarification 2026-08-06, edge case "Preferência de sistema alterada durante o uso") — coberto por `enableSystem` (T009), que ativa o listener nativo de `prefers-color-scheme` do `next-themes`. Confirmação em ambiente real fica a cargo do usuário via quickstart C3
- [X] T015 Rodar `pnpm lint` e corrigir todos os erros de ESLint (portão de qualidade da constituição). NÃO executar `pnpm dev`/`npm run dev` — `pnpm lint` executado sem erros

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as user stories
- **User Stories (Phase 3–5)**: Todas dependem da Foundational (Phase 2)
- **Polish (Phase 6)**: Depende de todas as user stories desejadas concluídas

### User Story Dependencies

- **User Story 1 (P1)**: Começa após Foundational — cria o controle visível (base da feature)
- **User Story 2 (P2)**: Após Foundational; na prática valida-se após US1 existir (é preciso um toggle para escolher um tema e testar a persistência). Independentemente testável
- **User Story 3 (P3)**: Após Foundational — independente de US1/US2 (config do provider)

### Within Each User Story

- US1: T005 e T006 editam o mesmo arquivo (`theme-toggle.tsx`) → sequenciais; T007 depende de T005/T006
- US2: T008 edita o provider criado na Foundational
- US3: T009 edita o provider (mesmo arquivo do provider) → não paraleliza com T008/T003

### Parallel Opportunities

- **Foundational**: T003 (novo arquivo do provider) pode iniciar em paralelo ao trabalho de leitura; T004 depende de T003 (importa o provider)
- **Cross-story**: T008 (US2) e T009 (US3) tocam o MESMO arquivo `theme-provider.tsx` → NÃO devem rodar em paralelo entre si
- **Polish**: T011, T012, T013 e T014 são validações independentes → podem rodar em paralelo (marcadas [P]); T010 e T015 (lint) são sequenciais/transversais

---

## Parallel Example: Foundational

```bash
# T003 cria um arquivo novo e pode ser desenvolvido enquanto T002 (leitura de docs) ocorre:
Task: "Criar components/providers/theme-provider.tsx (Client Component, attribute=\"data-theme\")"
# T004 só depois que T003 existir (importa o ThemeProvider no app/layout.tsx)
```

## Parallel Example: Polish

```bash
# Validações independentes de arquivos/aspectos distintos:
Task: "Validar acessibilidade em components/layout/theme-toggle.tsx (T011)"
Task: "Validar consistência visual em /dashboard, /expenses, /categories (T012)"
Task: "Validar edge case de storage indisponível (T013)"
Task: "Validar acompanhamento do SO em tempo real com a tela aberta (T014)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Fase 1: Setup (T001–T002)
2. Fase 2: Foundational (T003–T004) — CRÍTICO, bloqueia todas as stories
3. Fase 3: User Story 1 (T005–T007)
4. **PARE e VALIDE**: testar US1 isoladamente (quickstart C1)
5. Este é o MVP utilizável (alternância de tema funcional)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → validar (C1) → MVP
3. US2 → validar persistência (C2)
4. US3 → validar tema do sistema (C3)
5. Polish → anti-flash, acessibilidade, consistência, `pnpm lint`

---

## Notes

- [P] = arquivos diferentes, sem dependências
- Feature exclusivamente de UI cliente: sem Prisma, sem `data/`, sem Server Actions
- `app/globals.css` NÃO é alterado — os tokens de ambos os temas já existem
- Sem comentários no código; kebab-case em arquivos; `rem`/tokens (nunca `px`); ícones via `lucide-react`; reutilizar `components/ui/button.tsx` (nada criado do zero)
- Commit após cada task ou grupo lógico
