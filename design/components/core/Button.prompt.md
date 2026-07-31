Primary action control — the main CTA per view (e.g. "Adicionar transação"); use sparingly, one primary per region.

```jsx
<Button variant="primary" iconLeft={<PlusIcon />}>Adicionar receita</Button>
<Button variant="secondary">Filtrar</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
```

Variants: `primary` (blue action), `secondary` (outline), `ghost` (text-only), `positive` (green), `negative` (red). Sizes: `sm` 36px, `md` 44px, `lg` 52px. Pass `iconLeft`/`iconRight` as a ReactNode (e.g. a Lucide `<svg>`). `fullWidth` stretches to the container — common on mobile.
