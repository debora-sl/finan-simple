# Data Model: Calculador de Dívidas

## Novo model: `MonthlyPayers`

Representa quantas pessoas dividem as despesas de um mês específico em uma residência.

| Campo         | Tipo       | Regras                                                        |
|---------------|------------|--------------------------------------------------------------|
| `id`          | String     | `@id @default(cuid())`                                       |
| `householdId` | String     | FK → `Household.id`, `onDelete: Cascade`                     |
| `year`        | Int        | Ano de referência (ex.: 2026)                               |
| `month`       | Int        | Mês de referência 1–12                                       |
| `payersCount` | Int        | Inteiro `>= 1` (validado na action/schema)                  |
| `createdAt`   | DateTime   | `@default(now())`                                            |
| `updatedAt`   | DateTime   | `@updatedAt`                                                 |

**Constraints / índices**:

- `@@unique([householdId, year, month])` — no máximo um registro por residência+mês (FR-007);
  habilita `upsert` atômico (FR-008).
- `@@index([householdId])` — leitura por residência.
- `@@map("monthly_payers")` — segue a convenção snake_case dos demais mapeamentos.

**Relação em `Household`**: adicionar `monthlyPayers MonthlyPayers[]`.

### Definição Prisma (referência)

```prisma
model MonthlyPayers {
  id          String   @id @default(cuid())
  householdId String
  year        Int
  month       Int
  payersCount Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@unique([householdId, year, month])
  @@index([householdId])
  @@map("monthly_payers")
}
```

## Entidades reusadas (sem alteração de schema)

- **Expense**: fonte do `totalInCents` do mês via `getDashboardSummary` (recorte por `dueDate`,
  spec 010). Despesas sem `dueDate` ficam fora de qualquer mês (Assumptions).
- **Mês disponível (`AvailableMonth`)**: derivado de `getAvailableMonths(householdId)` — base do
  seletor do Calculador; nenhum campo persistido novo.
- **Household**: ganha a relação `monthlyPayers[]`; remoção em cascata apaga os pagantes.

## Regras de validação (schema `lib/validation/payers.ts`)

- `year`: inteiro (`z.coerce.number().int()`), faixa plausível (ex.: 2000–2100).
- `month`: inteiro `1..12`.
- `payersCount`: `z.coerce.number({ error: "Informe o número de pagantes" }).int("Deve ser um número
  inteiro").min(1, "Deve haver ao menos 1 pagante")`.

Mensagens amigáveis atendem FR-015/SC-004; sem cálculo quando inválido.

## Transições de estado

`MonthlyPayers` não tem máquina de estados. Ciclo de vida:

1. **Inexistente** → usuário informa pagantes para o mês → **criado** (FR-008 create).
2. **Existente** → usuário altera e confirma → **atualizado** via `upsert` (FR-008 update),
   substituindo o valor anterior (Acceptance Scenario 3 da História 1).
3. **Residência removida** → registros **apagados** em cascata.

## Derivações (não persistidas)

- `valuePerPayerInCents = Math.round(totalInCents / payersCount)` — computado sob demanda
  (cliente para preview reativo; nunca armazenado). `payersCount = 1` ⇒ igual ao total;
  `totalInCents = 0` ⇒ `0`.
