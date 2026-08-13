---
description: "Task list for feature implementation"
---

# Tasks: Regras de Senha no Cadastro

**Input**: Design documents from `/specs/006-signup-password-rules/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/password-policy.md, quickstart.md

**Tests**: Não há suíte de testes automatizados no projeto (plan.md → Testing: validação manual). Nenhuma task de teste automatizado é gerada; a validação segue o `quickstart.md`.

**Organization**: Tasks agrupadas por user story para permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a task pertence (US1, US2)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

Aplicação web single-project (Next.js App Router). Raiz do repositório: `lib/`, `components/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação. Sem novas dependências — a feature usa apenas libs já instaladas (Zod, react-hook-form, shadcn/ui, lucide-react, Better Auth).

- [X] T001 Confirmar que se está na branch `006-signup-password-rules` e que as dependências estão instaladas (`pnpm install`); nenhuma nova dependência é adicionada nesta feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estabelecer a fonte única da política de senha e a consistência cliente/servidor (FR-004). Ambas as user stories consomem estes artefatos.

**⚠️ CRITICAL**: Nenhuma user story pode ser concluída antes desta fase.

- [X] T002 Criar `lib/validation/password-policy.ts` como fonte única: exportar `PASSWORD_MIN_LENGTH = 8`, `PASSWORD_MAX_LENGTH = 128`, o tipo `PasswordRequirement` (`{ id: string; label: string; test: (password: string) => boolean }`) e a lista `checklistRequirements` contendo **apenas** o item `min-length` (label `"Ao menos 8 caracteres"`, test `password.length >= PASSWORD_MIN_LENGTH`). O máximo de 128 NÃO é item do checklist (FR-005, Clarification Q2): é aplicado apenas via `PASSWORD_MAX_LENGTH` no Zod/Better Auth e comunicado como texto de apoio. Avaliação sobre o valor cru, sem `trim` (data-model.md, research.md R2/R3, contracts §1)
- [X] T003 Atualizar `lib/validation/auth.ts`: no `signupSchema`, alterar `password` para `z.string().min(PASSWORD_MIN_LENGTH, "A senha deve ter ao menos 8 caracteres").max(PASSWORD_MAX_LENGTH, "A senha deve ter no máximo 128 caracteres")` importando as constantes de `lib/validation/password-policy.ts`; sem `.trim()` no campo `password` (contracts §2, research.md R3) — depende de T002
- [X] T004 [P] Atualizar `lib/auth.ts`: em `emailAndPassword`, definir `minPasswordLength: PASSWORD_MIN_LENGTH` e `maxPasswordLength: PASSWORD_MAX_LENGTH` importando as constantes de `lib/validation/password-policy.ts` (contracts §3, research.md R1) — depende de T002
- [X] T005 [P] Adicionar as chaves `PASSWORD_TOO_SHORT` ("A senha deve ter ao menos 8 caracteres.") e `PASSWORD_TOO_LONG` ("A senha deve ter no máximo 128 caracteres.") ao `CODE_MESSAGES` em `lib/auth-errors.ts`, coerentes com os `label` dos requisitos (FR-007, contracts §4)

**Checkpoint**: Política única definida e aplicada de forma idêntica no cliente (Zod) e no servidor (Better Auth). Mensagens de erro alinhadas.

---

## Phase 3: User Story 1 - Conhecer as regras de senha antes de submeter (Priority: P1) 🎯 MVP

**Goal**: Exibir, junto ao campo de senha, texto de apoio estático e legível que comunica a política (ao menos 8 caracteres e no máximo 128), visível antes de qualquer interação ou submissão.

**Independent Test**: Abrir `/signup` sem digitar nada e confirmar que as regras (mín. 8 e máx. 128) estão visíveis e legíveis próximas ao campo de senha, sem foco no campo nem submissão.

### Implementation for User Story 1

- [X] T006 [US1] Em `components/auth/signup-form.tsx`, renderizar um texto de apoio estático logo abaixo do `Input` de senha (dentro do `Field` de senha), em pt-BR e sem jargão, comunicando "ao menos 8 caracteres" e "no máximo 128 caracteres". Usar apenas tokens de tema (ex.: `text-muted-foreground`), medidas em `rem` e nenhuma cor hard-coded; o texto permanece visível independentemente do estado do campo (FR-001, FR-002, FR-003, SC-001) — depende de T002

**Checkpoint**: US1 completa e testável isoladamente — as regras aparecem no carregamento da tela.

---

## Phase 4: User Story 2 - Acompanhar em tempo real quais regras já foram atendidas (Priority: P2)

