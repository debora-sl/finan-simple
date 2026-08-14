# Phase 0 — Research: Cor da categoria

Resolve as decisões deixadas em aberto pela spec (paleta exata, cor padrão, armazenamento e
componente de seleção). Nenhum marcador `NEEDS CLARIFICATION` permanece após este documento.

## Decisão 1 — Paleta selecionável (fonte única de verdade)

**Decisão**: A paleta fechada é o conjunto de 9 tokens `--cat-*` já definidos em
`app/globals.css`, identificados pelos slugs:

`moradia`, `mercado`, `transporte`, `saude`, `educacao`, `lazer`, `cartao`, `fixas`, `outros`.

Esses slugs passam a viver num único módulo `lib/category-colors.ts`, que exporta a lista, um
`z.enum` derivado dela, rótulos amigáveis (para acessibilidade/tooltip) e a cor padrão. Hoje a
lista está duplicada em `components/categories/category-icon.tsx`; a centralização atende ao DRY
(Constituição IV).

**Rationale**: Os tokens já existem, já garantem contraste legível em ambos os temas (FR-011,
SC-005) e já são usados no ícone e no gráfico. Reaproveitá-los evita hex livre (FR-002) e mantém
consistência visual.

**Alternativas consideradas**:
- *Novos tokens dedicados à feature*: rejeitado — duplicaria a paleta existente sem ganho.
- *Hex livre / color input nativo*: rejeitado — viola FR-002 e a Constituição I.

## Decisão 2 — Armazenamento e cor padrão

**Decisão**: Adicionar `color String?` (nullable) em `Category`. A cor de exibição é resolvida
por `resolveCategoryColor(category) = category.color ?? pickCategoryColor(category.id)`, onde
`pickCategoryColor` é o hash determinístico atual (movido para `lib/category-colors.ts`).

- Categorias existentes (coluna nula após a migração) continuam exibindo exatamente a cor atual
  derivada do hash do `id` → **FR-010** (não quebra consumidores) e **FR-005** (sempre há uma
  cor) satisfeitos simultaneamente, sem backfill de dados.
- Ao criar/editar, o usuário escolhe um slug da paleta, que é persistido como valor explícito.
- Se o usuário não escolher, o seletor permanece vazio e a categoria é salva **sem cor explícita**
  (color = null), exibindo a cor padrão derivada (US1, cenário 3). Na edição, o seletor reflete a
  cor explícita persistida quando existir; caso contrário permanece vazio — **não** pré-seleciona a
  derivada, para não converter silenciosamente color = null em valor explícito ao salvar.

**Rationale**: `String?` + resolvedor é a opção mais limpa e de menor risco: preserva a variedade
visual atual das categorias antigas e centraliza a lógica de fallback num único ponto. A coluna
guarda um **identificador de token** (não um hex), conforme a Assumption da spec.

**Alternativas consideradas**:
- *`color String @default("outros")` NOT NULL*: rejeitado — achataria todas as categorias
  existentes para uma única cor (perda visual) e exigiria backfill determinístico em SQL (o hash
  é inviável de reproduzir em migração SQL pura).
- *Backfill via script computando o hash*: rejeitado — mesmo efeito do fallback nullable, porém
  com passo de migração adicional e risco desnecessário.

## Decisão 3 — Validação da cor

**Decisão**: Estender `lib/validation/category.ts` com `color: categoryColorEnum.optional()`,
onde `categoryColorEnum = z.enum(CATEGORY_COLOR_SLUGS)`. `undefined` é permitido (→ fallback);
qualquer string fora da paleta é rejeitada pelo enum.

**Rationale**: Atende FR-003/SC-003 (rejeita valor fora da paleta) reutilizando a mesma fonte de
verdade da UI, garantindo que picker e validação nunca divirjam. A validação roda na server
action (`.inputSchema`), portanto é confiável mesmo com input forjado.

**Alternativas consideradas**:
- *`z.string()` + checagem manual `includes`*: rejeitado — `z.enum` é mais declarativo e tipa o
  valor automaticamente.

## Decisão 4 — Componente de seleção de cor

**Decisão**: Usar o componente shadcn `ToggleGroup` (`type="single"`) para renderizar os swatches
da paleta, encapsulado em `components/categories/category-color-picker.tsx` e integrado ao
`react-hook-form` via `Controller`. Adicionar o componente com
`pnpm dlx shadcn@latest add toggle-group` (não existe em `components/ui/`).

**Rationale**: A Constituição I exige verificar shadcn antes de criar componente do zero. Não há
`ColorPicker` nativo no shadcn/ui; `ToggleGroup` single-select é o primitivo correto para uma
seleção exclusiva entre swatches, com acessibilidade (roles/teclado) pronta. Cada item recebe
`aria-label` com o rótulo da cor e o fundo via `style={{ backgroundColor: 'var(--cat-<slug>)' }}`
(token, não hex).

**Alternativas consideradas**:
- *`Select` (disponível)*: aceitável, mas swatches em grade dão leitura visual melhor para uma
  paleta pequena e fechada.
- *Botões `Button` manuais*: rejeitado — recriaria comportamento de grupo exclusivo que o
  `ToggleGroup` já oferece (violaria "não criar do zero havendo equivalente").

## Decisão 5 — Consistência de exibição (lista, ícone, gráfico)

**Decisão**: `CategoryIcon` passa a receber a `color` resolvida (ou o objeto categoria) e usa o
resolvedor central; `category-list.tsx` repassa `category.color`. `data/dashboard.ts` inclui
`color` em cada item de `byCategory`, e `category-breakdown.tsx` usa
`resolveCategoryColor({ id, color })` no lugar de `pickCategoryColor(...)`. Cores repetidas entre
categorias são permitidas (US3, cenário 2) — cada fatia usa a cor da sua categoria.

**Rationale**: Centraliza a resolução e remove o segundo ponto de duplicação da paleta
(`category-breakdown.tsx` importa `pickCategoryColor` de `category-icon.tsx`). A revalidação de
`/categories`, `/expenses` e `/dashboard` já ocorre nas actions, atendendo SC-002.

**Alternativas consideradas**:
- *Manter derivação por hash na exibição ignorando a coluna*: rejeitado — não refletiria a
  escolha do usuário (FR-008/FR-009).

## Referências de documentação (via Context7 / node_modules)

- shadcn/ui `ToggleGroup` — API de `type="single"`, `value`/`onValueChange`, itens.
- Prisma 7 — `prisma migrate dev` para coluna nullable adicionada (sem default obrigatório).
- next-safe-action — `.inputSchema` (obrigatório pela Constituição III).
- Next.js 16 — guia em `node_modules/next/dist/docs/` antes de alterar Server/Client Components.
