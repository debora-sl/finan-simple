Binary toggle for settings and recurring flags.

```jsx
<Switch checked={dark} onChange={setDark} label="Modo escuro" />
<Switch checked={recorrente} onChange={setRecorrente} label="Despesa recorrente" />
```

Controlled: pass `checked` and handle `onChange(next)`. Optional inline `label`.
