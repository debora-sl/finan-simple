Labeled text field with focus ring and optional `prefix`/`suffix`.

```jsx
<Input label="Valor" prefix="R$" placeholder="0,00" />
<Input label="Descrição" placeholder="Ex: Mercado da semana" />
<Input label="E-mail" error="E-mail inválido" />
```

Use `prefix="R$"` for currency. `error` turns the border red and replaces `hint`. Spreads native input props.
