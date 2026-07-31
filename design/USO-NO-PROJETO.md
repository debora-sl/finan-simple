# Design System — como usar neste projeto

Esta pasta contém o **Design System "Controle Financeiro Residencial"** gerado pelo
Claude-Design. Ele é a **fonte de verdade visual** do produto. O `readme.md` ao lado
descreve o sistema em si; este arquivo descreve **como consumi-lo dentro do finan-simple**,
respeitando a constituição do projeto.

> **Referência, não código de produção.** Nada aqui é importado por `app/` ou
> `components/`. Os arquivos `.jsx` são especificações visuais — os componentes reais
> são reconstruídos com **shadcn/ui**. A única exceção são os **tokens CSS**, que são
> portados para `app/globals.css`.

## Regra de ouro

- **`tokens/*.css` → portar.** CSS puro; vira o tema em `app/globals.css` (formato
  `@theme` do Tailwind v4). Atende à regra "só cores do tema".
- **`components/**/*.jsx` → NÃO copiar; usar como spec.** Reconstruir com shadcn/ui.
  Ler o `.prompt.md` de cada componente como especificação de variantes/uso.
- **`ui_kits/*` → alvo de layout.** Reproduzir o arranjo das telas com componentes shadcn.

## Mapeamento DS → shadcn/ui

| Componente do DS | Implementação neste projeto |
|---|---|
| Button, Input, Select, Switch, Badge, Card | shadcn: `button`, `input`, `select`, `switch`, `badge`, `card` |
| SegmentedControl | shadcn `tabs` ou `toggle-group` |
| ProgressBar | shadcn `progress` |
| SummaryCard, TransactionRow, BillItem, CategoryBar | componentes próprios em `components/`, compostos de primitivos shadcn |
| CategoryDonut | shadcn `chart` (recharts) |
| CategoryIcon | `lucide-react` + o mapa fixo das 9 categorias (`--cat-*`) |

Os ícones do DS são "estilo Lucide" de propósito; o próprio DS recomenda trocar por
`lucide-react` de verdade — que já é a regra do projeto.

## Fluxo com o Spec Kit

1. **Tokens → `app/globals.css`** antes de gerar tarefas.
2. **`plan.md`/`quickstart.md`** referenciam esta pasta.
3. **`speckit-tasks`** gera tarefas ancoradas no design (ex.: "montar dashboard conforme
   `design/ui_kits/dashboard`").
4. **`speckit-implement`** usa cada tela como alvo e cada `.prompt.md` como spec de componente.

## Escopo da feature 001 (expense-management)

O DS cobre um produto maior (mobile, marketing, metas, receitas). Para a feature 001,
usar apenas o que serve: **dashboard, despesas, categorias, autenticação**. Mobile,
marketing e metas ficam como referência para features futuras.

## Índice rápido

- `tokens/` — cores (light/dark), tipografia (Inter), espaçamento, sombras, radii.
- `components/core/` e `components/finance/` — specs de componentes (`.jsx` + `.prompt.md`).
- `ui_kits/dashboard|mobile|marketing/` — telas montadas de referência.
- `guidelines/` — specimens de cor, tipografia e espaçamento.
- `readme.md` / `SKILL.md` — documentação e regras de marca originais do DS.
- `Controle Financeiro - Painel.html` — preview renderizado (abrir no navegador para visualizar).
