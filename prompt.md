Gestão de residências (casas) com múltiplos usuários no controle financeiro.

## Objetivo

Permitir que o sistema financeiro seja organizado por residências (ex.: "Casa Mãe",

"Apartamento", "Fazenda"). Um usuário pode pertencer e administrar várias residências,

e todo dado financeiro (despesas e categorias) passa a pertencer a uma residência —

não ao usuário. Membros de uma mesma residência colaboram no controle financeiro da família.

## Página inicial (landing)

- Ao acessar o sistema sem estar logado, o visitante vê uma página inicial com exemplos

  ILUSTRATIVOS e ESTÁTICOS de dashboard, categorias e resumos financeiros.

- Esses exemplos servem apenas para demonstrar o produto e incentivar o cadastro; não

  representam dados reais e não vêm do banco de dados.

## Primeiro acesso e criação de residência

- Um usuário recém-cadastrado, antes de conseguir lançar despesas, precisa ter ao menos

  uma residência.

- Se não tiver nenhuma residência, o sistema o direciona para criar uma, informando o

  nome da residência.

- Quem cria a residência torna-se automaticamente o Administrador dela.

## Papéis e permissões

- Cada residência tem exatamente UM Administrador.

- Administrador: cria a residência, edita o nome da residência, convida membros, cancela

  convites e remove membros, além de todas as ações de um membro.

- Membro: pode criar, editar e excluir despesas e categorias da residência (inclusive as

  criadas por outros usuários da mesma residência). O membro NÃO pode editar o nome da

  residência nem gerenciar convites/membros.

- Se o Administrador sair da residência ou cancelar seu cadastro, a administração é

  transferida automaticamente para o membro ativo mais antigo da residência (o que ingressou

  há mais tempo).

- Se, ao sair, o Administrador for o único integrante da residência (nenhum outro membro),

  a residência e todos os seus dados (despesas e categorias) são removidos.

## Múltiplas residências

- Um usuário pode pertencer e/ou administrar várias residências simultaneamente.

- Deve existir um seletor de residências ("casa ativa") para o usuário alternar entre elas.

- Os dados exibidos (dashboard, despesas, categorias) sempre refletem a residência ativa

  selecionada.

## Convites de membros

- Somente o Administrador da residência pode convidar membros.

- O convite é feito por e-mail (nesta primeira versão; outros meios podem ser adicionados

  no futuro).

- Apenas usuários já cadastrados na plataforma podem aceitar um convite. Se a pessoa

  convidada ainda não tem conta, ela precisa se cadastrar primeiro; após o cadastro, deve

  ser vinculada automaticamente como membro da residência que a convidou.

- O Administrador pode cancelar um convite pendente e remover um membro existente.

## Isolamento de dados

- Todas as despesas e categorias pertencem a uma residência.

- Um usuário só enxerga e manipula os dados da residência à qual pertence e que está

  selecionada como ativa.
