# Quickstart — Validação: Gestão de Residências

Guia de validação manual da feature (não há suíte de testes automatizados no projeto). Cada cenário
mapeia uma User Story e seus critérios de aceite.

## Pré-requisitos

- Node + pnpm instalados; dependências: `pnpm install`.
- Prisma: gerar cliente e aplicar migração desta feature (inclui migração de dados existentes):
  ```
  pnpm prisma migrate dev
  ```
- Qualidade (Princípio IV): antes de concluir, `pnpm lint` deve passar; validar build com
  `pnpm build`. **Não** rodar `npm run dev` para validar (proibido pela constituição) — use os
  fluxos manuais abaixo no ambiente de execução já disponível.

## Cenário 1 — Primeira residência e isolamento (US1)

1. Cadastre um novo usuário sem convites pendentes e faça login.
2. Ao acessar `/expenses` (ou `/dashboard`), confirme o redirecionamento para `/households/new`.
   → *AC1: usuário sem residência é direcionado à criação.*
3. Crie "Casa Mãe". Confirme que você aparece como Administrador. → *AC2.*
4. Crie uma categoria e uma despesa. Confirme que ficam vinculadas a "Casa Mãe". → *AC3.*
5. Com um segundo usuário (outra residência), confirme que ele **não** vê os dados de "Casa Mãe".
   → *AC4, SC-002, SC-006.*

## Cenário 2 — Convidar membros e colaborar (US2)

1. Como Administrador de "Casa Mãe", em `/households`, convide o e-mail de um usuário já cadastrado.
   Confirme convite PENDING. → *AC1.*
2. Como convidado, aceite o convite; confirme acesso às despesas/categorias da residência. → *AC2.*
3. Convide um e-mail **sem** conta; cadastre-se com esse e-mail; confirme vínculo automático como
   Membro e que o convite deixou de existir/pendente. → *AC3, FR-016.*
4. Como Membro, edite uma despesa criada pelo Administrador. Confirme sucesso. → *AC4, FR-010.*
5. Como Administrador, cancele um convite pendente e tente aceitá-lo — deve ser rejeitado.
   → *AC5, FR-023.*
6. Como Administrador, remova um Membro; confirme que ele perde acesso. → *AC6, FR-018.*

## Cenário 3 — Múltiplas residências e casa ativa (US3)

1. Com um usuário em duas residências, abra o seletor no sidebar; confirme ambas listadas. → *AC1.*
2. Troque a casa ativa; confirme que dashboard/despesas/categorias refletem a nova residência em
   ≤ 2s. → *AC2, SC-003.*
3. Crie uma despesa na residência A; troque para B; confirme que ela não aparece. → *AC3, SC-002.*

## Cenário 4 — Papéis e sucessão (US4)

1. Como Membro, tente editar o nome da residência e gerenciar membros; confirme bloqueio.
   → *AC1, FR-011.*
2. Como Administrador, edite o nome; confirme atualização para todos. → *AC2.*
3. Como Administrador de residência com outros membros, saia; confirme que a administração passou ao
   membro de ingresso mais antigo (sem intervalo com 0/2 Administradores). → *AC3, SC-004.*
4. Como Administrador único, saia (ou cancele o cadastro); confirme que a residência e seus dados
   foram removidos. → *AC4, FR-020.*

## Cenário 5 — Landing ilustrativa (US5)

1. Acesse `/` **sem** estar autenticado; confirme a landing com exemplos estáticos de dashboard,
   categorias e resumos, e chamada para cadastro. → *AC1.*
2. Confirme (via Network/logs) que nenhuma consulta ao banco ocorre nesse carregamento e que os
   dados são ilustrativos. → *AC2, SC-007.*

## Referências

- Modelo de dados: [data-model.md](./data-model.md)
- Contratos de actions/dados: [contracts/server-actions.md](./contracts/server-actions.md),
  [contracts/data-functions.md](./contracts/data-functions.md)
