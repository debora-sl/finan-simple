# Quickstart — Validação: Dashboard relatórios por mês

Roteiro de validação manual (o projeto não possui suíte automatizada). Referências de comportamento:
[contracts/data-layer.md](./contracts/data-layer.md) e [contracts/month-selector.md](./contracts/month-selector.md).

## Pré-requisitos

- Estar autenticado com uma **residência ativa** que possua despesas em **mais de um mês** (via `dueDate`)
  e **pelo menos uma despesa sem `dueDate`**.
- Ter uma despesa **paga** e uma **pendente** dentro de um mesmo mês para conferir os cartões.
- App rodando localmente (o usuário inicia o servidor — **não** rodar `npm run dev` para validar por conta própria).
- ESLint sem erros: `pnpm lint`.

## Cenário 1 — Dashboard inicia no mês atual (US1, SC-001)

1. Abrir `/dashboard`.
2. **Esperado**: o seletor de mês mostra o **mês atual**; total, pago, pendente e a distribuição por
   categoria refletem apenas as despesas com `dueDate` no mês atual. Se o mês atual não tiver despesas,
   o estado vazio "Nenhuma despesa registrada" aparece.

## Cenário 2 — Trocar de mês recalcula tudo (US1, SC-002/SC-007)

1. No Dashboard, abrir o seletor e escolher outro mês com despesas.
2. **Esperado**: sem reload manual, total/pago/pendente e as categorias mudam para o mês escolhido; a URL
   passa a conter `?month=YYYY-MM`.

## Cenário 3 — Lista de meses correta (SC-003)

1. Abrir o seletor de mês.
2. **Esperado**: aparecem "Todos os meses" + apenas os meses que possuem despesas com `dueDate`, do mais
   recente para o mais antigo. Nenhum mês sem despesas é listado.

## Cenário 4 — "Todos os meses" reproduz o agregado antigo (FR-005, SC-004/SC-008)

1. Selecionar **"Todos os meses"**.
2. **Esperado**: total/pago/pendente e categorias agregam **todas** as despesas, **incluindo** as sem
   `dueDate`; os números batem com o Dashboard anterior a esta feature. URL: `?month=all`.

## Cenário 5 — Despesa sem data só em "Todos os meses" (FR-006, SC-004)

1. Selecionar um mês específico.
2. **Esperado**: a despesa sem `dueDate` **não** entra em nenhum número.
3. Voltar para "Todos os meses" ⇒ ela volta a ser contabilizada.

## Cenário 6 — Cofrinho não muda com o mês (FR-012, SC-005)

1. Alternar entre vários meses.
2. **Esperado**: o card do cofrinho permanece com o **saldo acumulado**, inalterado.

## Cenário 7 — Página de Despesas espelha o recorte (US2, SC-006)

1. Abrir `/expenses`.
2. **Esperado**: o mesmo seletor inicia no **mês atual** e a tabela mostra só as despesas desse mês.
3. Trocar o mês ⇒ a tabela recarrega com as despesas do mês escolhido (por `dueDate`).
4. "Todos os meses" ⇒ mostra todas, inclusive as sem `dueDate`.

## Cenário 8 — Estado vazio coerente + mês atual sempre no seletor (FR-011, FR-007)

1. Com uma residência **sem nenhuma despesa** (ou com o mês atual sem lançamentos), abrir `/dashboard`.
2. **Esperado**: o seletor exibe "Todos os meses" **e o mês atual** como opção selecionada (mesmo sem
   despesas — a opção do recorte atual é injetada), sem `Select` vazio ou quebrado; o Dashboard mostra
   o estado vazio e a página de Despesas mostra a lista vazia correspondente.

## Cenário 9 — Troca de residência ativa (edge case)

1. Trocar a residência ativa para uma com meses diferentes.
2. **Esperado**: a lista de meses é recalculada; se o mês selecionado não existir na nova residência, o
   recorte volta ao **mês atual** e o seletor mantém uma opção correspondente ao recorte exibido (sem
   `Select` sem seleção).

## Checagem final

- [ ] `pnpm lint` sem erros.
- [ ] Todos os cenários acima conferem.
- [ ] Nenhuma chamada a Prisma fora de `data/`.
