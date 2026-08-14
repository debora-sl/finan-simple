# Research: Cofrinho (valor guardado pela família)

**Feature**: 007-household-savings | **Date**: 2026-08-14

O spec não contém marcadores `NEEDS CLARIFICATION`. As decisões abaixo consolidam como a feature se encaixa nos padrões existentes do projeto (verificados no código) e resolvem as escolhas técnicas em aberto.

## Decisão 1 — Modelagem: campo em `Household` vs. entidade separada

- **Decisão**: Adicionar `savingsInCents Int @default(0)` diretamente no modelo `Household`.
- **Rationale**: O spec modela o cofrinho como um **único valor por residência** (Assumptions: "Modelagem por valor único", "Edição por substituição"), excluindo histórico e múltiplos cofrinhos. Um campo escalar em `Household` é a representação mais simples que satisfaz FR-001 (um valor por residência), FR-008 (persistência compartilhada) e FR-011 (default R$ 0,00, atendido pelo `@default(0)`). Evita join, tabela e relação 1:1 desnecessários (DRY / Clean Code).
- **Alternativas consideradas**:
  - *Modelo `Savings` com relação 1:1* — rejeitado: adiciona uma tabela e uma relação sem benefício, já que não há atributos além do valor nem histórico.
  - *Modelo de lançamentos (depósitos/retiradas) somados* — rejeitado: explicitamente fora de escopo (sem histórico); o spec adota edição por substituição do total.

## Decisão 2 — Precisão monetária

- **Decisão**: Armazenar como inteiro em **centavos** (`Int`), reutilizando `lib/money.ts` (`amountToCents`, `centsToAmount`, `formatCentsAsCurrency`).
- **Rationale**: É o padrão já adotado para `Expense.amountInCents`. Garante FR-006/SC-002 (precisão de centavos sem arredondamento indevido) e formatação consistente em Real (BRL) via o `Intl.NumberFormat` já existente.
- **Alternativas consideradas**: `Decimal` do Prisma — rejeitado por divergir do padrão do projeto e introduzir manuseio de `Decimal` na UI sem ganho.

## Decisão 3 — Escrita: uma única action de "definir/substituir"

- **Decisão**: Uma Server Action `update-savings.ts` (upsert lógico do valor) usando `protectedActionClient` + `.inputSchema`, resolvendo a residência ativa via `getActiveHousehold()`.
- **Rationale**: FR-004 (cadastrar quando não existir) e FR-005 (atualizar substituindo) são a mesma operação sobre um campo escalar com `@default(0)` — sempre um `update` do `Household` ativo. Segue `create-expense.ts` (resolução de household via `getActiveHousehold`) e `update-household.ts` (validação de autorização + `revalidatePath`). Como `getActiveHousehold` garante que o usuário possui membership na residência ativa (senão redireciona), FR-009 e o edge case "Acesso de não-membro" ficam cobertos.
- **Alternativas consideradas**: Ações separadas de create e update — rejeitado (redundante para campo escalar com default).

## Decisão 4 — Validação (zero válido, negativo/vazio/não numérico inválidos)

- **Decisão**: Schema zod em `lib/validation/savings.ts`: `amount = z.coerce.number({ error: "Valor obrigatório" }).min(0, "...").multipleOf(0.01, "...")`.
- **Rationale**: FR-007/SC-004 exigem aceitar **zero** e rejeitar negativos/vazios/não numéricos com mensagem clara. `min(0)` (em vez de `positive()` usado em despesas) aceita zero; `multipleOf(0.01)` garante ≤ 2 casas decimais; `z.coerce.number` com mensagem de erro cobre vazio/não numérico. Mensagens em pt-BR, alinhadas ao padrão de `validation/expense.ts`.
- **Alternativas consideradas**: `positive()` — rejeitado por excluir zero, que o spec exige aceitar.

## Decisão 5 — Leitura: função em `data/`

- **Decisão**: `data/savings.ts` com `getHouseholdSavings(householdId): Promise<number>` retornando `savingsInCents` (0 por default). A escrita (`setHouseholdSavings`) também fica em `data/`, chamada pela action.
- **Rationale**: Princípio II — Prisma nunca em componentes. Página e Dashboard consomem apenas a função de dados. Segue o padrão de `data/dashboard.ts` e `data/households.ts`.

## Decisão 6 — Navegação

- **Decisão**: Adicionar item `{ href: "/cofrinho", label: "Cofrinho", icon: PiggyBank }` ao `NAV_ITEMS` em `components/layout/app-sidebar.tsx`, posicionado após "Categorias".
- **Rationale**: FR-002. O ícone `PiggyBank` (lucide-react) já é importado no sidebar (usado no logo), reforçando a semântica de cofrinho. Reutiliza o rendering existente do menu (desktop + Sheet mobile).
- **Nota**: O botão de fechar do `Sheet` já é fornecido pelo componente — não criar manualmente (constituição).

## Decisão 7 — Card no Dashboard

- **Decisão**: Renderizar um card com o total guardado seguindo o padrão visual de `components/dashboard/summary-cards.tsx` (`SummaryTile`), com ícone `PiggyBank` e um `tone` do tema.
- **Rationale**: FR-010 exige "mesmo padrão visual dos demais cards de resumo". Reutilizar o `SummaryTile` (extraindo/compartilhando) evita duplicação (DRY). O card deve aparecer mesmo quando não há despesas, pois o Dashboard hoje esconde os cards quando `hasExpenses` é falso — o cofrinho deve exibir R$ 0,00 independentemente (FR-011, US2 cenário 2). Ver data-model/quickstart para o ponto de integração.
- **Alternativas consideradas**: Card totalmente novo e independente — rejeitado por duplicar o layout de `SummaryTile`.

## Decisão 8 — Revalidação de cache

- **Decisão**: A action chama `revalidatePath("/cofrinho")` e `revalidatePath("/dashboard")`.
- **Rationale**: FR-012/US2 cenário 3 — a alteração deve refletir no Dashboard na próxima visualização. Segue o padrão de `create-expense.ts`.

## Notas de conformidade (constituição / AGENTS.md)

- Antes de escrever código Next.js 16, ler o guia relevante em `node_modules/next/dist/docs/` (breaking changes) e usar Context7 para Prisma 7 / zod quando necessário.
- Não criar componentes do zero havendo equivalente shadcn/ui; usar `Field`/`Input`/`Button`/`Card` já presentes.
- ESLint deve passar; sem comentários no código; `npm run dev` não deve ser executado.
