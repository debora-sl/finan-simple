# Próximos passos — Melhorias pós-deploy

> **Como usar este arquivo:** documento vivo para registrar as melhorias identificadas
> após a publicação. Liste cada melhoria na seção "Backlog de melhorias"; ao decidir
> executar, defina o caminho (spec formal x ajuste rápido) e mova para "Em andamento" /
> "Concluído". Docs em pt-BR; commits em inglês (conventional commits).

## Estado atual (marco de referência)

- Produto **em produção** na Vercel: `https://finan-simple.vercel.app`.
- Banco migrado para **Neon Postgres** (adapter `@prisma/adapter-neon`); migration `20260810033842_init` aplicada em produção.
- Autenticação (Better Auth) validada em produção.
- **Spec 005** (datas em Despesas — backlog itens 7 e 8) concluída e em produção.
- **Spec 006** (regras de senha no cadastro), **Spec 007** (Cofrinho) e **Spec 008** (cor da categoria)
  concluídas (ver histórico do git). O item 2 (botão "+ criar nova residência" cortado) fica **superado**
  pela spec 009, que remove o `HouseholdSwitcher` da sidebar.
- Ajustes pontuais pós-deploy concluídos: itens 9, 3 e 5.
- **Spec 004** (refinamentos pré-deploy) concluída 39/39, incluindo o T038 (validação manual em produção).
- Specs anteriores concluídas: 001 (despesas), 002 (tema), 003 (households).
- **Próximas na fila (novas):** spec 009 (Residências: menu/listagem/edição) — **ativa em `PROMPT.md`** — e
  spec 010 (Dashboard por mês). Detalhamento completo abaixo.

## Como cada melhoria será tratada

Ao pegar um item do backlog, classifique o caminho:

