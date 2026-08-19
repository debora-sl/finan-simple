# Feature Specification: Dashboard — relatórios por mês

**Feature Branch**: `010-dashboard-monthly-reports`

**Created**: 2026-08-19

**Status**: Pronto para Implementação

**Input**: User description: "Spec 010 — Dashboard: relatórios por mês (Média). Adiciona ao Dashboard a opção de filtrar/mostrar os relatórios por mês. Hoje o Dashboard sempre agrega todas as despesas da residência ativa, sem recorte temporal. Esta spec introduz um seletor de mês que recorta total, pago, pendente e distribuição por categoria por dueDate, e — como sugestão dobrada — aplica o mesmo recorte na página de Despesas para manter a experiência consistente nos dois lugares."

## Clarifications

### Session 2026-08-19

- Q: Quando o mês atual não tem despesas, ele deve aparecer no seletor? → A: O mês atual sempre aparece no seletor (mesmo sem despesas), por ser o recorte padrão; os demais meses seguem FR-007 (apenas os que têm despesas).
- Q: Qual referência de fuso horário determina o mês da `dueDate` e o "mês atual"? → A: Fuso fixo da aplicação `America/Sao_Paulo` (constante `APP_TIME_ZONE`), independente do fuso do servidor/deploy; o ano/mês do "mês atual" é resolvido nesse fuso via `Intl`, e os limites do mês são construídos em UTC a partir desse ano/mês.
- Q: Como o mês selecionado deve ser mantido (refresh/compartilhamento)? → A: Persistido em query param da URL (ex.: `?month=2026-08`); sobrevive ao refresh, é compartilhável, e a ausência do parâmetro representa o mês atual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver o relatório do Dashboard por mês (Priority: P1)

Um usuário abre o Dashboard e quer entender seus gastos de um mês específico, não de toda a
história da residência. Um seletor de mês no topo do Dashboard permite escolher entre os meses que
possuem despesas. Ao escolher um mês, os cartões de resumo (total, pago, pendente) e a distribuição
por categoria passam a refletir **apenas** as despesas daquele mês (com base na data de vencimento
da despesa). O mês atual é o recorte inicial exibido ao abrir o Dashboard.

**Why this priority**: É o coração da feature — sem o recorte por mês no Dashboard, não há entrega de
valor. Sozinho, já permite ao usuário analisar cada mês separadamente, que é o objetivo central.

**Independent Test**: Com uma residência que possui despesas em mais de um mês, abrir o Dashboard,
alternar o seletor entre dois meses e confirmar que total, pago, pendente e a distribuição por
categoria mudam de acordo com o mês escolhido.

**Acceptance Scenarios**:

1. **Given** uma residência com despesas em vários meses, **When** o usuário abre o Dashboard,
   **Then** o seletor de mês inicia no **mês atual** e os cartões e a distribuição por categoria
   refletem apenas as despesas desse mês.
2. **Given** o Dashboard aberto, **When** o usuário seleciona outro mês no seletor, **Then** total,
   pago, pendente e a distribuição por categoria são recalculados para o mês escolhido.
3. **Given** o seletor de mês, **When** ele é aberto, **Then** ele lista os meses que possuem
   despesas na residência ativa (mais recente primeiro) e a opção "Todos os meses".
4. **Given** o usuário escolhe "Todos os meses", **When** o recorte é aplicado, **Then** os cartões e
   a distribuição por categoria agregam todas as despesas da residência (comportamento anterior),
   incluindo despesas sem data de vencimento.

---

### User Story 2 - Filtrar a página de Despesas pelo mesmo mês (Priority: P2)

Para manter a experiência consistente, a página de Despesas ganha o **mesmo** seletor de mês. Ao
escolher um mês, a lista de despesas mostra apenas as despesas daquele mês (pela data de
vencimento), espelhando o recorte do Dashboard.

**Why this priority**: Complementa a US1 estendendo o mesmo recorte à listagem de despesas, mas o
Dashboard já entrega valor sem ela. É a "sugestão dobrada" da spec.

**Independent Test**: Na página de Despesas, alternar o seletor de mês e confirmar que a lista passa
a mostrar apenas as despesas do mês escolhido, e que "Todos os meses" volta a mostrar todas.

**Acceptance Scenarios**:

1. **Given** uma residência com despesas em vários meses, **When** o usuário abre a página de
   Despesas, **Then** o seletor de mês inicia no **mês atual** e a lista mostra apenas as despesas
   desse mês.
2. **Given** a página de Despesas, **When** o usuário seleciona outro mês, **Then** a lista é
   recarregada mostrando apenas as despesas com data de vencimento naquele mês.
