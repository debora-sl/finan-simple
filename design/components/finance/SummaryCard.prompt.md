The big metric tiles across the top of the dashboard.

```jsx
<SummaryCard label="Saldo atual" value="R$ 4.280,00" tone="action"
  icon={<WalletIcon />} delta="8%" deltaDirection="up" />
<SummaryCard label="Despesas do mês" value="R$ 3.120,00" tone="negative"
  icon={<TrendingDownIcon />} delta="5%" deltaDirection="down" />
```

`tone` colors the icon chip and value: `positive` (receitas/economia), `negative` (despesas), `action` (saldo). `value` is a pre-formatted BRL string. `delta` + `deltaDirection` render the vs-mês-anterior change.
