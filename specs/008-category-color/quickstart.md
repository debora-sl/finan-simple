# Quickstart — Validação: Cor da categoria

Guia de validação end-to-end. Não contém implementação — apenas cenários executáveis que provam
a feature. Detalhes de entidade e contratos estão em [data-model.md](./data-model.md) e
[contracts/](./contracts/).

## Pré-requisitos

- Dependências instaladas: `pnpm install`
- Componente shadcn adicionado: `pnpm dlx shadcn@latest add toggle-group`
- Banco atualizado com a nova coluna: `pnpm prisma migrate dev --name add_category_color`
- Usuário autenticado com uma residência ativa e ao menos 2 categorias com despesas no período

## Portões de qualidade

```bash
pnpm lint      # deve passar sem erros (Constituição IV)
pnpm build     # compila sem erros de tipo (color disponível no Prisma Client)
```

> Não executar `pnpm dev` / `npm run dev` para validar (regra do projeto). Use `pnpm build`.

## Cenário 1 — Escolher cor ao criar (US1 · FR-001/FR-004)

1. Abrir **Categorias** → **Nova categoria**.
2. Preencher o nome e escolher uma cor no seletor de swatches.
3. Salvar.
- **Esperado**: toast "Categoria criada."; a categoria aparece na lista com o indicador na cor
  escolhida.

## Cenário 2 — Editar cor persiste e substitui (US1 · FR-004)

1. Editar uma categoria existente, alterar a cor, salvar.
2. Reabrir a edição da mesma categoria.
- **Esperado**: a nova cor aparece pré-selecionada (persistida); a cor anterior foi substituída.

## Cenário 3 — Salvar sem interagir usa a cor padrão (US1, cenário 3 · FR-005)

1. Criar uma categoria sem alterar o seletor de cor.
- **Esperado**: a categoria é salva com a cor padrão sugerida pelo sistema (sem erro).

## Cenário 4 — Cor fora da paleta é rejeitada (FR-003 · SC-003)

1. Chamar a server action com `color` inválido (ex.: `"#ff0000"` ou `"roxo"`) — via forjar o
   input do formulário/DevTools.
- **Esperado**: a operação é rejeitada pela validação (`z.enum`) e a categoria não é criada/alterada.

## Cenário 5 — Autorização por residência (US1, cenário 4 · FR-007)

1. Autenticado em outra residência, tentar `updateCategory` com o `id` de uma categoria alheia.
- **Esperado**: erro "Categoria não encontrada." (rejeição por posse); cor inalterada.

## Cenário 6 — Cor na lista, inclusive legadas (US2 · FR-008/FR-010)

1. Definir cores distintas em duas categorias; observar a lista.
2. Observar uma categoria criada **antes** da feature (coluna `color` nula).
- **Esperado**: cada categoria mostra seu indicador na respectiva cor; a categoria legada exibe a
  cor derivada determinística (aparência preservada), sem ficar sem cor.

## Cenário 7 — Cor no gráfico do Dashboard (US3 · FR-009)

1. Com categorias coloridas e despesas no período, abrir o **Dashboard**.
2. Definir a mesma cor em duas categorias distintas e reabrir.
- **Esperado**: cada fatia do gráfico usa a cor da sua categoria; cores repetidas são permitidas e
  não geram erro (US3, cenário 2).

## Cenário 8 — Adaptação a tema claro/escuro (FR-011 · SC-005)

1. Alternar entre tema claro e escuro com a lista e o Dashboard abertos.
- **Esperado**: as cores (tokens `--cat-*`) se adaptam ao tema mantendo contraste legível.

## Critérios de aceite cobertos

SC-001 (toda categoria tem cor exibível) · SC-002 (consistência lista+dashboard sem reload manual)
· SC-003 (100% dos valores fora da paleta rejeitados) · SC-004 (fluxo de escolha < 30s) ·
SC-005 (contraste em ambos os temas).
