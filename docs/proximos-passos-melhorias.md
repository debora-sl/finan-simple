# Próximos passos — Melhorias pós-deploy

> **Como usar este arquivo:** documento vivo para registrar as melhorias identificadas
> após a publicação. Liste cada melhoria na seção "Backlog de melhorias"; ao decidir
> executar, defina o caminho (spec formal x ajuste rápido) e mova para "Em andamento" /
> "Concluído". Docs em pt-BR; commits em inglês (conventional commits).

## Estado atual (marco de referência)

- Produto **em produção** na Vercel: `https://finan-simple.vercel.app`.
- Banco migrado para **Neon Postgres** (adapter `@prisma/adapter-neon`); migration `20260810033842_init` aplicada em produção.
- Autenticação (Better Auth) validada em produção.
- **Spec 004** (refinamentos pré-deploy) concluída 39/39, incluindo o T038 (validação manual em produção).
- Specs anteriores concluídas: 001 (despesas), 002 (tema), 003 (households).

## Como cada melhoria será tratada

Ao pegar um item do backlog, classifique o caminho:

- **Funcionalidade nova / mudança relevante** → vira **spec 005+** pelo fluxo Spec Kit:
  `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- **Ajuste pontual** (bug, texto, pequeno tweak de UX/visual) → executar direto, sem cerimônia de spec.

Restrições do projeto (constituição em `CLAUDE.md` / `AGENTS.md`) valem para toda melhoria:
shadcn/ui como única lib de componentes; cores só via tokens de `app/globals.css`; medidas em `rem`;
ícones `lucide-react`; Prisma só em `data/`; mutações via Server Actions (`next-safe-action` +
`protectedActionClient`, usando `.inputSchema`); ESLint limpo; não rodar `npm run dev`.

## Backlog de melhorias

> Coluna **Tipo**: `spec` = feature nova pelo fluxo Spec Kit (`/speckit-specify`); `ajuste` = correção
> pontual executada direto, sem spec.

| #   | Melhoria                                                                           | Tipo     | Prioridade | Notas                                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Incluir orientação / exemplo de senha na tela de cadastro                          | `spec`   | Alta       | Mostrar ao usuário as regras de senha. Regra a definir na spec e alinhar com o Better Auth (ex.: mínimo de caracteres, evitar sequências). Validar antes se não conflita com o padrão do Better Auth. |
| 2   | Ajustar espaçamento do botão "+ criar nova residência" em telas maiores            | `ajuste` | Baixa      | Em telas maiores o botão está sendo cortado ao clicar. Tweak de layout/espaçamento.                                                                                              |
| 3   | Renomear "Total" para "Total Despesas" no Dashboard                                 | `ajuste` | Baixa      | Deixar claro para o usuário a que o total se refere. Apenas troca de texto.                                                                                                       |
| 4   | Cofrinho (valor guardado pela família)                                             | `spec`   | Alta       | Feature completa: nova opção no menu, tela para cadastrar o valor guardado e card no Dashboard mostrando o total. Consolida os antigos itens "menu Cofrinho" e "Dashboard Cofrinho". |
| 5   | Formatar valores do gráfico do Dashboard em Real (R$)                              | `ajuste` | Baixa      | Exibir os valores do gráfico em Reais (ex.: `R$ 50,00`). Formatação pontual.                                                                                                      |
| 6   | Permitir escolher a cor da categoria                                               | `spec`   | Baixa      | Em Categorias, permitir que o usuário selecione a cor.                                                                                                                            |
| 7   | Datas em Despesas: vencimento, pagamento e "sem data de vencimento"                | `spec`   | Alta       | Incluir Data de Vencimento, Data do Pagamento e a opção "Sem data de vencimento". **Absorve o antigo #8** (correção do bug de timezone) por mexerem no mesmo tratamento de datas.  |
| 8   | ~~Corrigir Data de Vencimento aparecendo um dia antes~~ (absorvido pelo #7)         | `spec`   | Alta       | Bug de timezone/UTC: ao cadastrar 20/08/2026 a lista mostra 19/08/2026. Corrigir para exibir a data exatamente como informada — tratado dentro da spec do #7.                       |
| 9   | Confirmação de exclusão em Despesas e Categorias                                    | `ajuste` | Alta       | Antes de excluir uma despesa ou categoria, pedir confirmação ao usuário (`AlertDialog` do shadcn/ui).                                                                             |

## Sequência de execução acordada

> Ordem combinada para retomar o trabalho (inclusive após um `clear` do chat). Seguir de cima para baixo.

1. ~~**Spec 005 — Datas em Despesas (backlog item 7)**: concluir o fluxo Spec Kit.~~ **Concluída** —
   fluxo Spec Kit completo (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`),
   código implementado. Absorveu o backlog item 8 (bug de data um dia antes).
2. ~~**Ajustes diretos (sem spec), após concluir a spec 005**~~ **Concluídos** — todos os quatro na ordem de prioridade:
   1. ~~**Item 9** — Confirmação de exclusão em Despesas e Categorias (Alta).~~ ✅
   2. ~~**Item 3** — "Total" → "Total Despesas" no Dashboard (Baixa).~~ ✅
   3. ~~**Item 5** — Formatar valores do gráfico em R$ (Baixa).~~ ✅
   4. ~~**Item 2** — Espaçamento do botão "+ criar nova residência" em telas maiores (Baixa).~~ ✅
3. **Specs futuras** (fluxo Spec Kit, ainda não iniciadas): item 1 (senha), item 4 (Cofrinho), item 6 (cor da categoria).

## Em andamento

_(vazio)_

## Concluído

- **Spec 005 — Datas em Despesas (backlog itens 7 e 8)** → `specs/005-expense-dates/`. Data de Vencimento,
  Data do Pagamento e opção "sem data de vencimento"; Data do Pagamento controla o estado "pago"; data das
  despesas legadas vira Data de Vencimento; Data do Pagamento no futuro é bloqueada. Corrige o bug de timezone
  (data aparecendo um dia antes).
- **Item 9 — Confirmação de exclusão em Despesas e Categorias**: `AlertDialog` do shadcn/ui via componente
  reutilizável `components/shared/confirm-delete-button.tsx`, aplicado em `expense-table.tsx` e `category-list.tsx`.
- **Item 3 — "Total" → "Total Despesas"** no Dashboard (`components/dashboard/summary-cards.tsx`).
- **Item 5 — Valores do gráfico em R$**: `formatter` no tooltip do gráfico de categorias
  (`components/dashboard/category-breakdown.tsx`) usando `formatCentsAsCurrency`.
- **Item 2 — Botão "Criar nova residência" cortado em telas maiores**: `alignItemWithTrigger={false}` no
  `SelectContent` do `components/layout/household-switcher.tsx` para renderizar como dropdown abaixo do trigger.