- **Funcionalidade nova / mudança relevante** → vira **spec 005+** pelo fluxo Spec Kit:
  `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- **Ajuste pontual** (bug, texto, pequeno tweak de UX/visual) → executar direto, sem cerimônia de spec.

Restrições do projeto (constituição em `CLAUDE.md` / `AGENTS.md`) valem para toda melhoria:
shadcn/ui como única lib de componentes; cores só via tokens de `app/globals.css`; medidas em `rem`;
ícones `lucide-react`; Prisma só em `data/`; mutações via Server Actions (`next-safe-action` +
`protectedActionClient`, usando `.inputSchema`); ESLint limpo; não rodar `npm run dev`.

## Backlog de melhorias

> Coluna **Tipo**: `spec` = feature nova pelo fluxo Spec Kit (`/speckit-specify`); `ajuste` = correção
> pontual executada direto, sem spec.

| #   | Melhoria                                                                           | Tipo     | Prioridade | Notas                                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Incluir orientação / exemplo de senha na tela de cadastro                          | `spec`   | Alta       | **Spec 006.** Mostrar ao usuário as regras de senha. Regra a definir na spec e alinhar com o Better Auth (ex.: mínimo de caracteres, evitar sequências). Validar antes se não conflita com o padrão do Better Auth. |
| 2   | Ajustar espaçamento do botão "+ criar nova residência" em telas maiores            | `ajuste` | Baixa      | **Reaberto.** 1ª tentativa (`alignItemWithTrigger={false}` no `SelectContent`) **não resolveu** — validado em produção, o botão continua cortado ao clicar em telas maiores. É Base UI Select (não Radix); reproduzir o corte e investigar largura do popup / `side`/`align` / overflow do container. |
| 3   | Renomear "Total" para "Total Despesas" no Dashboard                                 | `ajuste` | Baixa      | Deixar claro para o usuário a que o total se refere. Apenas troca de texto.                                                                                                       |
| 4   | Cofrinho (valor guardado pela família)                                             | `spec`   | Alta       | **Spec 007.** Feature completa: nova opção no menu, tela para cadastrar o valor guardado e card no Dashboard mostrando o total. Novo model no Prisma. Consolida os antigos itens "menu Cofrinho" e "Dashboard Cofrinho". |
| 5   | Formatar valores do gráfico do Dashboard em Real (R$)                              | `ajuste` | Baixa      | Exibir os valores do gráfico em Reais (ex.: `R$ 50,00`). Formatação pontual.                                                                                                      |
| 6   | Permitir escolher a cor da categoria                                               | `spec`   | Baixa      | **Spec 008.** Em Categorias, permitir que o usuário selecione a cor. Campo novo em `Category`.                                                                                    |
| 7   | Datas em Despesas: vencimento, pagamento e "sem data de vencimento"                | `spec`   | Alta       | Incluir Data de Vencimento, Data do Pagamento e a opção "Sem data de vencimento". **Absorve o antigo #8** (correção do bug de timezone) por mexerem no mesmo tratamento de datas.  |
| 8   | ~~Corrigir Data de Vencimento aparecendo um dia antes~~ (absorvido pelo #7)         | `spec`   | Alta       | Bug de timezone/UTC: ao cadastrar 20/08/2026 a lista mostra 19/08/2026. Corrigir para exibir a data exatamente como informada — tratado dentro da spec do #7.                       |
| 9   | Confirmação de exclusão em Despesas e Categorias                                    | `ajuste` | Alta       | Antes de excluir uma despesa ou categoria, pedir confirmação ao usuário (`AlertDialog` do shadcn/ui).                                                                             |
| 10  | Residências: tirar lista/criação do menu e criar página de listagem + edição por residência | `spec`   | Alta       | **Spec 009 (ativa).** Remove o `HouseholdSwitcher` da sidebar; `/households` vira lista de todas as residências (definir ativa + editar + criar), e o detalhe atual vira `/households/[id]`. Autorização pela residência da rota (só admin edita/exclui). **Sem migration.** Dobra as sugestões: residência ativa no `AppHeader`, ativa destacada no topo, estado de primeiro acesso, `aria-label` nos botões só-ícone. Detalhamento em `PROMPT.md`. |
| 11  | Dashboard: relatórios por mês                                                       | `spec`   | Média      | **Spec 010.** Seletor de mês no Dashboard filtrando total/pago/pendente/gráfico por `dueDate`; meses disponíveis via `data/`. **Sem migration.** Dobra a sugestão: aplicar o mesmo filtro de mês na página de Despesas para consistência. Detalhamento abaixo em "Detalhamento das próximas specs". |
| 12  | Calculador de Dívidas: página no menu, total por mês e divisão por N pagantes (persistido) | `spec`   | Média      | **Novo lote.** Nova opção no menu + página onde o usuário escolhe o mês, vê o total de despesas daquele mês e informa o **número de pagantes** — que é **persistido** por `(residência, mês)` — mostrando o valor por pagante (ex.: Julho R$ 1.000,00 ÷ 3 = R$ 333,33). **Exige migration** (armazenar pagantes por mês). Base do card do Dashboard (item 13). Detalhamento em "Novo lote de melhorias". |
| 13  | Dashboard: card "Total Pagantes"                                                    | `spec`   | Média      | **Novo lote.** Card no Dashboard exibindo o **número de pagantes que o usuário informou no Calculador** para o mês selecionado. **Depende do item 12** (lê o dado que ele grava). `SummaryCards` hoje só renderiza R$ — precisa suportar tile de contagem. Sem migration própria (usa a do 12). Detalhamento em "Novo lote de melhorias". |
| 14  | Despesas: exibir "Total das Despesas"                                               | `ajuste` | Média      | **Novo lote.** Somar as despesas listadas e mostrar o total na página de Despesas (respeitando o filtro de mês ativo). Reusar `formatCentsAsCurrency`; cálculo/soma via `data/`. Detalhamento em "Novo lote de melhorias".            |

## Novo lote de melhorias (separação Spec × Direto)

> Lote solicitado em 2026-08-20. Base para atualizar `PROMPT.md` **quando** os itens de spec forem entrar
> em execução. Regra do projeto: **feature nova / mudança relevante → spec** (fluxo Spec Kit em PR próprio);
> **ajuste pontual → direto, sem spec**.
>
> **Decisão da usuária (2026-08-20):** o número de pagantes é **informado no Calculador** (por mês) e
> **persistido**; o card "Total Pagantes" do Dashboard apenas **lê** esse valor. Logo os itens **12 e 13 são
> acoplados** — 12 cria o armazenamento e 13 o consome. O item 14 permanece **direto**. Decidido também
> **não** exibir pagantes na tela de Despesas (o conceito vive no Calculador + Dashboard).
>
> **Status:** itens 12 + 13 foram consolidados numa **spec única** — **Spec 011 (Calculador de Dívidas +
> card "Total Pagantes")**, já pronta como bloco do `/speckit-specify` em `PROMPT.md`. Item 14 segue como
> ajuste direto.

### Pode ser feito por Spec

#### A — Calculador de Dívidas (item 12)

Nova opção no menu (`components/layout/app-sidebar.tsx`, array `NAV_ITEMS`, ícone `lucide-react` — ex.:
`Calculator`) apontando para uma página nova (ex.: `/debt-calculator`). Na página o usuário **escolhe o mês**;
o sistema mostra o **total de despesas daquele mês** e um campo para informar o **número de pagantes**. Com o
número informado, exibe o **valor por pagante** (ex.: Julho, total R$ 1.000,00, dividido por 3 → R$ 333,33).
O número de pagantes é **persistido por `(residência, mês)`** para o Dashboard poder exibi-lo (item 13).

Contexto atual (já verificado):

- Já existe `getAvailableMonths(householdId)` em `data/expenses.ts` (agrupa `dueDate` por mês) e
  `lib/report-period.ts` com `toMonthValue` / `formatMonthLabel` — reaproveitar para o seletor/recorte de mês.
- `getDashboardSummary(householdId, period)` (`data/dashboard.ts`) já sabe agregar o total por mês (`dueDate`)
  — reaproveitar a lógica de recorte para obter o total do mês.
- `formatCentsAsCurrency` em `lib/money.ts` para exibir os valores.
- Despesas **sem `dueDate`** existem (nullable) e hoje não entram em nenhum mês.

O que a spec precisa definir:

- **Persistência dos pagantes (exige migration):** novo model no Prisma para guardar o número de pagantes por
  mês (ex.: `MonthlyPayers { householdId, year, month, payersCount }` com `@@unique([householdId, year, month])`),
  ou campo equivalente. Mutação via Server Action (`next-safe-action` + `protectedActionClient`, `.inputSchema`),
  autorizada pela residência ativa; leitura via `data/`.
- **Total do mês:** obter o total de despesas do mês selecionado via `data/` (reusar o recorte por `dueDate`),
  sem chamar Prisma de componente.
- **Divisão por N pagantes:** N inteiro ≥ 1; valor por pagante = total ÷ N. Definir o **arredondamento**
  (ex.: `Math.round` em centavos) e o tratamento do **resto** (ex.: exibir só o valor por pagante, sem
  "acerto de sobra") — documentar a decisão.
- **Despesas sem `dueDate`:** decidir se entram num bucket "Sem data" ou ficam fora do cálculo — documentar.
- **Estados vazios:** mensagem quando a residência não tem despesas com mês / quando pagantes ainda não foi
  informado.

Fora de escopo: exportação; comparação entre meses. **Exige migration** (armazenar pagantes por mês).

#### B — Dashboard: card "Total Pagantes" (item 13)

Novo card no Dashboard exibindo o **número de pagantes que o usuário informou no Calculador** para o mês
selecionado. **Depende do item 12**, que cria o armazenamento — este item apenas **lê** esse valor.

> **Nota de sequenciamento:** como 13 consome o dado que 12 grava, há duas opções: (a) **uma spec só** que
> entrega Calculador + card (mais simples de coordenar a migration); (b) **duas specs** com 12 antes de 13.
> Recomendação: avaliar juntar numa spec só, já que compartilham o mesmo model/migration.

O que a spec precisa definir:

- **Fonte via `data/`:** função que retorna o número de pagantes do mês selecionado (ex.:
  `getMonthlyPayersCount(householdId, period)`), lendo o registro persistido pelo Calculador — sem Prisma em
  componente.
- **`SummaryCards`:** hoje só renderiza valores em R$ (`formatCentsAsCurrency`); adaptar para suportar um
  **tile de contagem** (número inteiro, sem R$) sem quebrar os cards atuais. Ícone `lucide-react` (ex.:
  `Users`), tokens de tema, medidas em `rem`.
- **Interação com o filtro de mês (spec 010):** o card **varia por mês** (é o valor informado para aquele mês);
  quando não houver pagantes informado para o mês, definir o estado (ex.: "—" ou "não informado").

### Pode ser feito direto (por Você)

#### C — Despesas: "Total das Despesas" (item 14) — `ajuste`

Somar as despesas listadas e exibir o **Total das Despesas** na página de Despesas
(`app/(app)/expenses/page.tsx`). Deve **respeitar o filtro de mês** já existente na página (a soma reflete
o recorte selecionado). Reaproveitar `formatCentsAsCurrency` (`lib/money.ts`); calcular a soma no `data/`
(ou derivar do resultado já carregado) — sem chamar Prisma de componente. Usar componentes shadcn/ui,
tokens de tema e `rem`. É só uma adição de UI + soma; **não precisa de spec**.

> **Decidido não incluir "Total Pagantes" na tela de Despesas.** O número de pagantes é parâmetro de rateio,
> não dado de despesa; mantê-lo só no Calculador (onde se informa) + Dashboard (onde se resume) evita espalhar
> o conceito por três telas. Despesas exibe apenas o Total das Despesas.

## Sequência de execução acordada

> Ordem combinada para retomar o trabalho (inclusive após um `clear` do chat). Seguir de cima para baixo.
> Atualizado em 2026-08-18. **Pendências abaixo (passos 3 e 4) — é aqui que um chat novo deve começar.**

1. ~~**Spec 005 — Datas em Despesas (backlog item 7)**~~ **Concluída** — absorveu o item 8 (bug de data).
2. ~~**Ajustes diretos + specs 006/007/008**~~ — **concluídos**:
   1. ~~**Item 9** — Confirmação de exclusão em Despesas e Categorias.~~ ✅
   2. ~~**Item 3** — "Total" → "Total Despesas" no Dashboard.~~ ✅
   3. ~~**Item 5** — Formatar valores do gráfico em R$.~~ ✅
   4. ~~**Spec 006** — Regras de senha no cadastro.~~ ✅
   5. ~~**Spec 007** — Cofrinho.~~ ✅
   6. ~~**Spec 008** — Cor da categoria.~~ ✅
   7. **Item 2** — Botão "+ criar nova residência" cortado. ⚠️ **Superado pela spec 009**, que remove o
      `HouseholdSwitcher` da sidebar (o botão problemático deixa de existir ali).

### Pendente (retomar aqui)

3. **Spec 009 — Residências: menu, listagem e edição por residência** (`spec`, Alta). **Ativa em `PROMPT.md`.**
   Remove o `HouseholdSwitcher` da sidebar; `/households` vira a lista de todas as residências (definir ativa,
   editar, criar) e o detalhe atual vira `/households/[id]`, com autorização pela residência da rota. **Sem
   migration.** Dobra as sugestões de UX (residência ativa no `AppHeader`, ativa destacada, primeiro acesso,
   acessibilidade dos botões só-ícone). Detalhamento completo em `PROMPT.md`.
4. **Spec 010 — Dashboard: relatórios por mês** (`spec`, Média). Seletor de mês filtrando os relatórios por
   `dueDate`; meses disponíveis via `data/`. **Sem migration.** Dobra a sugestão de aplicar o mesmo filtro na
   página de Despesas. Detalhamento em "Detalhamento das próximas specs" abaixo.

As duas specs são independentes (sem domínio em comum). Cada uma vai **isolada** pelo fluxo Spec Kit completo
(`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) e em PR próprio — **não bundlar
numa spec só**. Ordem: 009 (Alta) antes de 010 (Média). Ao iniciar a 010, mover seu bloco de detalhamento para
`PROMPT.md`.

