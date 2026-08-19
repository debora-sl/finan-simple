# Phase 0 — Research: Dashboard relatórios por mês

## 1. Onde manter o estado do recorte de mês

- **Decisão**: Manter na **URL** como query param `?month=YYYY-MM` (mês específico) ou `?month=all`
  (Todos os meses). A ausência do param resolve para o **mês atual** (padrão).
- **Rationale**:
  - As páginas são Server Components; ler `searchParams` (Promise, confirmado em
    `node_modules/next/dist/docs/.../file-conventions/page.md`) opta a página por dynamic rendering e
    permite buscar os dados já recortados na camada `data/`, satisfazendo SC-007 (sem reload manual).
  - URL compartilhável/bookmarkável e consistente entre Dashboard e Despesas.
  - O componente cliente só precisa escrever o param via `useRouter().replace(...)`; o re-fetch é do servidor.
- **Alternativas consideradas**:
  - Estado local (`useState`) + fetch no cliente: violaria o Princípio II (dados via `data/`) e exigiria
    endpoints/actions de leitura desnecessários.
  - Cookie de preferência: some da URL, não compartilhável, e complica o "mês atual como padrão".

## 2. Como o seletor atualiza a URL sem recarregar

- **Decisão**: Client Component usando `useRouter`, `usePathname` e `useSearchParams` de
  `next/navigation`; ao trocar de valor, **preservar os demais query params** partindo dos atuais
  (`const params = new URLSearchParams(searchParams.toString()); params.set("month", value);`) e chamar
  `router.replace(\`${pathname}?${params.toString()}\`, { scroll: false })`.
- **Rationale**: `replace` navega no App Router disparando re-render do Server Component sem full reload
  e sem empilhar histórico a cada troca. Padrão já usado no projeto (`next/navigation` em vários componentes).
- **Alternativas**: `<Link>` por opção — inviável dentro de um `Select`; `router.push` — polui histórico.

## 3. Representação do recorte (period) e filtro por mês

- **Decisão**: Helper puro `lib/report-period.ts` que converte o param em um `ReportPeriod`:
  - `{ kind: "all" }` → sem filtro de data (comportamento agregado anterior, inclui `dueDate` nulo).
  - `{ kind: "month", year, month, gte, lt }` → filtro `dueDate: { gte, lt }`, onde `gte` é o 1º dia do
    mês e `lt` é o 1º dia do mês seguinte (intervalo semiaberto).
- **Rationale**: Intervalo semiaberto `[gte, lt)` sobre `dueDate` usa o índice `@@index([householdId, dueDate])`
  e evita ambiguidades de fim de mês. Um mês específico **exclui** `dueDate = null` naturalmente (FR-006),
  pois `null` não satisfaz `gte/lt`. Centralizar o parse garante DRY entre as duas telas e a camada de dados.
- **Alternativas**: Filtrar por `EXTRACT(month/year)` — não usa o índice de intervalo e complica timezone.

## 4. Timezone / limites de mês com `@db.Date`

- **Decisão**: Duas etapas distintas, com uma constante `APP_TIME_ZONE = "America/Sao_Paulo"`:
  1. **Resolução do (ano, mês) do "mês atual"**: derivada no **fuso fixo `America/Sao_Paulo`** via
     `Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE, year: "numeric", month: "2-digit" }).formatToParts(new Date())`,
     nunca do fuso do processo/servidor (`getFullYear`/`getMonth`) nem de `getUTC*` crus.
  2. **Limites do mês (`gte`/`lt`)**: conhecidos `(year, month)`, construídos em **UTC**
     (`Date.UTC(year, monthIndex, 1)`) para casar com `dueDate @db.Date` (data pura), intervalo
     semiaberto `[gte, lt)`.
- **Rationale**: Separar "qual é o mês atual" (depende do fuso do usuário ⇒ `America/Sao_Paulo`) de
  "quais os limites do intervalo" (comparação com data pura ⇒ UTC) evita dois bugs: (a) o mês atual
  virar cedo/tarde perto da meia-noite conforme o fuso do deploy, e (b) um fuso negativo jogar o dia 1
  para o mês anterior no filtro. O fuso fixo torna o resultado determinístico independentemente do deploy.
- **Alternativas**: Horário local do servidor (`getFullYear`/`getMonth`) — frágil e dependente do fuso
  do deploy (geralmente UTC em produção), descartado; UTC cru para o mês atual — erra o recorte perto
  da virada de mês para o usuário em `America/Sao_Paulo`, descartado.

## 5. Lista de meses disponíveis

- **Decisão**: `getAvailableMonths(householdId)` na camada de dados retorna os meses distintos que
  possuem despesas com `dueDate` não nulo, ordenados do mais recente para o mais antigo. Implementar com
  `prisma.expense.findMany({ where: { householdId, dueDate: { not: null } }, select: { dueDate }, orderBy })`
  e reduzir para `{ year, month }` distintos no TypeScript (volume por residência é pequeno).
- **Rationale**: Deriva do dado real (FR-007); simples e sem SQL bruto. `groupBy` por mês exigiria SQL raw
  por causa de truncamento de data; a redução em memória é suficiente na escala do projeto.
- **Alternativas**: `$queryRaw` com `date_trunc` — mais performático em grande escala, porém desnecessário
  agora e menos portável; fica registrado como otimização futura se o volume crescer.

## 6. Rótulo do mês (idioma)

- **Decisão**: Formatar como "agosto de 2026" via `Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })`.
- **Rationale**: Respeita o idioma da aplicação (pt-BR) sem dependência extra; consistente com o padrão do projeto.
- **Alternativas**: Mapa manual de nomes de meses — reinventa o `Intl` (viola DRY).

## 7. Retrocompatibilidade das funções de dados

- **Decisão**: `getDashboardSummary(householdId, period?)` e `getExpenses(householdId, period?)` recebem o
  período como **parâmetro opcional**; omitido ⇒ `{ kind: "all" }` (comportamento atual preservado, FR-009/SC-008).
- **Rationale**: Não quebra consumidores atuais e mantia a superfície mínima.
- **Alternativas**: Novas funções separadas — duplicaria lógica de agregação (viola DRY).
