# Melhorias de experiência e visual antes do deploy

Conjunto de refinamentos de UX, mensagens de convite e responsividade a serem aplicados
sobre o sistema de controle financeiro por residências já existente, preparando o produto
para publicação (deploy).

## Objetivo

Deixar o produto pronto para o primeiro público: uma entrada clara para visitantes, uma
experiência acolhedora para o usuário logado (saudação personalizada), um fluxo de convites
compreensível de ponta a ponta (com mensagem amigável e status visíveis tanto para quem
convida quanto para quem é convidado) e uma interface moderna, limpa e totalmente responsiva.

## Contexto do que já existe

- A página inicial (`app/page.tsx`) já exibe uma landing com exemplos ilustrativos e estáticos
  (hero, resumo, dashboard e categorias) para visitantes não logados, e redireciona o usuário
  autenticado para `/dashboard`. O hero já traz os botões "Entrar" e "Criar conta grátis".
- O fluxo de residências, papéis (Administrador/Membro), múltiplas residências, seletor de
  residência ativa e isolamento de dados já está implementado.
- Convites já podem ser enviados (`invite-form`), aceitos (`accept-invitation`) e cancelados
  pelo administrador (`cancel-invitation`).
- Existe um design system em `design/` (tokens de cor, tipografia, espaçamento e componentes
  de finance) que deve guiar o visual.

## Melhorias solicitadas

### 1. Entrada do visitante na página inicial

- Ao abrir o aplicativo sem estar logado, o visitante já cai na página inicial com os exemplos
  fictícios de dashboard, resumo e categorias (comportamento atual).
- A página inicial deve deixar evidentes, na área superior/hero, as ações de **Entrar** (login)
  e **Cadastrar** (criar conta).
- Revisar e enriquecer os exemplos estáticos para que comuniquem bem o produto e incentivem o
  cadastro, sem representar dados reais nem consultar o banco.

### 2. Saudação do usuário logado

- Dentro do aplicativo (área autenticada), na parte superior, deve aparecer uma saudação com o
  nome do usuário logado, no formato "Olá, {nome}".
- A saudação deve estar visível de forma consistente nas telas internas (dashboard, despesas,
  categorias, residência, perfil).

### 3. Convites — visão do Administrador (quem convida)

- Ao convidar um membro por e-mail, o administrador deve visualizar cada convite com uma
  **mensagem amigável** identificando a residência e o destinatário.
- O administrador deve acompanhar o **status** de cada convite enviado:
  - **Enviado** (pendente de resposta)
  - **Aceito**
  - **Recusado**
- O administrador continua podendo cancelar convites pendentes.

### 4. Convites — visão do Membro (quem recebe)

- O usuário convidado deve ver o convite com uma mensagem amigável, por exemplo:
  "Olá, você recebeu um convite de {nome de quem convidou} para colaborar com o controle
  financeiro da residência: {nome da residência}."
- O convite deve oferecer **dois botões**: um para **aceitar** e outro para **recusar**.
- Após responder, o convidado deve ver o status resultante (aceito ou recusado).

### 5. Design moderno de controle financeiro

- Aplicar um visual moderno, limpo e bonito, no estilo de aplicativos de controle financeiro,
  seguindo o design system existente em `design/` (cores do tema, tipografia, espaçamento e
  componentes).
- Manter consistência entre landing e área logada; priorizar legibilidade, hierarquia visual e
  destaque para valores financeiros.

### 6. Responsividade

- Toda a interface (landing e área logada) deve ser responsiva para telas menores (celular e
  tablet), além do desktop.
- A navegação lateral deve se adaptar em telas pequenas (por exemplo, recolher em um menu
  acessível), e tabelas, cards e gráficos devem reorganizar-se sem quebrar o layout.

### 7. Excluir/apagar conta do usuário

- O usuário deve poder excluir a própria conta a partir da tela de perfil.
- A exclusão é uma ação irreversível e deve exigir confirmação explícita antes de executar.
- Ao excluir a conta, o usuário é removido de todas as residências às quais pertence, aplicando
  as mesmas regras já definidas para saída de residência em cada uma delas:
  - Se for o Administrador e houver outros membros, a administração é transferida automaticamente
    para o membro ativo mais antigo.
  - Se for o único integrante da residência, a residência e todos os seus dados (despesas e
    categorias) são removidos.
