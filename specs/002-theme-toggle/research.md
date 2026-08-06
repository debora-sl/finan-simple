# Phase 0 Research: Alternância de Tema Claro/Escuro

## R1. Mecanismo de tema e biblioteca

**Decision**: Usar `next-themes` (^0.4.6, já em `package.json`) como gerenciador de tema.

**Rationale**:
- Já é dependência do projeto — não introduz nova dependência (respeita as Restrições de Stack da
  constituição).
- Resolve nativamente todos os requisitos difíceis da spec: persistência em `localStorage`
  (FR-005), respeito ao tema do sistema na ausência de preferência (FR-006) e prevenção de flash
  via script bloqueante injetado no `<head>` antes da hidratação (FR-007 / SC-004).
- Expõe o hook `useTheme()` (`theme`, `setTheme`, `resolvedTheme`, `systemTheme`) para a troca
  imediata sem recarregar (FR-002).

**Alternatives considered**:
- Implementação manual com `localStorage` + script inline anti-flash: reinventa o que o
  `next-themes` já entrega testado; mais código, maior risco de flash e de bugs de hidratação.
  Rejeitado por violar DRY e por já haver a lib instalada.

## R2. Casamento com o CSS existente (`attribute`)

**Decision**: Configurar `NextThemesProvider` com `attribute="data-theme"`, `defaultTheme="system"`
e `enableSystem`.

**Rationale**:
- `app/globals.css` define o tema escuro por **atributo** `data-theme="dark"`
  (`@custom-variant dark (&:is([data-theme="dark"] *))` e o bloco `[data-theme="dark"] { … }`),
  **não** pela classe `.dark` padrão do `next-themes`. Portanto `attribute="data-theme"` é
  obrigatório para que o provider escreva `data-theme="dark"`/`data-theme="light"` no `<html>`.
- O tema claro é o `:root` padrão; `data-theme="light"` simplesmente não dispara o bloco dark,
  resultando no tema claro — nenhuma regra CSS adicional é necessária.
- `defaultTheme="system"` + `enableSystem` implementam a US3 (primeira visita segue o SO) e o
  edge case de mudança de preferência do sistema quando não há escolha explícita.

**Alternatives considered**:
- Trocar o CSS para usar `class="dark"` e manter o `attribute` padrão do `next-themes`:
  alteraria o mecanismo de tema já validado e todos os pontos que dependem de `[data-theme="dark"]`.
  Rejeitado — muda mais superfície do que necessário.

## R3. Prevenção de flash e hidratação

**Decision**: Adicionar `suppressHydrationWarning` ao elemento `<html>` em `app/layout.tsx` e
manter o `ThemeProvider` como Client Component envolvendo `children`.

**Rationale**:
- O `next-themes` escreve o atributo de tema no `<html>` via script antes da hidratação do React;
  isso torna o HTML do servidor (sem atributo) diferente do cliente, gerando warning de hidratação
  que o `suppressHydrationWarning` silencia — prática oficial documentada da lib.
- O provider precisa ser cliente (`"use client"`), mas envolver `children` no `RootLayout` (Server
  Component) é suportado, pois `children` continua sendo renderizado no servidor.

**Alternatives considered**:
- Marcar todo o `RootLayout` como `"use client"`: perde SSR do layout raiz desnecessariamente.
  Rejeitado.

## R4. Controle acessível (botão de toggle)

**Decision**: Novo componente cliente `theme-toggle.tsx` reutilizando o `Button` do shadcn
(`variant="ghost"`), alternando com `setTheme(resolvedTheme === "dark" ? "light" : "dark")`,
exibindo `Sun`/`Moon` do `lucide-react` conforme `resolvedTheme`, com `aria-label` textual
descrevendo a ação.

**Rationale**:
- Reutiliza componente shadcn existente (Princípio I) — nada criado do zero.
- `resolvedTheme` (e não `theme`) garante o ícone correto mesmo quando o estado é `"system"`.
- `aria-label` cobre FR-008 / edge case de acessibilidade (conteúdo visível é só ícone). O
  `Button` (base-ui) já é operável por teclado e tem `focus-visible`.
- Para evitar mismatch de hidratação do ícone, o componente só decide o ícone após montar
  (guarda `mounted`), renderizando um placeholder neutro no primeiro paint no servidor.

**Alternatives considered**:
- Dropdown com três opções (claro/escuro/sistema): a spec define **um único** botão toggle de dois
  estados; "sistema" é apenas o estado padrão inicial, não opção explícita (Assumptions). Rejeitado.

## R5. Posicionamento e persistência

**Decision**: Renderizar `<ThemeToggle />` dentro da `AppSidebar`, imediatamente antes/junto do
botão "Sair". Persistência fica a cargo do `next-themes` (chave `theme` no `localStorage`);
nenhum acesso a banco, `data/` ou Server Action.

**Rationale**:
- FR-004 exige o controle na sidebar próximo ao "Sair"; a `AppSidebar` já é cliente e está
  presente em todas as telas autenticadas (`app/(app)/layout.tsx`).
- Persistência local por navegador atende FR-005 e a premissa de não sincronizar entre
  dispositivos; o edge case de storage bloqueado degrada para "funciona só na sessão", que é o
  comportamento nativo do `next-themes`.

**Alternatives considered**:
- Persistir a preferência no banco por usuário (Prisma + Server Action): fora do escopo/premissas
  da spec (persistência local, por dispositivo) e adicionaria complexidade sem valor pedido.
  Rejeitado.

## Notas de MCP

- Context7 foi acionado para `next-themes`, mas retornou `Invalid API key`. As decisões acima
  baseiam-se na API pública estável do `next-themes` v0.4 (`ThemeProvider`, `useTheme`,
  `attribute`, `defaultTheme`, `enableSystem`). Antes de escrever código Next.js, consultar o guia
  em `node_modules/next/dist/docs/` conforme `AGENTS.md`.
