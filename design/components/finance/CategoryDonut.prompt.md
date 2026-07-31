Compact donut for "Despesas por categoria" with a centered total. Pair with a `CategoryBar` legend.

```jsx
<CategoryDonut total="R$ 3.120" totalLabel="Despesas"
  data={[{category:'moradia',value:1800},{category:'mercado',value:720},{category:'transporte',value:600}]} />
```

`data` slices use each category's canonical color (or pass `color`). Sizes via `size`/`thickness`. Slices animate in order.
