Inline toggle for 2–4 short options — period switches, small tab sets.

```jsx
<SegmentedControl value={periodo} onChange={setPeriodo}
  options={['Mês','Semana','Ano']} />
```

Controlled via `value`/`onChange`. For long or many options use `Select` instead.
