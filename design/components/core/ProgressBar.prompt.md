Goal/budget meter. Tone signals health — `positive` on track, `warning` near limit, `negative` over.

```jsx
<ProgressBar value={1200} max={2000} tone="positive" showLabel />
```

`value`/`max` define the fill; clamps to 0–100%. Animates width changes.
