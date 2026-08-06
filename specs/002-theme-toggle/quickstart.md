# Quickstart: Validação da Alternância de Tema Claro/Escuro

Roteiro de validação manual ponta a ponta. O projeto não possui suíte de testes automatizados; a
verificação é manual + `pnpm lint`.

## Pré-requisitos

- Dependências instaladas (`pnpm install`) — `next-themes` já consta em `package.json`.
- Estar autenticado para acessar as telas com a sidebar (`app/(app)/*`).

## Portão de qualidade

```bash
pnpm lint
```

Deve passar sem erros (constituição: ESLint deve passar antes de concluir). NÃO executar
`npm run dev`/`pnpm dev` para "testar" (proibido pela constituição) — a validação de comportamento
abaixo é feita navegando na aplicação já em execução no ambiente do usuário.

## Cenários de validação

### C1 — Alternar tema (US1 / FR-001, FR-002, FR-003)

1. Abrir uma tela autenticada (ex.: `/dashboard`).
2. Localizar o botão de tema na sidebar, próximo ao "Sair".
3. Acionar o botão.
   - **Esperado**: toda a interface troca de tema imediatamente, sem recarregar; o ícone alterna
     entre `Sun` (claro) e `Moon` (escuro) refletindo o novo estado.
4. Acionar novamente → volta ao tema anterior.

### C2 — Persistência (US2 / FR-005)

1. Escolher o tema escuro.
2. Recarregar a página (F5).
   - **Esperado**: permanece no tema escuro.
3. Abrir a aplicação em uma nova aba do mesmo navegador.
   - **Esperado**: abre no tema escuro.

### C3 — Tema do sistema na primeira visita (US3 / FR-006)

1. Limpar a preferência salva: no DevTools → Application → Local Storage, remover a chave `theme`.
2. Configurar o SO/navegador em modo escuro e recarregar.
   - **Esperado**: a aplicação abre no tema escuro.
3. Repetir com o SO em modo claro.
   - **Esperado**: a aplicação abre no tema claro.

### C4 — Sem flash no carregamento (Edge Case / FR-007, SC-004)

1. Com tema escuro salvo, recarregar a página várias vezes.
   - **Esperado**: nenhum flash perceptível do tema claro antes do escuro (e vice-versa).

### C5 — Acessibilidade do controle (Edge Case / FR-008)

1. Navegar até o botão de tema apenas pelo teclado (Tab).
   - **Esperado**: o botão recebe foco visível.
2. Acionar com Enter/Espaço.
   - **Esperado**: o tema alterna.
3. Inspecionar o botão.
   - **Esperado**: possui `aria-label` textual descrevendo a ação.

### C6 — Consistência visual em ambos os temas (FR-009)

1. Em cada tela (`/dashboard`, `/expenses`, `/categories`), alternar entre claro e escuro.
   - **Esperado**: textos, cards, tabelas, gráficos e badges permanecem legíveis e visualmente
     consistentes nos dois temas (cores vindas dos tokens de `globals.css`).

### C7 — Storage indisponível (Edge Case)

1. Bloquear o armazenamento do navegador (ex.: DevTools, modo que impede `localStorage`).
2. Alternar o tema.
   - **Esperado**: a troca funciona na sessão atual; após recarregar, pode não persistir — sem
     erro que quebre a aplicação.

## Referências

- Contrato de comportamento e configuração do provider: [contracts/theme-toggle.md](./contracts/theme-toggle.md)
- Estado/persistência: [data-model.md](./data-model.md)
- Decisões técnicas: [research.md](./research.md)