3. **Given** o usuário escolhe "Todos os meses", **When** o recorte é aplicado, **Then** a lista
   mostra todas as despesas da residência, incluindo as sem data de vencimento.

---

### Edge Cases

- **Despesa sem data de vencimento (`dueDate` nulo)**: quando um mês específico está selecionado, a
  despesa sem data **não** entra no recorte (fica de fora de total, pago, pendente e categorias). Ela
  só aparece na opção "Todos os meses". Os meses disponíveis no seletor são derivados apenas de
  despesas que possuem data de vencimento.
- **Mês selecionado sem despesas**: se o usuário chega a um mês sem despesas (ex.: mês atual ainda sem
  lançamentos), o Dashboard mantém o estado vazio já existente ("nenhuma despesa"), agora coerente com
  o mês escolhido, e a página de Despesas mostra sua lista vazia correspondente.
- **Residência sem nenhuma despesa**: o seletor mostra "Todos os meses" e o **mês atual** (sempre
  presente como recorte padrão, mesmo sem despesas), e o estado vazio é exibido normalmente.
- **Cofrinho (savings)**: o card do cofrinho **não** é afetado pelo mês selecionado, por representar
  saldo acumulado e não um valor mensal; permanece exibindo o saldo acumulado da residência.
- **Mudança de residência ativa**: ao trocar a residência ativa, a lista de meses disponíveis é
  recalculada para a nova residência; se o mês atualmente selecionado não existir na nova residência,
  o recorte volta para o padrão (mês atual).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Dashboard MUST oferecer um **seletor de mês** que permite escolher o mês do relatório
  entre os meses que possuem despesas na residência ativa, além de uma opção **"Todos os meses"**.
- **FR-002**: O campo de referência para determinar o mês de uma despesa MUST ser a **data de
  vencimento** (`dueDate`). O ano+mês e o **"mês atual"** MUST ser derivados no **fuso fixo da
  aplicação `America/Sao_Paulo`** (constante `APP_TIME_ZONE`), de forma **independente do fuso do
  servidor/deploy**. Os limites do mês (`gte`/`lt`) que filtram `dueDate @db.Date` MUST ser
  construídos em UTC (`Date.UTC`) a partir desse ano/mês, como intervalo semiaberto `[gte, lt)`.
- **FR-003**: O recorte selecionado MUST ser aplicado ao **total**, ao **pago**, ao **pendente** e à
  **distribuição por categoria** exibidos no Dashboard.
- **FR-004**: O recorte inicial ao abrir o Dashboard MUST ser o **mês atual**.
- **FR-005**: A opção **"Todos os meses"** MUST agregar todas as despesas da residência, incluindo as
  despesas **sem data de vencimento**, reproduzindo o comportamento agregado anterior.
- **FR-006**: Quando um **mês específico** estiver selecionado, despesas **sem data de vencimento**
  (`dueDate` nulo) MUST ser **excluídas** de todos os números (total, pago, pendente, categorias).
- **FR-007**: A lista de **meses disponíveis** para o seletor MUST ser derivada apenas das despesas que
  possuem data de vencimento na residência ativa, ordenada do mês **mais recente para o mais antigo**.
  O **mês atual** MUST sempre constar no seletor (mesmo sem despesas), por ser o recorte padrão.
- **FR-008**: A lista de meses disponíveis MUST ser obtida por meio da **camada de dados** (`data/`),
  sem chamada direta ao banco a partir de componentes.
- **FR-009**: A agregação do Dashboard MUST aceitar o mês/intervalo selecionado e filtrar os números
  por esse recorte, **sem quebrar** os consumidores atuais (a chamada sem recorte MUST continuar
  válida e representar "Todos os meses").
- **FR-010**: A distribuição por categoria MUST refletir o mesmo recorte de mês aplicado aos cartões de
  resumo.
- **FR-011**: O estado vazio ("nenhuma despesa") MUST continuar existindo e MUST ser coerente com o mês
  selecionado (exibido quando o mês escolhido não possui despesas).
- **FR-012**: O card do **cofrinho** MUST NOT ser afetado pelo mês selecionado, permanecendo como saldo
  acumulado da residência.
- **FR-013**: A página de **Despesas** MUST oferecer o **mesmo** seletor de mês e MUST filtrar a lista
  de despesas pelo mês selecionado (pela data de vencimento), reutilizando a lógica de recorte.
- **FR-014**: Na página de Despesas, a opção **"Todos os meses"** MUST exibir todas as despesas
  (incluindo as sem data de vencimento) e um **mês específico** MUST exibir apenas as despesas com data
  de vencimento naquele mês.