## Detalhamento das próximas specs

### Spec 009 — Residências (ativa)

O bloco pronto para `/speckit-specify` está em `PROMPT.md`. Resumo do escopo: sidebar sem `HouseholdSwitcher`;
residência ativa no `AppHeader`; `/households` como lista (definir ativa + editar + criar, ativa destacada no
topo, tratamento de primeiro acesso, botões só-ícone com `aria-label`); `/households/[id]` com o conteúdo atual
de Residência, autorizando pela residência da rota (só ADMIN edita nome/convites/exclui; qualquer membro sai);
leitura via `data/`; `revalidatePath` e navegação corretos. Sem migration.

### Spec 010 — Dashboard: relatórios por mês (próxima)

Adiciona ao Dashboard a opção de **filtrar/mostrar os relatórios por mês**. Hoje o Dashboard
(`app/(app)/dashboard/page.tsx`) sempre agrega **todas** as despesas da residência ativa, sem recorte temporal.

Contexto atual (já verificado):

- `data/dashboard.ts` (`getDashboardSummary(householdId)`) agrega total, pago, pendente e distribuição por
  categoria de **todas** as despesas, sem filtro de data.
- A despesa (`Expense` em `prisma/schema.prisma`) tem `dueDate` e `paidDate` como `DateTime? @db.Date` (ambos
  **nullable**), com índice `@@index([householdId, dueDate])`. Datas de despesa vieram da spec 005.
