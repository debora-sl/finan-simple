<!--
Relatório de Impacto de Sincronização
=====================================
Versão: (inicial) → 1.0.0
Tipo de alteração: MAJOR (ratificação inicial — princípios definidos a partir do CLAUDE.md/AGENTS.md)

Princípios definidos:
  - I. Interface com shadcn/ui e Design Tokens
  - II. Camada de Dados Isolada (Prisma apenas em @data)
  - III. Server Actions Seguras (next-safe-action)
  - IV. Clean Code e Convenções de TypeScript
  - V. Documentação e Código via MCP (Context7 e Serena)

Seções adicionadas:
  - Restrições de Stack Tecnológico
  - Fluxo de Desenvolvimento e Portões de Qualidade
  - Governança

Seções removidas: nenhuma

Templates verificados:
  - ✅ .specify/templates/plan-template.md (Constitution Check genérico — compatível)
  - ✅ .specify/templates/spec-template.md (sem conflitos com os princípios)
  - ✅ .specify/templates/tasks-template.md (categorias de tarefas compatíveis)

TODOs pendentes: nenhum
-->

# Constituição do finan-simple

## Princípios Fundamentais

### I. Interface com shadcn/ui e Design Tokens

O shadcn/ui É a biblioteca de componentes oficial do projeto. Antes de construir qualquer
componente, o desenvolvedor DEVE verificar se já existe um componente do shadcn/ui que atenda
ao objetivo; criar componentes do zero é PROIBIDO quando houver equivalente disponível. Regras
não negociáveis de estilo e renderização:

- Cores DEVEM vir exclusivamente dos tokens de tema definidos em `app/globals.css`; cores
  hard-coded do Tailwind são PROIBIDAS.
- Todas as medidas DEVEM usar `rem`; `px` é PROIBIDO.
- Ícones DEVEM ser renderizados com a biblioteca `lucide-react`.
- Imagens DEVEM usar o componente `Image` do Next.js.
- O botão de fechar do `Sheet` NUNCA deve ser criado manualmente — ele já é fornecido pelo componente.
- Antes de inserir um footer, os arquivos `layout.tsx` DEVEM ser inspecionados para evitar
  renderização duplicada.

**Racional**: Consistência visual, acessibilidade e manutenção previsível dependem de um único
sistema de design e de tokens centralizados, não de decisões pontuais por tela.

### II. Camada de Dados Isolada

O Prisma NUNCA deve ser chamado diretamente de componentes. Todo acesso a dados DEVE ser
encapsulado em funções na pasta `data/`, seguindo o padrão já estabelecido em `app/page.tsx`.
Componentes consomem dados apenas por meio dessas funções.

**Racional**: Isolar o acesso a dados mantém componentes declarativos, permite reuso e teste da
lógica de persistência e evita vazamento de detalhes de infraestrutura para a camada de UI.

### III. Server Actions Seguras

Toda Server Action DEVE ser criada com a biblioteca `next-safe-action` e residir na pasta
`actions/`, usando `actions/create-booking.ts` como referência. Regras não negociáveis:

- Actions protegidas DEVEM usar o `protectedActionClient` (ver `lib/action-client.ts`).
- A validação de esquema DEVE usar `.inputSchema`; o uso de `.schema` é PROIBIDO.
- Toda action DEVE realizar validação de autenticação e autorização conforme o usuário.
- A chamada de uma Server Action a partir do cliente DEVE usar o hook `useAction` do
  `next-safe-action`.

**Racional**: Padronizar a criação e o consumo de actions garante validação de entrada,
tratamento de erros e checagens de segurança consistentes em todas as operações de servidor.

### IV. Clean Code e Convenções de TypeScript

Todo código DEVE ser escrito em TypeScript, limpo, conciso e de fácil manutenção, seguindo os
princípios SOLID, Clean Code e DRY. Regras não negociáveis:

- Nomes de variáveis DEVEM ser descritivos (ex.: `isLoading`, `hasError`).
- Nomes de pastas e arquivos DEVEM usar kebab-case.
- Código duplicado DEVE ser evitado por meio de funções e componentes reutilizáveis.
- Comentários no código são PROIBIDOS.
- Erros de ESLint DEVEM ser corrigidos antes de concluir qualquer alteração.

**Racional**: Convenções uniformes reduzem carga cognitiva, facilitam revisão e mantêm a base de
código previsível à medida que ela cresce.

### V. Documentação e Código via MCP

O MCP do Context7 DEVE ser usado para buscar documentações, sites e APIs de bibliotecas,
frameworks e ferramentas — mesmo as conhecidas — pois versões podem conter mudanças recentes. O
MCP do Serena DEVE ser usado para recuperação semântica de código e edição. Como as versões deste
projeto contêm breaking changes, o guia relevante em `node_modules/next/dist/docs/` DEVE ser lido
antes de escrever código de Next.js, respeitando avisos de depreciação (ver `AGENTS.md`).

**Racional**: Depender de documentação atualizada em vez de conhecimento presumido evita o uso de
APIs obsoletas e reduz retrabalho causado por mudanças de versão.

## Restrições de Stack Tecnológico

A stack oficial do projeto É fixa e DEVE ser respeitada:

- Gerenciador de pacotes: **pnpm**.
- Framework: **Next.js 16** com **React 19**.
- ORM/Banco: **Prisma 7** (esquema em `prisma/schema.prisma`).
- Componentes: **shadcn/ui** com **Tailwind CSS**.
- Autenticação: **Better Auth**.
- Server Actions: **next-safe-action**.
- Ícones: **lucide-react**.

Introduzir dependências que substituam ou dupliquem responsabilidades da stack acima DEVE ser
justificado na seção de Complexity Tracking do plano correspondente.

## Fluxo de Desenvolvimento e Portões de Qualidade

- `npm run dev` NUNCA deve ser executado para validar mudanças.
- Antes de concluir uma alteração, o ESLint DEVE passar sem erros.
- Toda nova funcionalidade que acesse dados DEVE incluir a função correspondente em `data/`, e
  toda operação de servidor DEVE ser exposta como Server Action em `actions/`.
- Revisões DEVEM verificar conformidade com todos os princípios desta constituição; violações DEVEM
  ser corrigidas ou justificadas explicitamente.

## Governança

Esta constituição prevalece sobre quaisquer outras práticas do projeto. Emendas DEVEM ser
documentadas nesta arquivo, aprovadas e acompanhadas de justificativa e, quando aplicável, de um
plano de migração.

O versionamento segue Semantic Versioning:

- **MAJOR**: remoção ou redefinição incompatível de princípios ou de regras de governança.
- **MINOR**: adição de um novo princípio/seção ou expansão material de orientação existente.
- **PATCH**: esclarecimentos, correções de redação e refinamentos não semânticos.

Toda alteração de código e toda revisão DEVEM confirmar conformidade com os princípios aqui
definidos. O arquivo `CLAUDE.md` (que inclui `AGENTS.md`) permanece como guia operacional de
desenvolvimento em tempo de execução e DEVE estar alinhado a esta constituição.

**Version**: 1.0.0 | **Ratified**: 2026-07-25 | **Last Amended**: 2026-07-25
