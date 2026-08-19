# Quickstart — Validação: Residências (menu, listagem, edição por residência)

Guia de validação manual end-to-end. Referências de contrato: [data-layer](./contracts/data-layer.md),
[server-actions](./contracts/server-actions.md); modelo: [data-model](./data-model.md).

## Pré-requisitos

- Dependências instaladas (`pnpm install`) e banco acessível (Prisma 7).
- Um usuário autenticado **membro de ≥ 2 residências**, sendo **ADMIN** em pelo menos uma e
  **MEMBRO** (não admin) em outra. Um segundo usuário para validar convites/remoção.
- App em execução no ambiente do usuário (não iniciar `dev` automaticamente — regra do projeto).
- Portão de qualidade: `pnpm lint` sem erros.

## Cenários

### 1. Listar todas as residências (US1 · FR-001..003, FR-007, FR-019)
1. Abrir o item **"Residência"** no menu.
2. **Esperado**: lista mostra **todas** as residências do usuário com **nome** e **papel**
   (Admin/Membro); a **ativa** aparece **destacada e no topo** com indicador "Ativa"; botão
   **"Criar nova residência"** no **cabeçalho** da página.
3. Com apenas uma residência: ela aparece sem ação redundante de "Definir como ativa".

### 2. Trocar residência ativa pela listagem (US2 · FR-004, FR-005, FR-009, FR-017)
1. Em uma residência **não ativa**, acionar **"Definir como ativa"**.
2. **Esperado**: a lista se atualiza (novo destaque/ordem), o **header** passa a exibir a nova
   residência ativa, e a ação "Definir como ativa" **some** para a que virou ativa — tudo sem reload
   manual, em < 15s (SC-009).
3. A residência atualmente ativa **não** oferece "Definir como ativa" (só o indicador).

### 3. Editar residência específica pela rota (US3 · FR-006, FR-010..013)
1. Na listagem, acionar **"Editar"** numa residência que **não** é a ativa e onde você é **ADMIN**.
2. **Esperado**: abre `/households/[id]` com nome, membros, convidar, convites, sair e zona de perigo,
   todos operando sobre a **residência da rota**.
3. Alterar o **nome** e salvar → muda **apenas** naquela residência; a ativa (diferente) não é afetada
   (SC-004).
4. Abrir a edição de uma residência onde você é **MEMBRO (não admin)** → ações de admin (nome,
   convidar/convites, excluir) **não** aparecem; **"Sair"** aparece (SC-006).

### 4. Header mostra a residência ativa (US4 · FR-009, SC-007)
1. Navegar por Dashboard, Despesas, Categorias, Cofrinho.
2. **Esperado**: o **header** exibe sempre o nome da **residência ativa**, e reflete a troca feita na
   listagem.

### 5. Convidar/remover por residência da rota (FR-011, contrato `inviteMember`)
1. Na edição `[id]` (como ADMIN), convidar o segundo usuário por e-mail.
2. **Esperado**: o convite é criado **naquela** residência (não na ativa); aparece na lista de
   convites da rota. Remover um membro atua na residência da rota.

### 6. Excluir a residência aberta (FR-016)
1. Na edição `[id]` de uma residência que você administra, excluir.
2. **Esperado**: redireciona para **`/households`**; a residência some da lista; se a excluída era a
   ativa, outra residência assume como ativa (header atualizado).

### 7. Acesso negado (FR-014, SC-005)
1. Acessar `/households/[id]` com um **id inexistente** ou de residência da qual **não é membro**.
2. **Esperado**: acesso negado (página não encontrada / bloqueio), sem vazar dados.

### 8. Sidebar sem switcher (FR-008)
1. Inspecionar sidebar no **desktop** e no **menu mobile**.
2. **Esperado**: **sem** lista de residências (switcher) e **sem** "Criar nova residência" no menu; o
   item **"Residência"** permanece e leva à listagem.

## Regressão (SC-008)
- Confirmar que nome, membros, convites, sair e excluir continuam funcionando — agora pela edição por
  residência — sem perda de capacidade em relação ao comportamento anterior.
