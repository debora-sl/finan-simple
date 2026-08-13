# Quickstart — Validação: Regras de Senha no Cadastro

Guia de validação manual ponta a ponta. Cobre as histórias US1 e US2 e os critérios FR-001…FR-011 / SC-001…SC-005.

> O projeto não possui suíte de testes automatizados; a validação é manual pela tela de cadastro. Não rode `npm run dev` como forma de "checar mudanças" isoladas (Princípio do projeto) — use uma sessão de desenvolvimento já em execução ou o fluxo padrão do time para abrir a aplicação.

## Pré-requisitos

- Dependências instaladas (`pnpm install`).
- Banco/`.env` configurados como no restante do projeto.
- Referências: [contracts/password-policy.md](./contracts/password-policy.md), [data-model.md](./data-model.md).

## Verificação estática (antes da UI)

```bash
pnpm lint
```

- [x] ESLint passa sem erros (Princípio IV).
- [x] Busca por literais soltos: nenhum `8`/`128` de comprimento de senha fora de `lib/validation/password-policy.ts`.

## Cenário 1 — US1: regras visíveis antes de interagir (FR-001, FR-002, FR-003, SC-001)

1. Abrir a tela de cadastro (`/signup`) sem digitar nada.
2. **Esperado**: abaixo do campo "Senha", texto de apoio legível descrevendo a política — inclui "ao menos 8 caracteres" e "no máximo 128 caracteres", em pt-BR e sem jargão.
3. **Esperado**: as regras aparecem sem exigir foco no campo nem submissão.

- [ ] Regras visíveis no carregamento, próximas ao campo de senha.
- [ ] Menciona mínimo de 8 e máximo de 128.

## Cenário 2 — US2: checklist em tempo real (FR-005, FR-006)

1. No campo senha, digitar progressivamente `1234567` (7 caracteres).
2. **Esperado**: item "Ao menos 8 caracteres" permanece **pendente**. O checklist contém **apenas** esse item — o máximo de 128 não é item do checklist (aparece só como texto de apoio).
3. Digitar mais um caractere → `12345678` (8).
4. **Esperado**: "Ao menos 8 caracteres" muda para **atendido** imediatamente, sem submeter.
5. Apagar um caractere → volta a 7.
6. **Esperado**: o item volta a **pendente** (FR-006).

- [ ] Estado muda ao adicionar e ao remover caracteres, sem submissão.
- [ ] Campo vazio no load: único item do checklist ("Ao menos 8 caracteres") pendente (US2-AS1: todos pendentes); o máximo de 128 não aparece como item do checklist.

## Cenário 3 — Acessibilidade (FR-008, SC-005)

1. Com um leitor de tela ativo, focar o campo e digitar até atingir 8 caracteres.
2. **Esperado**: a mudança de estado é anunciada (região `aria-live`), e cada item comunica seu estado por **ícone + texto**, não só por cor.
3. Desativar cor (ou simular daltonismo) e confirmar que atendido/pendente ainda são distinguíveis.

- [ ] Estado perceptível por leitor de tela.
- [ ] Estado não depende exclusivamente de cor (ícone `Check`/`Circle` + texto).

## Cenário 4 — Consistência cliente/servidor e botão de submit (FR-004, FR-007, FR-011, SC-002, SC-003)

1. Digitar senha válida (ex.: `senha123`, 8 chars) e submeter com nome/e-mail válidos.
2. **Esperado**: cadastro aceito; nenhuma rejeição por comprimento de senha.
3. Com o campo de senha vazio ou com senha de 7 caracteres, observar o botão "Criar conta".
4. **Esperado**: o botão permanece **habilitado** (não é desabilitado por requisitos de senha não atendidos); só fica indisponível durante o carregamento (FR-011).
5. Tentar submeter com senha de 7 caracteres.
6. **Esperado**: bloqueado no cliente com mensagem "A senha deve ter ao menos 8 caracteres" — coerente com o checklist (não introduz regra nova).
7. (Opcional) Colar senha com 129 caracteres.
8. **Esperado**: bloqueado com mensagem coerente com "no máximo 128 caracteres".

- [ ] Botão "Criar conta" permanece habilitado com senha inválida/vazia (exceto durante o carregamento) (FR-011).
- [ ] Senha marcada como "todos atendidos" pelo checklist nunca é rejeitada pelo servidor (SC-003).
- [ ] Senha pendente no checklist nunca é aceita (SC-003).
- [ ] Mensagens de erro consistentes com as regras exibidas (FR-007).

## Cenário 5 — Espaços em branco (Edge Case)

1. Digitar 8 espaços no campo de senha.
2. **Esperado**: "Ao menos 8 caracteres" **atendido** (contagem sobre o valor cru, sem `trim`), coerente com o que o servidor validaria — checklist não diverge da submissão.

- [ ] Contagem do checklist == contagem da validação efetiva (sem recorte silencioso).

## Resultado

- [ ] Todos os cenários acima passam → feature atende US1, US2 e os critérios de sucesso da spec.
