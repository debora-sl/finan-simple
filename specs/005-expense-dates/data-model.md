# Phase 1 — Data Model: Datas de Vencimento e Pagamento em Despesas

## Entidade: Expense (`model Expense` / tabela `expense`)

### Campos após a mudança

| Campo | Tipo (Prisma) | Nulo? | Origem | Observações |
|-------|---------------|-------|--------|-------------|
| `id` | `String @id @default(cuid())` | Não | inalterado | |
| `description` | `String` | Não | inalterado | |
| `amountInCents` | `Int` | Não | inalterado | |
| `dueDate` | `DateTime? @db.Date` | **Sim** | **renomeado** de `date`; agora opcional e `@db.Date` | Data de Vencimento; `null` ⇒ "Sem data de vencimento" (FR-002, FR-004) |
| `paidDate` | `DateTime? @db.Date` | Sim | **novo** | Data do Pagamento; presença ⇒ despesa paga (FR-005, FR-006) |
| ~~`isPaid`~~ | ~~`Boolean`~~ | — | **removido** | Estado "pago" passa a derivar de `paidDate != null` |
| `categoryId` | `String?` | Sim | inalterado | |
| `householdId` | `String` | Não | inalterado | Base da autorização (FR-010) |
| `createdAt` | `DateTime @default(now())` | Não | inalterado | |
| `updatedAt` | `DateTime @updatedAt` | Não | inalterado | |

### Relacionamentos

Inalterados: `household Household` (`onDelete: Cascade`), `category Category?` (`onDelete: SetNull`).

### Índices

- `@@index([householdId, dueDate])` — **substitui** `@@index([householdId, date])` (usado pela ordenação em `data/expenses.ts`). A ordenação por `dueDate` deve ser **crescente** (a vencer mais próxima primeiro) e colocar as despesas sem data de vencimento (`dueDate = null`) **ao final** da lista, após as que possuem vencimento (FR-004). Em `ASC` o padrão do Postgres já é `NULLS LAST`, mas o `nulls: 'last'` DEVE ser explícito para deixar a intenção clara e independente do banco — ex.: `orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }]`.
- `@@index([householdId, categoryId])` — inalterado.

### Regras de validação (aplicadas em `lib/validation/expense.ts`)

| Regra | Requisito | Erro/comportamento |
|-------|-----------|--------------------|
| `dueDate` obrigatória quando "Sem data de vencimento" não marcado | FR-003 | Bloqueia salvamento; orienta informar data ou marcar a opção |
| `hasNoDueDate = true` ⇒ `dueDate` gravada como `null` | FR-002 | Campo de data deixa de ser exigido; valor preenchido é descartado |
| `paidDate` opcional; se presente, ser data válida e **≤ hoje (calendário local do usuário)** | FR-009 | Datas futuras rejeitadas com mensagem; "hoje" é a data local do usuário (não o UTC do servidor), para nunca rejeitar uma data que o usuário vê como hoje |
| `paidDate` pode ser anterior ou posterior a `dueDate` | Edge cases | Permitido (pagamento antecipado ou em atraso) |
| `hasNoDueDate = true` **e** `paidDate` preenchida | Edge case | Combinação permitida |
| Todas as datas exibidas exatamente como informadas | FR-007 | Conversão/format via `lib/date.ts` em UTC |
| Operações restritas à residência do usuário | FR-010 | `getActiveHousehold()` + `where: { householdId }` nas actions |

### Estado / transições de "pago"

Não há máquina de estados explícita; o estado é uma função pura de `paidDate`:

```
paidDate == null   ⇒  "Pendente" (em aberto)
paidDate != null   ⇒  "Paga"  (paga em <paidDate>)
```

- Marcar como paga: `paidDate ← hoje (calendário local do usuário)` (via `toggle-expense-paid` ou pelo formulário).
- Marcar como pendente: `paidDate ← null`.

## Migração de dados legados

- `date` (NOT NULL, `timestamp`) → `dueDate` (`date`, nullable) preservando o **dia pretendido** via cast `::date` (ver `research.md §5`). Atende FR-008 e SC-002.
- `paidDate` inicia `NULL` para toda despesa legada — **nenhuma** recebe data de pagamento automaticamente (clarificação 2026-08-11).
- **Consequência aceita** (registrada em spec.md → Edge Cases / Assumptions): despesas legadas anteriormente `isPaid = true` passam a constar como "Pendente", pois `isPaid` é removido e não há backfill de `paidDate`.

## Schema Prisma resultante (trecho)

```prisma
model Expense {
  id            String    @id @default(cuid())
  description   String
  amountInCents Int
  dueDate       DateTime? @db.Date
  paidDate      DateTime? @db.Date
  categoryId    String?
  householdId   String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  category  Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([householdId, dueDate])
  @@index([householdId, categoryId])
  @@map("expense")
}
```
