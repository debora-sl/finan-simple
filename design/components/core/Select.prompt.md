Labeled dropdown styled to match `Input` — month pickers, category filters.

```jsx
<Select label="Categoria" options={['Moradia','Mercado','Transporte']} />
<Select label="Mês" options={[{value:'06',label:'Junho'}]} />
```

`options` accepts `{value,label}[]` or a plain `string[]`. Custom chevron, native menu.
