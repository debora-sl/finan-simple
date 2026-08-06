# UI Contract: Controle de Alternância de Tema

Esta feature é exclusivamente de UI cliente — não expõe API HTTP nem Server Action. O "contrato"
aqui é o comportamento observável do controle e a configuração do provider.

## Componente: `ThemeToggle`

**Local**: `components/layout/theme-toggle.tsx` (Client Component)

**Renderização**: reutiliza `Button` do shadcn (`variant="ghost"`), ícone `lucide-react`.

### Contrato de comportamento

| Estado atual (`resolvedTheme`) | Ícone exibido | Ação ao acionar | Estado resultante |
|--------------------------------|---------------|-----------------|-------------------|
| `light` | `Sun` | `setTheme("dark")` | `dark` (aplicado imediatamente) |
| `dark` | `Moon` | `setTheme("light")` | `light` (aplicado imediatamente) |

### Requisitos de acessibilidade (FR-008)

- Possui `aria-label` textual descrevendo a ação (ex.: "Alternar para tema escuro" /
  "Alternar para tema claro"), pois o conteúdo visível é apenas um ícone.
- Operável por teclado (foco + Enter/Espaço) — herdado do `Button` (base-ui), com
  `focus-visible` visível.

### Requisitos de renderização (constituição)

- Cores apenas via tokens de `app/globals.css` (sem cores hard-coded do Tailwind).
- Medidas em `rem`/tokens (sem `px`).
- Ícones via `lucide-react`.
- Nenhum componente criado do zero — usa `components/ui/button.tsx`.

### Estabilidade de hidratação

- Antes de montado (`mounted === false`), o componente NÃO deve depender de `resolvedTheme` para
  escolher o ícone (evita mismatch de hidratação). Renderiza um placeholder neutro de mesmo
  tamanho até montar.

## Provider: `ThemeProvider`

**Local**: `components/providers/theme-provider.tsx` (Client Component, wrapper de
`NextThemesProvider`)

### Configuração obrigatória

| Prop | Valor | Motivo |
|------|-------|--------|
| `attribute` | `"data-theme"` | CSS usa `[data-theme="dark"]`, não `.dark` |
| `defaultTheme` | `"system"` | Primeira visita segue o SO (FR-006 / US3) |
| `enableSystem` | `true` | Habilita leitura de `prefers-color-scheme` |

### Integração no layout (`app/layout.tsx`)

- `<html … suppressHydrationWarning>` para silenciar o mismatch causado pela escrita do atributo
  de tema antes da hidratação (FR-007 / anti-flash).
- `<ThemeProvider>` envolve `children` dentro do `<body>`.

## Critérios de aceite verificáveis (mapa spec → contrato)

- FR-001/FR-002 → tabela de comportamento (troca imediata, um controle).
- FR-003 → coluna "Ícone exibido" ligada a `resolvedTheme`.
- FR-004 → `ThemeToggle` renderizado na `AppSidebar`, próximo ao "Sair".
- FR-005 → persistência via `localStorage` do `next-themes` (ver `data-model.md`).
- FR-006 → `defaultTheme="system"` + `enableSystem`.
- FR-007/SC-004 → `attribute="data-theme"` + `suppressHydrationWarning` + script anti-flash da lib.
- FR-008 → seção de acessibilidade.
- FR-009 → tokens de ambos os temas já em `globals.css`; validação visual no `quickstart.md`.