- A UI usa `SummaryCards` e `CategoryBreakdown`; o cofrinho (`getHouseholdSavings`) é saldo acumulado, não mensal.
- A página de Despesas (`app/(app)/expenses/page.tsx` + `data/expenses.ts`) também lista tudo sem recorte de mês.

O que a spec precisa definir:

- **Seletor de mês**: controle (shadcn `Select` ou similar) que lista os meses disponíveis e escolhe o mês do
  relatório. Definir o campo de referência (`dueDate` como mês da despesa) e o padrão inicial (mês atual ou
  "Todos"). Decidir o tratamento de despesas **sem `dueDate`** (bucket "Sem data" / fora do recorte) e documentar.
- **Meses disponíveis via `data/`**: expor em `data/dashboard.ts` a lista de meses com despesas na residência
  (para popular o seletor), sem chamar Prisma de componente.
- **Agregação por mês**: `getDashboardSummary` passa a aceitar o mês/intervalo e filtra total, pago, pendente e
  distribuição por categoria por esse recorte, sem quebrar os consumidores atuais. Refletir em `SummaryCards` e
  `CategoryBreakdown`.
- **Estados vazios**: manter o "nenhuma despesa" já existente, agora coerente com o mês selecionado.
- **Cofrinho**: decidir explicitamente se o card é afetado pelo mês (recomendação: não, por ser saldo acumulado).
- **Consistência com Despesas (sugestão dobrada)**: aplicar o **mesmo filtro de mês na página de Despesas**,
  reutilizando o seletor e a lógica de recorte, para o usuário ter a mesma experiência nos dois lugares.

