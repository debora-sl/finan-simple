# Quickstart — Validação Manual: Pré-Deploy Refinements

Roteiro de validação end-to-end das 7 histórias. O projeto não possui suíte automatizada; a validação é manual + ESLint. **Não** usar `npm run dev` para "verificar" durante a implementação (regra da constituição); a execução abaixo é o passo de validação do avaliador.

## Pré-requisitos

- Dependências instaladas: `pnpm install`.
- Migração aplicada: `pnpm prisma migrate dev` (adiciona `Invitation.invitedById` + relação de autor).
- Cliente Prisma gerado: `pnpm prisma generate`.
- ESLint sem erros: `pnpm lint`.
- Duas contas de teste (Admin `A` e convidado `B`) e ao menos uma residência com A como ADMIN.

## Cenários

### US1 — Fluxo de convites (P1)
1. Como A (ADMIN), convide o e-mail de B → convite aparece com status **Enviado**, identificando residência e destinatário. (SC-001)
2. Tente convidar um e-mail que já **recusou** anteriormente → bloqueado com mensagem específica; registro recusado mantido. (FR-020)
3. Como B, acesse a área autenticada → surge `Dialog` com "Olá, você recebeu um convite de {nome de A} para colaborar com o controle financeiro da residência: {nome}." e botões **Aceitar**/**Recusar**. (FR-005, SC-002)
4. Clique **Recusar** → status vira **Recusado** para ambos; B não ganha acesso. (FR-006)
5. Novo convite a B, e como A **cancele** enquanto pendente → some para B. (FR-004)
6. Concorrência: com convite pendente, A cancela e B responde quase junto → a segunda operação falha com "não está mais pendente". (edge case)

### US2 — Excluir a própria conta (P1)
1. Perfil → "Excluir conta" abre `Dialog` exigindo **senha** (confirmação explícita). (FR-008)
2. Confirmar com senha correta → sessão encerra, redireciona a `/login`; login com essa conta deixa de funcionar. (SC-004)
3. Se A era ADMIN com outros membros → administração transferida ao membro ativo mais antigo. (FR-009)
4. Se A era único integrante → residência e dados removidos. (FR-009)
5. Verificar ausência de órfãos (sessões, contas, memberships, convites-autor pendentes). (FR-010, FR-015)
6. Abandonar o dialog → nada muda. (edge case)

### US3 — Excluir uma residência (P1)
1. Como ADMIN → botão de excluir abre `Dialog` de confirmação. (FR-012)
2. Como MEMBER → ação negada com "Apenas o Administrador...". (FR-011)
3. Confirmar → despesas, categorias, convites e memberships removidos; todos perdem acesso. (FR-013)
4. Se era a residência **ativa** de alguém → `activeHouseholdId` reajustado para outra ou fluxo `/households/new`. (FR-014, SC-005)

### US4 — Mensagens de erro em pt-BR (P2)
1. Login com e-mail **sem conta** → mensagem específica sugerindo cadastro. (FR-017)
2. Login com senha **incorreta** (e-mail existente) → "Senha incorreta." (FR-017)
3. Signup com e-mail já cadastrado / senha fraca / e-mail inválido → mensagens pt-BR corretas. (FR-018)
4. Alterar senha com senha atual incorreta / nova inválida ou igual → mensagem específica. (FR-019)
5. Ação protegida com sessão expirada → mensagem clara + redirect ao login. (FR-021)
6. Confirmar: nenhuma mensagem crua em inglês do provedor em qualquer fluxo. (SC-003)

### US5 — Saudação (P2)
1. Autenticado, navegue por dashboard/despesas/categorias/residência/perfil → "Olá, {nome}" consistente no topo. (SC-006)
2. Usuário com nome vazio → saudação segura sem quebra. (edge case)

### US6 — Entrada do visitante (P2)
1. Deslogado, abra o app → landing com exemplos **estáticos** (sem dados reais/consulta ao banco). (FR-024)
2. Hero com "Entrar" e "Cadastrar" evidentes e acionáveis em <10s. (SC-007)
3. Autenticado acessando a raiz → redireciona para `/dashboard`. (FR-025)

### US7 — Responsividade (P3)
1. Percorra landing + telas internas em ≈360px, ≈768px, ≥1024px → sem quebras nem rolagem horizontal indevida. (SC-008)
2. Tela pequena → navegação lateral colapsa em menu acessível (`Sheet`), com botão de fechar nativo. (FR-027)
3. Tabelas/cards/gráficos reorganizam sem estourar o layout; valores financeiros em destaque, tokens de tema consistentes. (FR-026)

## Critério de aceite geral
- `pnpm lint` sem erros.
- Todos os cenários acima observados manualmente conforme os SC referenciados.

Referências: [data-model.md](./data-model.md) · [contracts/](./contracts/) · [spec.md](./spec.md)