- **FR-015**: O seletor de mês e os elementos relacionados MUST usar exclusivamente componentes
  shadcn/ui e tokens de tema, com medidas em `rem` e ícones `lucide-react`.
- **FR-016**: A leitura de dados por mês MUST validar/escopar pela residência ativa do usuário, sem
  expor despesas de outras residências.
- **FR-017**: O mês selecionado MUST ser persistido em **query param da URL** (ex.: `?month=2026-08`),
  sobrevivendo ao refresh e sendo compartilhável; a **ausência** do parâmetro MUST representar o
  **mês atual** (recorte padrão), e o valor correspondente a "Todos os meses" MUST ser um valor
  distinto e explícito no parâmetro (`?month=all`).

### Key Entities *(include if feature involves data)*

- **Despesa (Expense)**: lançamento financeiro da residência. Relevantes para esta feature: o valor, o
  status (pago/pendente), a **data de vencimento** (`dueDate`, que pode ser **nula**) e a **categoria**.
  O mês da despesa é determinado pela data de vencimento. Esta feature **não** altera o modelo de dados.
- **Mês disponível (bucket de relatório)**: representação de um mês (ano+mês) que possui ao menos uma
  despesa com data de vencimento na residência ativa; alimenta o seletor. Não é uma entidade
  persistida — é derivada das despesas existentes.
- **Recorte de relatório (seleção do usuário)**: o mês escolhido (ou "Todos os meses") que define o
  intervalo aplicado às agregações do Dashboard e à lista de Despesas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao abrir o Dashboard, 100% dos números (total, pago, pendente) e a distribuição por
  categoria correspondem ao **mês atual** por padrão.
- **SC-002**: Ao alternar o mês no seletor, total, pago, pendente e categorias refletem o mês escolhido
  em 100% dos casos.
- **SC-003**: O seletor lista 100% dos meses que possuem despesas com data de vencimento na residência
  ativa, e nenhum mês sem despesas.
- **SC-004**: Com um mês específico selecionado, nenhuma despesa sem data de vencimento é contabilizada
  nos números; com "Todos os meses", todas as despesas (com e sem data) são contabilizadas.
- **SC-005**: O card do cofrinho permanece inalterado ao trocar de mês em 100% das interações.
- **SC-006**: A página de Despesas aplica o mesmo recorte de mês da experiência do Dashboard, listando
  apenas as despesas do mês selecionado (ou todas em "Todos os meses").
- **SC-007**: O usuário consegue trocar o mês do relatório e ver os números atualizados sem recarregar
  a página manualmente, e a seleção sobrevive a um refresh e é compartilhável via URL (`?month=`).
- **SC-008**: Nenhuma regressão nas agregações existentes: a visão "Todos os meses" reproduz os mesmos
  números que o Dashboard exibia antes desta feature.

## Assumptions

- O modelo de dados **não muda**; não há migration. `dueDate` e `paidDate` seguem `nullable` conforme a
  spec 005, e o índice `@@index([householdId, dueDate])` já existente suporta o filtro por mês.
- O recorte por mês usa **`dueDate`** como referência (não `paidDate`), pois representa o mês ao qual a
  despesa pertence financeiramente.
- O padrão inicial é o **mês atual** (com "Todos os meses" disponível como alternativa explícita). Se o
  mês atual não tiver despesas, o estado vazio já existente é exibido — não há troca automática para
  outro mês.
- Despesas **sem `dueDate`** só aparecem na visão "Todos os meses"; ficam fora de qualquer mês
  específico. Essa decisão é intencional para evitar um bucket "Sem data" adicional no seletor nesta
  fase.
- O **cofrinho** não é recortado por mês (saldo acumulado), reutilizando `getHouseholdSavings` sem
  alteração.
- O seletor de mês é um **componente reutilizável** compartilhado entre Dashboard e Despesas, para
  manter DRY e consistência de experiência.
- A leitura dos meses disponíveis e das agregações por mês é feita por funções em `data/` (ex.:
  estender `data/dashboard.ts` e `data/expenses.ts`), sem chamar Prisma de componentes.
- O rótulo de cada mês no seletor é apresentado de forma legível ao usuário (ex.: "agosto de 2026"),
  respeitando o idioma da aplicação.

## Out of Scope

- Comparação entre meses ou série temporal (gráfico de evolução).
- Exportação de relatório.
- Filtro por **intervalo customizado** de datas (apenas recorte por mês).
- Qualquer **migration** ou alteração no modelo de dados.
- Bucket explícito "Sem data" no seletor (despesas sem data ficam apenas em "Todos os meses").
- Recorte do cofrinho por mês.
