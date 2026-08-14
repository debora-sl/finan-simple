# Quickstart & Validation: Cofrinho (valor guardado pela família)

**Feature**: 007-household-savings | **Date**: 2026-08-14

Guia de validação manual end-to-end. Prova que a feature satisfaz as User Stories e os Success Criteria do [spec](./spec.md). Detalhes de modelo e contrato em [data-model.md](./data-model.md) e [contracts/update-savings.md](./contracts/update-savings.md).

## Pré-requisitos

- Banco PostgreSQL acessível (conforme `.env`).
- Migração aplicada com o novo campo `Household.savingsInCents`:
  ```bash
  pnpm prisma migrate dev
  pnpm prisma generate
  ```
- Ao menos um usuário autenticado com uma residência ativa. Para o cenário multi-membro, uma residência com 2 membros.
- Lint/build sem erros (validação de conformidade — `npm run dev` é proibido pela constituição; use `pnpm lint` / `pnpm build`):
  ```bash
  pnpm lint
  pnpm build
  ```

## Cenários de validação

### US1 — Registrar e atualizar o valor guardado (P1)

1. **Estado inicial zero**: com uma residência sem valor cadastrado, abra o menu e clique em **"Cofrinho"**.
   - Esperado: a tela abre e exibe **R$ 0,00** (FR-003, FR-011; US1 cenário 1).
2. **Primeiro cadastro**: informe `150,75` e salve.
   - Esperado: sucesso (toast), o total passa a exibir **R$ 150,75**; ao recarregar a página, persiste (FR-004, FR-006, FR-008; SC-001 em < 5s; SC-002 precisão de centavos).
3. **Atualização por substituição**: informe `200,00` e salve.
   - Esperado: o total exibido passa a **R$ 200,00** (substitui o anterior, não soma) (FR-005; US1 cenário 3).
4. **Compartilhamento entre membros**: com um segundo membro da mesma residência, abra **"Cofrinho"**.
   - Esperado: vê **R$ 200,00** (mesmo valor) (FR-001; US1 cenário 4; SC-003).

### US2 — Card no Dashboard (P2)

5. Com um valor cadastrado (ex.: R$ 200,00), abra o **Dashboard**.
   - Esperado: um card exibe **R$ 200,00**, no mesmo padrão visual dos demais cards de resumo (FR-010; US2 cenário 1).
6. Em uma residência **sem** valor cadastrado, abra o Dashboard.
   - Esperado: o card do cofrinho exibe **R$ 0,00**, inclusive quando não há despesas (FR-011; US2 cenário 2).
7. Atualize o valor na tela do Cofrinho e volte ao Dashboard.
   - Esperado: o card reflete o novo total (FR-012; US2 cenário 3).

### Edge cases (validação)

8. **Zero**: informe `0` e salve → aceito; exibe **R$ 0,00** na tela e no card (FR-007).
9. **Negativo**: informe `-10` e salve → rejeitado com mensagem clara; valor não é alterado (FR-007; SC-004).
10. **Vazio / não numérico**: submeta vazio ou `abc` → rejeitado com mensagem orientando um valor monetário válido (FR-007; SC-004).
11. **Centavos**: informe `99,99` → exibido exatamente como **R$ 99,99**, sem arredondamento (FR-006; SC-002).
12. **Acesso de não-membro / sem residência**: um usuário sem residência ativa é direcionado ao onboarding; nenhuma escrita ocorre em residência à qual não pertence (o householdId é resolvido no servidor) (FR-009).

## Critérios de aceite do quickstart

- [ ] Todos os cenários US1 (1–4) passam.
- [ ] Todos os cenários US2 (5–7) passam.
- [ ] Todos os edge cases (8–12) passam.
- [ ] `pnpm lint` e `pnpm build` sem erros.
