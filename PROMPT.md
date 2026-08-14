# Prompt para o `/speckit-specify`

> Cole o bloco abaixo como argumento do `/speckit-specify` e siga o fluxo completo do Spec Kit
> (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) em PR próprio.
> Este arquivo contém **uma spec por vez**: a 007 foi concluída; agora vai a 008.
>
> Restrições da constituição (`CLAUDE.md` / `AGENTS.md`) valem para toda spec: shadcn/ui como única lib de
> componentes; cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; Prisma
> só em `data/`; mutações via Server Actions (`next-safe-action` + `protectedActionClient`, com `.inputSchema`);
> ESLint limpo; não rodar `npm run dev`.

---

## Spec 008 — Cor da categoria (Baixa)

Feature que permite ao usuário escolher a **cor** de cada categoria em Categorias. A cor escolhida passa a
identificar a categoria de forma consistente em toda a aplicação (lista de categorias, despesas e gráfico do
Dashboard). Envolve **campo novo no model `Category`** (migration).

Contexto atual (já verificado):

- Categorias pertencem à **residência** (`Category` em `prisma/schema.prisma`), compartilhadas por todos os
  membros da mesma household. O model tem hoje `name` e `nameLower` (unicidade por `householdId` + `nameLower`),
  sem nenhum campo de cor.
- A gestão de categorias vive em `components/categories/` (`category-form.tsx`, `category-list.tsx`,
  `category-icon.tsx`); a leitura em `data/categories.ts`; as mutações em `actions/create-category.ts`,
  `actions/update-category.ts` e `actions/delete-category.ts`; a validação em `lib/validation/category.ts`.
- O gráfico de categorias do Dashboard está em `components/dashboard/category-breakdown.tsx` — hoje as cores
  das fatias não vêm da categoria.
- Cores no projeto só podem vir dos **tokens de tema** em `app/globals.css`; nada de cor hard-coded do Tailwind.
  Há uma referência de design em `design/guidelines/color-categories.card.html`.

O que a spec precisa definir:

- **Campo no Prisma**: adicionar a cor ao model `Category` e descrever a migration. Decidir a representação
  (ex.: identificador de um token de tema, não um hex arbitrário) e um valor padrão para categorias já
  existentes, respeitando a regra de usar apenas cores do tema (`app/globals.css`).
- **Paleta de cores selecionável**: definir o conjunto fechado de cores que o usuário pode escolher, todas
  derivadas dos tokens de `app/globals.css`. Validar a seleção contra essa paleta na Server Action.
- **Leitura via `data/`**: expor a cor da categoria nas funções de `data/categories.ts` (Prisma nunca é chamado
  de componente), sem quebrar os consumidores atuais.
- **Mutação via Server Action**: incluir a cor em `actions/create-category.ts` e `actions/update-category.ts`
  usando `next-safe-action` + `protectedActionClient` (com `.inputSchema`), com validação de autenticação e de
  que o usuário pertence à household. Atualizar `lib/validation/category.ts`.
- **UI de seleção**: adicionar o seletor de cor ao formulário de categoria (`components/categories/category-form.tsx`),
  usando apenas componentes shadcn/ui e tokens de tema; medidas em `rem`. Exibir a cor escolhida na lista de
  categorias (`components/categories/category-list.tsx`).
- **Aplicação da cor**: refletir a cor da categoria onde ela identifica a categoria — no mínimo na lista de
  categorias e nas fatias do gráfico do Dashboard (`components/dashboard/category-breakdown.tsx`).

Fora de escopo: cores customizadas fora da paleta de tokens (hex livre); cor por despesa; temas/paletas
configuráveis pelo usuário; ícones por categoria além do que já existe.
