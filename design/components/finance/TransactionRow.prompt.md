One movement in a transactions list. Composes `CategoryIcon`; signs and colors the amount by `type`.

```jsx
<TransactionRow category="mercado" description="Mercado da semana"
  meta="12 jun · Cartão" amount="R$ 240,00" type="expense" />
<TransactionRow category="outros" description="Salário"
  meta="05 jun" amount="R$ 6.500,00" type="income" />
```

`type="income"` shows a green `+`; `expense` a neutral `−`. Set `divider={false}` on the last row.