- Todos os dados vinculados exclusivamente ao usuário (sessões, credenciais/autenticação e
  vínculos de membro) devem ser removidos, encerrando a sessão ao final.

### 8. Excluir/apagar residência

- Somente o Administrador da residência pode excluí-la.
- A exclusão é uma ação irreversível e deve exigir confirmação explícita antes de executar.
- Ao excluir a residência, todos os seus dados (despesas, categorias, convites e vínculos de
  membros) são removidos e todos os membros perdem o acesso a ela.
- Se a residência excluída estava selecionada como ativa para algum usuário, o sistema deve
  ajustar a residência ativa para outra disponível ou direcionar o usuário ao fluxo de criação
  de residência quando não houver nenhuma.

### 9. Mensagens de erro mais amigáveis

- Substituir mensagens genéricas ou técnicas (inclusive as retornadas em inglês pelo provedor
  de autenticação) por mensagens claras, em português, que orientem o usuário sobre o que houve
  e o que fazer.

Casos identificados que devem receber tratamento específico:

- **Login**
  - E-mail sem conta cadastrada: informar que não existe conta para aquele e-mail e sugerir
    cadastro. (Atualmente todo erro cai em "E-mail ou senha inválidos.")
  - Senha incorreta: informar especificamente que a senha está incorreta.
  - Conta não verificada (caso a verificação de e-mail esteja ativa).
- **Cadastro**
  - E-mail já cadastrado (já tratado hoje — manter e padronizar o tom).
  - Senha fraca / fora dos critérios mínimos.
  - E-mail em formato inválido.
- **Perfil / alteração de senha**
  - Senha atual incorreta.
  - Nova senha fora dos critérios mínimos ou igual à atual.
- **Convites**
  - Convite para um e-mail que ainda não possui conta na plataforma (orientar que a pessoa
    precisa se cadastrar primeiro).
  - Convite para alguém que já é membro da residência.
  - Convite duplicado (já existe um convite pendente para aquele e-mail).
  - Convite inexistente, já respondido, expirado ou que não pertence à conta do usuário.
- **Ações protegidas (server actions)**
  - Não autenticado / sessão expirada: mensagem clara e, quando aplicável, redirecionamento
    para login.
  - Sem permissão (ex.: membro tentando ação exclusiva de administrador).
  - Registro não encontrado ou já removido.
- **Validação de formulários**
  - Padronizar as mensagens de validação (campos obrigatórios, limites de tamanho, formatos)
    em português, exibidas junto ao campo correspondente.

Observações:

- Mapear os códigos de erro do provedor de autenticação para mensagens em português, evitando
  exibir mensagens cruas do backend.
- Decisão: no login, usar mensagens específicas — informar "não há conta com este e-mail"
  (sugerindo cadastro) e "senha incorreta" separadamente, priorizando a experiência amigável.
  Ciente do compromisso de segurança (isso revela quais e-mails estão cadastrados/enumeração de
  contas), essa é uma escolha consciente para este produto.
- Padronizar o canal de exibição (toast x erro no campo) e o tom das mensagens em todo o app.

## Impactos previstos no modelo de dados

- Para exibir "convite de {nome de quem convidou}", o convite precisa registrar o autor do
  convite (relacionar o `Invitation` ao usuário administrador que o criou).
- O status do convite precisa contemplar o estado **recusado** (além de pendente/enviado e
  aceito) para suportar as visões de administrador e membro.
- A exclusão de conta e de residência deve remover em cascata todos os dados dependentes
  (vínculos de membro, convites, despesas e categorias), garantindo que nenhum registro órfão
  permaneça e que a residência ativa dos usuários afetados seja reajustada.

## Fora de escopo

- Reenvio de convites recusados, notificações por e-mail e integrações externas de envio.
- Alterações nas regras de papéis, transferência de administração e isolamento de dados, que já
  estão definidas e implementadas.
