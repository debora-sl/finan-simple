# Implementation Plan: Alternância de Tema Claro/Escuro

**Branch**: `002-theme-toggle` | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-theme-toggle/spec.md`

## Summary

Adicionar um botão único de alternância claro/escuro na sidebar (próximo ao "Sair"),
persistindo a preferência no navegador e respeitando o tema do sistema na primeira visita, sem
"flash" de tema incorreto no carregamento. A abordagem reutiliza o `next-themes` (já presente em
`package.json`), configurado com `attribute="data-theme"` para casar com o mecanismo de tema já
existente em `app/globals.css` (`@custom-variant dark (&:is([data-theme="dark"] *))` e o seletor
`[data-theme="dark"]`). É uma feature exclusivamente de UI cliente: sem Prisma, sem `data/`, sem
Server Actions.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2 (App Router)

**Primary Dependencies**: `next-themes` ^0.4.6 (já instalado), `lucide-react` ^1.28 (ícones
`Sun`/`Moon`), shadcn/ui `Button` (`components/ui/button.tsx`, variante `ghost`, size `icon`)

**Storage**: `localStorage` do navegador (gerenciado internamente pelo `next-themes`, chave
`theme`); nenhuma persistência em banco

**Testing**: Validação manual via `quickstart.md` (o projeto não possui suíte de testes
automatizados); `pnpm lint` como portão de qualidade

**Target Platform**: Navegadores modernos que expõem `prefers-color-scheme`

**Project Type**: Aplicação web (Next.js App Router, single project)

**Performance Goals**: Troca de tema percebida como imediata (< 1s, SC-002); zero flash em 100%
dos carregamentos (SC-004)

**Constraints**: Sem "flash of incorrect theme"; sem `px` (usar `rem`/tokens); cores apenas via
tokens de `app/globals.css`; sem cores hard-coded do Tailwind; controle acessível por teclado e
leitor de tela

**Scale/Scope**: 1 provider, 1 componente de botão, 2 edições de arquivo existente
(`app/layout.tsx`, `components/layout/app-sidebar.tsx`); 3 telas autenticadas afetadas
(`/dashboard`, `/expenses`, `/categories`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Situação | Observação |
|-----------|----------|------------|
| I. shadcn/ui e Design Tokens | ✅ PASS | Botão reutiliza `components/ui/button.tsx`; ícones via `lucide-react`; cores só por tokens; medidas em `rem`/tokens; nenhum componente criado do zero |
| II. Camada de Dados Isolada | ✅ N/A | Feature de UI cliente; não acessa Prisma nem `data/` |
| III. Server Actions Seguras | ✅ N/A | Nenhuma operação de servidor; persistência é `localStorage` no cliente |
| IV. Clean Code / TypeScript | ✅ PASS | TS, kebab-case, sem comentários, DRY, ESLint deve passar |
| V. Documentação via MCP | ⚠️ PARCIAL | Context7 tentado para `next-themes`, retornou erro de API key inválida; procedeu-se com a API estável do `next-themes` v0.4 — reexecutar Context7 quando a key estiver válida antes de implementar. Serena (MCP) DEVE ser usado para recuperação e edição semântica de código durante a implementação (T003–T007). `AGENTS.md`: consultar guia Next em `node_modules/next/dist/docs/` antes de escrever código |

**Resultado**: PASS. Nenhuma violação — sem necessidade de Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-theme-toggle/
├── plan.md              # Este arquivo
├── research.md          # Fase 0 (decisões técnicas)
├── data-model.md        # Fase 1 (entidade Preferência de Tema)
├── quickstart.md        # Fase 1 (roteiro de validação manual)
├── contracts/
│   └── theme-toggle.md  # Fase 1 (contrato de UI/comportamento do controle)
├── checklists/
│   └── requirements.md  # (já existente)
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                       # EDIT: envolver children no ThemeProvider; suppressHydrationWarning no <html>
└── globals.css                      # SEM MUDANÇA: já define [data-theme="dark"] e o custom-variant

components/
├── layout/
│   ├── app-sidebar.tsx              # EDIT: renderizar <ThemeToggle /> acima/junto do botão "Sair"
│   └── theme-toggle.tsx             # NOVO: botão cliente com useTheme (Sun/Moon), acessível
├── providers/
│   └── theme-provider.tsx           # NOVO: wrapper "use client" do NextThemesProvider (attribute="data-theme")
└── ui/
    └── button.tsx                   # SEM MUDANÇA: reutilizado
```

**Structure Decision**: Single project (Next.js App Router). A feature adiciona apenas dois
arquivos novos de cliente (`theme-provider.tsx`, `theme-toggle.tsx`) e edita dois existentes
(`app/layout.tsx`, `components/layout/app-sidebar.tsx`). `app/globals.css` já contém os tokens de
ambos os temas e o seletor `[data-theme="dark"]`, então nenhuma nova paleta é necessária
(confirmando a premissa da spec).

## Complexity Tracking

> Nenhuma violação constitucional. Seção não aplicável.
