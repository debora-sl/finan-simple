# Data Model: Cofrinho (valor guardado pela família)

**Feature**: 007-household-savings | **Date**: 2026-08-14

## Entidade: Cofrinho (valor guardado)

Modelado como um **campo escalar no modelo `Household`** — não uma tabela separada. Um valor por residência, compartilhado por todos os membros.

### Alteração de schema (`prisma/schema.prisma`)

Adicionar ao modelo `Household`:

| Campo            | Tipo  | Regras                      | Descrição                                              |
|------------------|-------|-----------------------------|--------------------------------------------------------|
| `savingsInCents` | `Int` | `@default(0)`, `>= 0`       | Total guardado pela residência, em centavos (BRL).     |

```prisma
model Household {
  id             String   @id @default(cuid())
  name           String
  savingsInCents Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // ... relações existentes inalteradas
}
```

- **Relação**: 1 valor guardado por `Household` (embutido no próprio registro). Nenhuma nova relação, índice ou tabela.
- **Default**: `0` satisfaz FR-011 (residências existentes e novas exibem R$ 0,00 sem cadastro prévio).
- **Migração**: `pnpm prisma migrate dev` gera uma migração aditiva não destrutiva (nova coluna com default; nenhuma linha existente é afetada além de receber `0`).

### Regras de validação (derivadas dos requisitos)

Aplicadas na fronteira de escrita (schema zod em `lib/validation/savings.ts`, entrada em reais convertida para centavos):

| Regra                                  | Requisito         | Comportamento                                              |
|----------------------------------------|-------------------|------------------------------------------------------------|
| Aceitar `0`                            | FR-007, Edge zero | `min(0)` — zero é válido; exibe R$ 0,00.                   |
| Rejeitar negativos                     | FR-007, Edge neg. | `min(0)` com mensagem clara.                               |
| Rejeitar vazio / não numérico          | FR-007            | `z.coerce.number({ error })` falha com mensagem clara.     |
| Preservar centavos (≤ 2 casas)         | FR-006, SC-002    | `multipleOf(0.01)`; armazenado como inteiro de centavos.   |
| Escrita só por membro da residência    | FR-009, Edge acesso | `getActiveHousehold()` garante membership (senão redireciona/nega). |

### Transições de estado

O valor guardado não possui máquina de estados; é um total substituído por edição direta:

```
(inexistente → default 0) --setHouseholdSavings(v)--> v --setHouseholdSavings(v')--> v'
```

Cada escrita **substitui** o total anterior (edição por substituição, Assumptions do spec). `v, v' >= 0`.

## Modelo de leitura (consumido pela UI)

Função de dados `getHouseholdSavings(householdId)` retorna `savingsInCents: number` (inteiro ≥ 0). A UI converte/format­a via `lib/money.ts`:

- Exibição: `formatCentsAsCurrency(savingsInCents)` → ex.: `R$ 150,75`.
- Entrada do formulário: string em reais → `amount` (número) → `amountToCents(amount)` na escrita.

## Rastreabilidade requisito → modelo

| Requisito | Coberto por |
|-----------|-------------|
| FR-001 (um valor por residência, compartilhado) | Campo em `Household` |
| FR-006 (precisão de centavos)                   | `Int` centavos + `multipleOf(0.01)` |
| FR-008 (persistência compartilhada entre sessões) | Coluna persistida; leitura por householdId |
| FR-009 (só membros autenticados)                | `getActiveHousehold()` na action |
| FR-011 (R$ 0,00 sem cadastro)                   | `@default(0)` |
