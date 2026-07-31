Canonical colored chip + glyph for the nine household categories. Use everywhere a category appears so colors stay consistent.

```jsx
<CategoryIcon category="moradia" />
<CategoryIcon category="mercado" size={32} />
```

Keys: `moradia`, `mercado`, `transporte`, `saude`, `educacao`, `lazer`, `cartao`, `fixas`, `outros`. Each maps to a fixed `--cat-*` color. `CategoryIcon.categories` exposes the {color,label,path} map.
