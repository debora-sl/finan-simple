# Contract: Leitura da Dashboard

**Feature**: 001-expense-management | Cobre: US5, FR-016, FR-017

A dashboard é somente leitura — sem Server Actions. Toda agregação em `data/dashboard.ts`, filtrada por `userId` do usuário autenticado (via DAL). Renderizada em Server Component (`app/(app)/dashboard/page.tsx`).

## getDashboardSummary — `data/dashboard.ts`

- **Entrada**: `userId: string` (obtido de `verifySession()`, nunca do cliente).
- **Saída**:

```ts
type DashboardSummary = {
  hasExpenses: boolean
  totalInCents: number          // soma de todas as despesas do usuário
  paidInCents: number           // soma das despesas com isPaid = true
  pendingInCents: number        // totalInCents - paidInCents
  byCategory: Array<{
    categoryId: string | null    // null = "Sem categoria"
    categoryName: string         // rótulo exibível ("Sem categoria" quando null)
    totalInCents: number
  }>
}
```

## Regras
- **Isolamento**: todas as agregações filtram `where: { userId }` (FR-016; SC-003).
- **Exatidão**: somas feitas no banco (`aggregate` / `groupBy`) sobre `amountInCents` inteiros — resultado corresponde exatamente às despesas (SC-005; Cenário US5.1, US5.2).
- **Estado vazio**: sem despesas → `hasExpenses = false` e totais zerados; a página renderiza um estado vazio informativo em vez de valores incorretos (FR-017; Cenário US5.3).
- **Sem categoria**: despesas com `categoryId = null` agrupam-se no bucket `"Sem categoria"`.
- **Formatação**: valores em centavos convertidos para BRL na UI via `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.

## Componentes de UI (shadcn)
- Cards de resumo (`Card`) para total, pago e pendente.
- Visão por categoria em `Card` + `Table` ou lista; ícones `lucide-react`.
- Cores apenas via tokens de `app/globals.css`.
