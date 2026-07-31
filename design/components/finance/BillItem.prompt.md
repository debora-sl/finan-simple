A row in "Contas a pagar". Composes `CategoryIcon` + `Badge`; status maps to the warning/negative/positive system.

```jsx
<BillItem category="moradia" name="Aluguel" status="duesoon"
  dueLabel="Vence em 3 dias" amount="R$ 1.800,00" onPay={pay} />
<BillItem category="cartao" name="Fatura Nubank" status="overdue"
  dueLabel="Venceu 10 jun" amount="R$ 940,00" onPay={pay} />
```

Status: `pending`, `duesoon` (amber), `overdue` (red), `paid` (green, hides the pay action). Provide `onPay` to show "Marcar como pago".
