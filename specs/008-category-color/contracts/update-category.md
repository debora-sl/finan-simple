# Contrato — Server Action: `updateCategory`

**Arquivo**: `actions/update-category.ts` · **Cliente**: `protectedActionClient` (next-safe-action)
· **Schema**: `.inputSchema(updateCategorySchema)` (Constituição III)

## Entrada (`updateCategorySchema`)

| Campo | Tipo                                | Obrigatório | Regras                                             |
|-------|-------------------------------------|-------------|----------------------------------------------------|
| id    | string                              | sim         | id da categoria a atualizar                        |
| name  | string                              | sim         | trim, 1–60 caracteres                              |
| color | enum(CATEGORY_COLOR_SLUGS) opcional | não         | quando presente, um dos 9 slugs da paleta (VR-001) |

```ts
updateCategorySchema = categorySchema.extend({
  id: z.string().min(1),
  color: categoryColorEnum.optional(),
});
```

## Comportamento

1. Resolve a residência ativa (`getActiveHousehold`).
2. Busca a categoria por `{ id, householdId }`. Se não pertencer à residência → `Error("Categoria
   não encontrada.")` (FR-007: rejeição por autorização/posse).
3. Atualiza `name`, `nameLower` e `color` (substitui a cor anterior — US1, cenário 2). Quando
   `color` vier `undefined` (usuário limpou ou não escolheu), persistir `null` **explicitamente** no
   `data` do `update` para remover a cor (FR-005a); não deixar `undefined`, pois o Prisma ignoraria
   o campo e manteria a cor antiga.
4. `revalidatePath("/categories")`, `revalidatePath("/expenses")`,
   `revalidatePath("/dashboard")`.

## Saída

- **Sucesso**: registro `Category` atualizado (inclui `color`).
- **Erro `P2002`** (nome duplicado): `Error("Você já tem uma categoria com esse nome.")`.
- **Erro de validação** (cor fora da paleta): rejeitado antes da execução (SC-003).

## Regras de autorização

- Usuário autenticado **e** dono (residência) da categoria; caso contrário a operação é rejeitada
  (US1, cenário 4 / FR-007).