Fora de escopo: comparação entre meses/série temporal; exportação de relatório; migration; filtro por intervalo
customizado (só recorte por mês).

## Em andamento

_(vazio)_

## Concluído

- **Spec 005 — Datas em Despesas (backlog itens 7 e 8)** → `specs/005-expense-dates/`. Data de Vencimento,
  Data do Pagamento e opção "sem data de vencimento"; Data do Pagamento controla o estado "pago"; data das
  despesas legadas vira Data de Vencimento; Data do Pagamento no futuro é bloqueada. Corrige o bug de timezone
  (data aparecendo um dia antes).
- **Item 9 — Confirmação de exclusão em Despesas e Categorias**: `AlertDialog` do shadcn/ui via componente
  reutilizável `components/shared/confirm-delete-button.tsx`, aplicado em `expense-table.tsx` e `category-list.tsx`.
- **Item 3 — "Total" → "Total Despesas"** no Dashboard (`components/dashboard/summary-cards.tsx`).
- **Item 5 — Valores do gráfico em R$**: `formatter` no tooltip do gráfico de categorias
  (`components/dashboard/category-breakdown.tsx`) usando `formatCentsAsCurrency`.
- **Spec 006 — Regras de senha no cadastro** → mostra as regras de senha na tela de cadastro
  (`components/auth/password-requirements.tsx`).
- **Spec 007 — Cofrinho** → nova opção no menu, tela de cadastro do valor guardado e card no Dashboard; model
  novo no Prisma (`savings`).
- **Spec 008 — Cor da categoria** → `specs/008-category-color/`; paleta central em `lib/category-colors.ts`,
  campo `color` nullable em `Category` com fallback derivado.
- ~~**Item 2 — Botão "Criar nova residência" cortado em telas maiores**~~: **superado pela spec 009**, que
  remove o `HouseholdSwitcher` da sidebar — o botão problemático deixa de existir naquele contexto.
