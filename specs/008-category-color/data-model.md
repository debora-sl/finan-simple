# Phase 1 — Data Model: Cor da categoria

## Entidade: Category

Extensão da entidade existente (`prisma/schema.prisma`, `@@map("category")`). Apenas um campo é
adicionado; unicidade e pertencimento à residência permanecem inalterados.

| Campo         | Tipo        | Obrigatório | Default        | Observações                                                             |
|---------------|-------------|-------------|----------------|-------------------------------------------------------------------------|
| id            | String      | sim         | cuid()         | inalterado                                                              |
| name          | String      | sim         | —              | inalterado                                                              |
| nameLower     | String      | sim         | —              | inalterado; unicidade `@@unique([householdId, nameLower])`             |
| householdId   | String      | sim         | —              | inalterado; escopo da residência (FR-006)                              |
| **color**     | **String?** | **não**     | **null**       | **NOVO** — slug de token de tema (`--cat-*`); null → fallback derivado |
| createdAt     | DateTime    | sim         | now()          | inalterado                                                              |
| updatedAt     | DateTime    | sim         | @updatedAt     | inalterado                                                              |

### Definição no schema (trecho)

```prisma
model Category {
  // ...campos existentes...
  color String?
  // ...
}
```

## Regras de validação

- **VR-001** (FR-002/FR-003): quando presente, `color` DEVE ser um dos slugs da paleta fechada:
  `moradia | mercado | transporte | saude | educacao | lazer | cartao | fixas | outros`.
  Validado por `z.enum(CATEGORY_COLOR_SLUGS)` na server action. Valor fora da paleta → rejeição.
- **VR-002** (FR-005): `color` ausente/`null` é válido; a cor de exibição é resolvida por
  fallback determinístico. Nenhuma categoria fica sem cor exibível.
- **VR-003** (FR-007): criação/edição da cor exige usuário autenticado pertencente à residência
  dona da categoria (via `protectedActionClient` + `getActiveHousehold` + checagem de posse).

## Paleta (fonte única — `lib/category-colors.ts`)

Contrato do módulo compartilhado que substitui a lista duplicada hoje em `category-icon.tsx`:

| Export                     | Tipo                                   | Papel                                                    |
|----------------------------|----------------------------------------|----------------------------------------------------------|
| `CATEGORY_COLOR_SLUGS`     | `readonly string[]` (9 slugs)          | paleta fechada; base do enum e do picker (IDs internos)  |
| `CATEGORY_COLOR_LABELS`    | `Record<slug, string>`                 | rótulos **neutros de cor** pt-BR (aria-label/tooltip)    |
| `categoryColorEnum`        | `z.enum(CATEGORY_COLOR_SLUGS)`         | validação em `lib/validation/category.ts`                |
| `pickCategoryColor(seed)`  | `(string) => slug`                     | derivação determinística (hash) — movida de category-icon|
| `resolveCategoryColor(c)`  | `({id, color}) => slug`                | `c.color ?? pickCategoryColor(c.id)` — resolvedor único  |
| `categoryColorVar(slug)`   | `(slug) => string`                     | `var(--cat-${slug})` — evita interpolação espalhada      |

### Rótulos neutros da paleta (FR-001a)

Os slugs (`moradia`, `mercado`, …) são **identificadores internos de token/armazenamento** e NÃO
são exibidos ao usuário. No seletor, cada cor é apresentada por um **rótulo neutro de cor**,
desacoplado de qualquer significado de categoria. Mantê-los como slugs evita renomear tokens em
`app/globals.css`, migração de dados e churn; apenas `CATEGORY_COLOR_LABELS` muda de rótulo
semântico para rótulo de cor:

| Slug (ID interno) | Token          | Rótulo neutro exibido |
|-------------------|----------------|-----------------------|
| moradia           | `--cat-moradia`   | Azul               |
| mercado           | `--cat-mercado`   | Verde              |
| transporte        | `--cat-transporte`| Âmbar              |
| saude             | `--cat-saude`     | Vermelho           |
| educacao          | `--cat-educacao`  | Roxo               |
| lazer             | `--cat-lazer`     | Rosa               |
| cartao            | `--cat-cartao`    | Ciano              |
| fixas             | `--cat-fixas`     | Verde-água         |
| outros            | `--cat-outros`    | Cinza              |

## Estado / transições

Sem máquina de estados. A cor é um atributo simples: `null` (herda derivação) ⇄ `<slug>`
(explícita). Alterações substituem o valor anterior (US1, cenário 2) e o usuário pode **limpar**
a cor explícita, voltando a `null` e à cor derivada (FR-005a; US1, cenário 5).

## Migração

- Adicionar coluna `color TEXT NULL` (Prisma: `prisma migrate dev --name add_category_color`).
- **Sem backfill**: linhas existentes ficam `null` e continuam exibindo a cor derivada atual,
  preservando a aparência (FR-010) e o requisito de que toda categoria mostre uma cor (FR-005).
- Compatibilidade retroativa: leitura, criação, edição e exclusão seguem funcionando; consumidores
  que ainda não lêem `color` recebem `null` de forma inócua.

## Impacto em leitura de dados

- `data/categories.ts` — `findMany`/`findFirst` já retornam todas as colunas; `color` fica
  disponível sem alteração de consulta (tipos regenerados pelo Prisma Client).
- `data/dashboard.ts` — `byCategory` passa a incluir `color` por categoria (adicionar `color` ao
  `select` de `prisma.category.findMany` e propagar no mapeamento para o gráfico). Para a fatia
  **"sem-categoria"** (`categoryId = null`, sem id nem cor), usar `pickCategoryColor(categoryName)`
  como semente do fallback, preservando o comportamento atual do gráfico.
