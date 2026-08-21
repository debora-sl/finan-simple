# Quickstart: Calculador de Dívidas + card "Total Pagantes"

Guia de validação end-to-end. Referencia [data-model.md](./data-model.md) e
[contracts/set-monthly-payers.md](./contracts/set-monthly-payers.md).

## Pré-requisitos

- Dependências instaladas (`pnpm install`).
- Banco PostgreSQL configurado (`DATABASE_URL`).
- Usuário autenticado com uma residência ativa que possua **despesas com data de vencimento** em
  pelo menos um mês (ex.: R$ 1.000,00 em Julho/2026).

## Setup (após implementar o schema)

```bash
pnpm prisma migrate dev --name add_monthly_payers
pnpm prisma generate
pnpm lint
```

> Não rodar `npm run dev` para validar (Princípio de Fluxo de Qualidade / CLAUDE.md). Usar
> `pnpm build` se precisar de verificação de compilação.

## Cenário 1 — Calcular e persistir (História 1)

1. Abrir **Calculador de Dívidas** pelo item de menu na navegação (FR-001).
2. Selecionar o mês **Julho/2026** no seletor (sem opção "Todos os meses") (FR-002).
3. Conferir que o **total do mês** exibido é `R$ 1.000,00` (mesma regra da spec 010) (FR-003).
4. Informar **3** pagantes (FR-004).
5. Esperado: **valor por pagante = R$ 333,33** exibido imediatamente (FR-005/FR-006).
6. Recarregar a página com Julho selecionado → o campo de pagantes vem **preenchido com 3** e o
   valor por pagante é recalculado (FR-010, Acceptance Scenario 2).

## Cenário 2 — Atualizar pagantes (História 1, Scenario 3)

1. Com Julho selecionado, alterar de 3 para **4** pagantes e confirmar.
2. Esperado: novo valor por pagante = `R$ 250,00`; o registro do mês é **substituído** (FR-008).

## Cenário 3 — Card "Total Pagantes" no Dashboard (História 2)

1. Abrir **Dashboard** e selecionar **Julho/2026**.
2. Esperado: card **"Total Pagantes"** exibe **3** (ou o último valor salvo), como contagem inteira
   sem símbolo monetário, sem quebrar os cards monetários (FR-011/FR-013, SC-003).
3. Selecionar um mês **sem** pagantes informados → card exibe **"—"** (FR-012, SC-005).
4. Selecionar **"Todos os meses"** → card exibe **"—"** (Assumptions).

## Cenário 4 — Validação (SC-004)

1. No Calculador, informar `0`, vazio, `-2` ou `2,5` pagantes.
2. Esperado: mensagem de erro amigável; **nenhum** cálculo é feito e nada é gravado (FR-015).

## Cenário 5 — Estados vazios (FR-014)

1. Residência **sem** despesas com mês: Calculador mostra estado vazio orientando a cadastrar
   despesas com data de vencimento.
2. Mês selecionado **sem** pagantes: campo vazio, sem valor por pagante até informar.

## Cenário 6 — Autorização (SC-006)

1. **Escrita**: confirmar que a action `setMonthlyPayers` escopa sempre à residência ativa
   (`getActiveHousehold`) e não aceita `householdId` do cliente ⇒ impossível gravar pagantes de
   outra residência (FR-009).
2. **Leitura**: confirmar que a leitura (`getMonthlyPayers`) no Calculador (`page.tsx`) e no
   Dashboard (`page.tsx`) recebe sempre o `householdId` derivado da sessão via `getActiveHousehold`
   (nunca de `searchParams`/cliente) ⇒ o usuário só enxerga pagantes da própria residência ativa
   (FR-009). Com duas residências distintas, alternar a residência ativa e verificar que o número
   de pagantes exibido muda de acordo, sem vazamento entre residências.

## Casos-limite adicionais

- **Total do mês = R$ 0,00** → valor por pagante = `R$ 0,00` para qualquer N (Edge Cases).
- **N = 1** → valor por pagante = total do mês (SC-002).
- **Divisão com resto** → valor por pagante arredondado ao centavo mais próximo, sem acerto de sobra.
