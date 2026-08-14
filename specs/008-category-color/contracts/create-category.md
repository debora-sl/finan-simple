# Contrato — Server Action: `createCategory`

**Arquivo**: `actions/create-category.ts` · **Cliente**: `protectedActionClient` (next-safe-action)
· **Schema**: `.inputSchema(createCategorySchema)` (Constituição III)

## Entrada (`createCategorySchema`)

| Campo | Tipo                                | Obrigatório | Regras                                             |
|-------|-------------------------------------|-------------|----------------------------------------------------|
| name  | string                              | sim         | trim, 1–60 caracteres                              |
| color | enum(CATEGORY_COLOR_SLUGS) opcional | não         | quando presente, um dos 9 slugs da paleta (VR-001) |

```ts
createCategorySchema = categorySchema.extend({
  color: categoryColorEnum.optional(),
});
```

## Comportamento

1. Resolve a residência ativa (`getActiveHousehold`) — exige autenticação (FR-007).
2. Cria a categoria com `name`, `nameLower`, `householdId` e `color` (quando informado; caso
   contrário `null` → fallback de exibição).
3. `revalidatePath("/categories")`, `revalidatePath("/expenses")`,
   `revalidatePath("/dashboard")`.

## Saída

- **Sucesso**: registro `Category` criado (inclui `color`).
- **Erro `P2002`** (nome duplicado na residência): `Error("Você já tem uma categoria com esse nome.")`.
- **Erro de validação** (cor fora da paleta): rejeitado por `next-safe-action` antes da execução
  (SC-003).

## Regras de autorização

- Somente usuário autenticado; a categoria é criada **na residência ativa** do usuário (FR-006/FR-007).
