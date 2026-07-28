# Contract: Server Actions de Categorias

**Feature**: 001-expense-management | Cobre: US3, FR-011, FR-012, FR-014

Todas em `actions/`, com `protectedActionClient` e `.inputSchema`. `ctx.user.id` da DAL. Leitura em `data/categories.ts`. Cliente via `useAction`.

## Regra transversal de autorização
Update/delete confirmam `category.userId === ctx.user.id` antes de mutar (FR-012; edge case de recurso alheio).

---

## createCategory — `actions/create-category.ts`
- **inputSchema**: `{ name: string(trim, min1, max60) }`
- **Efeito**: cria `Category` com `userId = ctx.user.id`.
- **Sucesso**: categoria disponível para associação a despesas (FR-011; Cenário US3.1). Revalida rotas de categorias/despesas.
- **Erros**: nome vazio → validação; nome duplicado para o mesmo usuário → erro claro (índice único `(userId, name)`).

## updateCategory — `actions/update-category.ts`
- **inputSchema**: `{ id: string, name: string(trim, min1, max60) }`
- **Efeito**: renomeia a categoria do usuário dono.
- **Sucesso**: alteração refletida onde a categoria é exibida.
- **Erros**: id de outro usuário → autorização; nome duplicado → validação.

## deleteCategory — `actions/delete-category.ts`
- **inputSchema**: `{ id: string }`
- **Efeito**: remove a categoria do usuário; despesas associadas têm `categoryId` definido como `null` via `onDelete: SetNull` (FR-014; Cenário US3.4).
- **Sucesso**: categoria some; despesas afetadas permanecem, agora sem categoria.
- **Erros**: id de outro usuário → autorização.

---

## Leituras — `data/categories.ts` (não são actions)
- `getCategories(userId)`: categorias do usuário, ordenadas por `name` (FR-012; Cenário US3.3). Retorna só do usuário.
- `getCategoryById(userId, id)`: uma categoria do usuário, ou `null`.

## Contrato de retorno (next-safe-action)
- Sucesso: `{ data: ... }`.
- Validação: `validationErrors` por campo (FR-018).
- Autorização/negócio: `serverError` com mensagem clara.
