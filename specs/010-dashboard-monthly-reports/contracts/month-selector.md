# Contract — UI: Month Selector (`components/shared/month-selector.tsx`)

Componente **cliente** reutilizável, compartilhado entre Dashboard e Despesas (FR-013, DRY). Usa
exclusivamente `Select` do shadcn/ui (`components/ui/select.tsx`), ícone `lucide-react`, tokens de tema e
medidas em `rem` (FR-015).

## Props

```ts
type MonthSelectorProps = {
  months: AvailableMonth[];   // de getAvailableMonths()
  value: string;              // "all" | "YYYY-MM" — recorte atual resolvido
};
```

## Comportamento

- Renderiza um `Select` com:
  - Opção **"Todos os meses"** (valor `"all"`).
  - Uma opção por mês em `months`, `label` = "agosto de 2026", valor = `"YYYY-MM"`, do mais recente ao mais antigo (FR-001).
  - **Opção do recorte atual quando ausente (FR-007 + edge cases)**: se `value` for um mês (`"YYYY-MM"`)
    que **não** está em `months`, uma opção correspondente é adicionada no topo da lista de meses,
    rotulada via `formatMonthLabel(parseMonthValue(value))`. Garante que o **mês atual** (recorte
    padrão, mesmo sem despesas) e um **mês inexistente na residência** sempre tenham `SelectItem`.
- Ao trocar o valor, escreve o param na URL **preservando os demais query params** e sem reload nem
  empilhar histórico. Com `const searchParams = useSearchParams()` no corpo do componente, no handler:
  `const params = new URLSearchParams(searchParams.toString()); params.set("month", next);` e então
  `router.replace(\`${pathname}?${params.toString()}\`, { scroll: false })`, usando
  `useRouter`/`usePathname`/`useSearchParams` de `next/navigation`.
- `value` controla a opção selecionada (estado vem da URL/servidor, não de `useState` interno).
- Ícone opcional `CalendarDays` (lucide-react) no trigger; nenhuma cor hard-coded.

## Integração nas páginas (Server Components)

- `app/(app)/dashboard/page.tsx` e `app/(app)/expenses/page.tsx`:
  1. `const { householdId } = await getActiveHousehold();`
  2. `const period = resolveReportPeriod((await searchParams).month);`
  3. `const months = await getAvailableMonths(householdId);`
  4. Buscar dados com `period` (`getDashboardSummary` / `getExpenses`).
  5. Renderizar `<MonthSelector months={months} value={periodToValue(period)} />` no topo.
- Assinatura da página passa a incluir
  `searchParams: Promise<{ [key: string]: string | string[] | undefined }>` (Next 16).

## Estados / bordas

- **Sem meses disponíveis**: o `Select` mostra "Todos os meses" e o **mês atual** (injetado como opção
  a partir de `value`, conforme acima), mesmo sem despesas (edge case "residência sem despesas").
- **Mês selecionado inexistente na residência** (ex.: após troca de residência): a opção do recorte
  atual é injetada a partir de `value` para não quebrar a seleção; quando o param degrada para o mês
  atual via `resolveReportPeriod`, a UI reflete o default.
- **Acessibilidade**: rótulos textuais legíveis; sem cor como único indicador.
