Small pill for status and category labels — "Pago", "Vence hoje", "Atrasado".

```jsx
<Badge tone="positive" dot>Pago</Badge>
<Badge tone="warning">Vence em 3 dias</Badge>
<Badge tone="negative">Atrasado</Badge>
```

Tones: `neutral`, `action`, `positive`, `negative`, `warning`. `dot` adds a leading status dot. Use `warning` for bills due soon, `negative` for overdue, `positive` for paid.
