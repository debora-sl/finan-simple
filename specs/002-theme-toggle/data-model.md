# Phase 1 Data Model: Alternância de Tema Claro/Escuro

Esta feature **não** possui persistência em banco de dados. A única "entidade" é um estado de
preferência mantido no cliente (navegador) e gerenciado pelo `next-themes`. Documentado aqui para
rastreabilidade com a spec (Key Entities).

## Entidade: Preferência de Tema

Representa a escolha de tema do usuário, associada ao navegador/dispositivo.

| Campo | Tipo | Valores | Descrição |
|-------|------|---------|-----------|
| `theme` | string | `"light"` \| `"dark"` \| `"system"` | Preferência escolhida; `"system"` é o padrão quando não há escolha explícita |
| `resolvedTheme` | string (derivado) | `"light"` \| `"dark"` | Tema efetivamente aplicado; quando `theme = "system"`, resolve para o `prefers-color-scheme` do SO |

### Armazenamento

- **Local**: `localStorage`, chave `theme` (padrão do `next-themes`).
- **Escopo**: por navegador/dispositivo; não sincronizado entre dispositivos.
- **Ausência de valor**: quando a chave não existe (primeira visita), o estado efetivo é
  `"system"` → `resolvedTheme` segue `prefers-color-scheme` (FR-006 / US3).

### Transições de estado

```text
(sem preferência) --[primeira visita]--> theme = "system"  → resolvedTheme = prefers-color-scheme
theme atual = X   --[clique no toggle]--> theme = (resolvedTheme == "dark" ? "light" : "dark")
theme = "system"  --[SO muda prefers-color-scheme]--> resolvedTheme acompanha o SO (sem escolha explícita)
```

### Regras de validação / invariantes

- O controle expõe apenas dois estados alcançáveis por clique: `"light"` e `"dark"` (Assumptions da
  spec — "system" não é opção explícita no botão).
- O ícone reflete sempre `resolvedTheme` (`Sun` para `light`, `Moon` para `dark`), garantindo
  coerência visual mesmo no estado inicial `"system"` (FR-003).
- Se o `localStorage` estiver indisponível/bloqueado, a alternância opera apenas na sessão atual,
  sem persistir (edge case de storage indisponível) — comportamento nativo do `next-themes`.

## Tokens de tema (referência, sem mudança)

Os valores de cor de ambos os temas já existem em `app/globals.css`:

- Tema claro: bloco `:root { … }`.
- Tema escuro: bloco `[data-theme="dark"] { … }`, ativado pelo atributo `data-theme="dark"` no
  `<html>` (escrito pelo `next-themes`).

Nenhuma nova paleta é definida por esta feature (confirma a premissa da spec).
