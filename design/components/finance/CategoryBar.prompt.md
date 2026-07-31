A single category row in the spending breakdown — bar width and color track the category.

```jsx
<CategoryBar category="moradia" label="Moradia" amount="R$ 1.800,00" percent={42} />
<CategoryBar category="mercado" label="Mercado" amount="R$ 720,00" percent={17} />
```

Stack several inside a `Card` to form the "Despesas por categoria" chart. `percent` drives both the bar and the trailing label. Pair with `CategoryDonut` for the same data as a ring.
