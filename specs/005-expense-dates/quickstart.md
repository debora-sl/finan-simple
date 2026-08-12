# Quickstart — Validação: Datas de Vencimento e Pagamento em Despesas

Guia de validação manual (o projeto não possui suíte automatizada). Referências: [data-model.md](./data-model.md), [contracts/](./contracts/).

## Pré-requisitos

- Dependências instaladas (`pnpm install`).
- `DATABASE_URL` apontando para o Postgres (Neon) de desenvolvimento.
- Usuário autenticado com uma residência ativa e ao menos uma despesa legada existente (para validar SC-002).

## Setup

```bash
# 1. Consultar docs de versão antes de codar (Princípio V)
#    Context7: Prisma 7 (@db.Date, migrate) e Next.js 16

# 2. Gerar a migração SEM aplicar e editar à mão (preserva dados legados)
pnpm prisma migrate dev --create-only --name expense_dates
#    Editar o SQL: RENAME date→dueDate, cast ::date, DROP NOT NULL,
#    ADD paidDate date, DROP isPaid, ajustar índice (ver research.md §5)

# 3. Aplicar a migração e regenerar o client
pnpm prisma migrate dev

# 4. Portão de qualidade obrigatório
pnpm lint
```

> NÃO rodar `npm run dev`/`next dev` para validar (Constituição).

## Cenários de validação

### US1 — Vencimento e "Sem data de vencimento" (P1)

1. Nova despesa informando `Vencimento = 20/08/2026` → salva e aparece na listagem com **20/08/2026** (não 19/08). *(AC1, FR-001)*
2. Nova despesa marcando `Sem data de vencimento` → campo de data deixa de ser exigido; salva sem vencimento; listagem mostra **Sem vencimento**. *(AC2/AC3, FR-002, FR-004)*
3. Tentar salvar sem vencimento e sem marcar a opção → bloqueado com mensagem orientando. *(AC4, FR-003)*
4. Editar uma despesa alterando o vencimento (ou marcando "Sem data de vencimento") → alteração persiste na listagem. *(AC5)*
5. Com despesas com e sem vencimento cadastradas → as **sem vencimento aparecem ao final** da lista, após todas as que têm data de vencimento. *(FR-004)*

### US2 — Data exibida exatamente como informada (P1)

1. Cadastrar `20/08/2026` → listagem e formulário de edição mostram **20/08/2026**. *(AC1/AC2, FR-007, SC-001)*
2. Ajustar o fuso do dispositivo para **UTC−3** e depois para um fuso **positivo**; recarregar → a data permanece **20/08/2026** em ambos. *(AC3)*
3. Abrir uma despesa **legada** (criada antes desta feature) → a data exibida corresponde ao dia pretendido, sem deslocamento de um dia. *(AC4, FR-008, SC-002)*

### US3 — Data do Pagamento (P2)

1. Em despesa em aberto, informar `Pagamento` e salvar → passa a exibir a data de pagamento e status **Paga**. *(AC1, FR-005/FR-006)*
2. Visualizar → data de pagamento exibida exatamente como informada (sem deslocamento). *(AC2, FR-007)*
3. Despesa sem pagamento → identificada como **Pendente**. *(AC3)*
4. Remover a data de pagamento e salvar → volta a **Pendente**. *(AC4)*
5. Informar `Pagamento` no futuro (> hoje) → salvamento rejeitado com mensagem. *(AC5, FR-009)*
6. Ajustar o dispositivo para um fuso **positivo** (ex.: UTC+13) perto da virada do dia, de modo que o dia local esteja à frente do UTC; informar `Pagamento` = **hoje local** → salvamento **aceito** (a validação usa o dia local do usuário, não o UTC do servidor). *(FR-009, clarificação 2026-08-11)*

### Edge cases

- Pagamento anterior ao vencimento (antecipado) → permitido.
- Pagamento muito posterior ao vencimento (atraso) → permitido.
- "Sem data de vencimento" **com** data de pagamento preenchida → permitido.
- Alternar "Sem data de vencimento" com uma data já preenchida → data descartada de forma clara; ao desmarcar, campo volta a ser exigido.

### Usabilidade (SC-005)

- Cadastrar uma despesa completa (com Data de Vencimento e Data do Pagamento) apoiando-se **apenas** nos rótulos e nas mensagens exibidas na própria tela, sem instruções externas → conclusão bem-sucedida. *(SC-005)*

## Resultados esperados (Success Criteria)

- **SC-001/SC-002**: nenhuma data exibida com deslocamento de dia, em qualquer fuso, para despesas novas e legadas.
- **SC-003**: cadastro "sem data de vencimento" concluído sem informar prazo.
- **SC-004**: status Paga/Pendente coerente em toda a UI conforme presença de `paidDate`.
- **SC-005**: cadastro concluído apenas com os rótulos/mensagens da tela.
- Portão: `pnpm lint` sem erros.
