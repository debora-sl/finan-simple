# Contract: Server Action `setMonthlyPayers`

Grava (upsert) o número de pagantes de um mês para a residência ativa do usuário autenticado.
Cumpre FR-007, FR-008, FR-009 e FR-015.

- **Arquivo**: `actions/set-monthly-payers.ts`
- **Client**: `protectedActionClient` (`lib/action-client.ts`) — autenticação obrigatória
- **Schema**: `setMonthlyPayersSchema` (`lib/validation/payers.ts`) via `.inputSchema`
- **Base de referência**: `actions/update-savings.ts`

## Entrada (`.inputSchema`)

```ts
{
  year: number;        // inteiro, faixa plausível (2000–2100)
  month: number;       // inteiro 1..12
  payersCount: number; // inteiro >= 1
}
```

Validação inválida ⇒ a action não executa e retorna erro de validação (mensagens amigáveis).

## Contexto e autorização

- Requer sessão válida (senão `SESSION_EXPIRED`, tratado pelo `protectedActionClient`).
- Resolve `householdId` via `getActiveHousehold()` — a gravação é **sempre** escopada à residência
  ativa do usuário. Não aceita `householdId` do cliente ⇒ impossível gravar em residência de
  terceiros (FR-009 / SC-006).

## Efeito

- `upsert` em `MonthlyPayers` pela chave única `(householdId, year, month)`:
  - **create** quando não existe;
  - **update** de `payersCount` quando existe (substitui o anterior — FR-008).
- `revalidatePath("/debt-calculator")` e `revalidatePath("/dashboard")`.

## Saída (sucesso)

```ts
{ payersCount: number }
```

## Erros

| Situação                         | Resultado                                             |
|----------------------------------|-------------------------------------------------------|
| Sem sessão                       | `SESSION_EXPIRED` (via client protegido)             |
| Entrada inválida (`payersCount < 1`, não inteiro, mês fora de 1..12) | Erro de validação; sem escrita |
| Usuário sem residência ativa     | Redirecionado por `getActiveHousehold` (`/households/new`) |

---

# Leitura (camada de dados, não é action)

## `data/payers.ts`

```ts
getMonthlyPayers(householdId: string, year: number, month: number): Promise<number | null>
```

- Retorna `payersCount` do registro `(householdId, year, month)` ou `null` quando não existe
  (estado vazio "—" — FR-012, SC-005).
- **Autorização de leitura**: `getMonthlyPayers` não faz checagem própria; a segurança (FR-009 /
  SC-006) é garantida pelos chamadores — as páginas RSC do Calculador e do Dashboard SEMPRE derivam
  `householdId` da sessão via `getActiveHousehold`, nunca de `searchParams`/cliente. Assim, a
  leitura fica sempre escopada à residência ativa do usuário.

```ts
setMonthlyPayers(householdId: string, year: number, month: number, payersCount: number): Promise<void>
```

- Executa o `upsert`; chamada exclusivamente pela Server Action (Prisma nunca em componente —
  Princípio II).

## Uso no Dashboard

`app/(app)/dashboard/page.tsx` chama `getMonthlyPayers(householdId, period.year, period.month)`
apenas quando `period.kind === "month"`; em "Todos os meses" passa `null` ⇒ card exibe "—".