**Goal**: Exibir um checklist acessível que marca cada requisito (mínimo de 8 caracteres) conforme o usuário digita, atualizando ao adicionar e ao remover caracteres.

**Independent Test**: Digitar progressivamente no campo de senha e confirmar que o item "Ao menos 8 caracteres" muda de pendente → atendido ao alcançar o 8º caractere e volta a pendente ao apagar, tudo sem submeter; estado perceptível por ícone + texto (não só cor).

### Implementation for User Story 2

- [X] T007 [P] [US2] Criar `components/auth/password-requirements.tsx` (client component) que recebe o valor atual da senha via prop, itera `checklistRequirements` de `lib/validation/password-policy.ts` aplicando `requirement.test(password)`, e renderiza cada item combinando ícone `lucide-react` (`Check` para atendido, `Circle` para pendente) + `label` + sufixo assistivo de estado ("— atendido"/"— pendente"); envolver a lista com `aria-live="polite"` e usar tokens de tema (`text-primary`/`text-muted-foreground`), medidas em `rem`, sem cor hard-coded e sem depender só de cor (FR-005, FR-006, FR-008, SC-005, research.md R4) — depende de T002
- [X] T008 [US2] Em `components/auth/signup-form.tsx`, obter o valor da senha via `watch("password")` do react-hook-form e renderizar `<PasswordRequirements>` abaixo do campo de senha passando esse valor; garantir que a mensagem de erro inline (`FieldError`) só apareça após submit, mantendo o checklist como única superfície de feedback durante a digitação; garantir que o botão "Criar conta" permaneça habilitado independentemente do estado da senha (exceto durante o carregamento), com a validação da política ocorrendo no submit — o botão NÃO DEVE ser desabilitado por requisitos de senha não atendidos (FR-005, FR-006, FR-010, FR-011, research.md R5) — depende de T007 e de T006 (mesmo arquivo)

**Checkpoint**: US1 e US2 funcionam de forma independente — regras visíveis no load e checklist reativo enquanto digita.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verificações de consistência e validação manual final.

- [X] T009 [P] Verificar que não há literais de comprimento de senha (`8`/`128`) fora de `lib/validation/password-policy.ts` — buscar no código e refatorar qualquer duplicata para consumir as constantes (DRY, FR-004, contracts §Critérios de aceitação)
- [X] T010 Rodar `pnpm lint` e corrigir todos os erros de ESLint (Princípio IV)
- [ ] T011 Executar a validação manual de `specs/006-signup-password-rules/quickstart.md` (Cenários 1–5) e marcar os checkboxes conforme cada cenário passa

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA as user stories
- **User Stories (Phase 3–4)**: Dependem da Phase 2 completa
- **Polish (Phase 5)**: Depende das user stories desejadas concluídas

### Task-level Dependencies

- T002 bloqueia T003, T004, T006 e T007
- T003, T004, T005 podem rodar em paralelo entre si (após T002; T005 não depende de T002)
- T006 (US1) depende de T002
- T007 (US2) depende de T002
- T008 (US2) depende de T007 e de T006 (ambos tocam/compõem o `signup-form.tsx`)
- T009, T010, T011 após todas as implementações

### User Story Dependencies

- **US1 (P1)**: Independente — entrega valor sozinha (MVP)
- **US2 (P2)**: Depende conceitualmente da US1 estar no lugar (compartilha o `signup-form.tsx`); testável de forma independente

---

## Parallel Opportunities

- **Phase 2**: após T002, executar T003, T004 e T005 em paralelo (arquivos diferentes)
- **Phase 5**: T009 pode rodar em paralelo com as demais verificações

```bash
# Após concluir T002, lançar em paralelo:
Task: "T003 Atualizar signupSchema.password em lib/validation/auth.ts"
Task: "T004 Definir min/maxPasswordLength em lib/auth.ts"
Task: "T005 Adicionar PASSWORD_TOO_SHORT/PASSWORD_TOO_LONG em lib/auth-errors.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup (T001)
2. Phase 2: Foundational (T002–T005) — CRÍTICO, bloqueia as stories
3. Phase 3: User Story 1 (T006)
4. **PARAR e VALIDAR**: Cenário 1 do quickstart (regras visíveis no load)
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → base pronta (política única + consistência cliente/servidor)
2. US1 (T006) → validar isoladamente → MVP
3. US2 (T007–T008) → validar isoladamente (checklist reativo)
4. Polish (T009–T011) → verificação DRY, lint e quickstart completo
