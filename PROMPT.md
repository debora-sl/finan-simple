# Prompt para o `/speckit-specify`

> Cole o bloco abaixo como argumento do `/speckit-specify` e siga o fluxo completo do Spec Kit
> (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) em PR próprio.
> Este arquivo contém **uma spec por vez**: a 006 foi concluída; agora vai a 007 e depois a 008.
>
> Restrições da constituição (`CLAUDE.md` / `AGENTS.md`) valem para toda spec: shadcn/ui como única lib de
> componentes; cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; Prisma
> só em `data/`; mutações via Server Actions (`next-safe-action` + `protectedActionClient`, com `.inputSchema`);
> ESLint limpo; não rodar `npm run dev`.

---

## Spec 007 — Cofrinho (valor guardado pela família) (Alta)

Feature completa que permite à família registrar quanto tem guardado ("cofrinho") e acompanhar esse total.
Envolve **novo model no Prisma** (migration), nova opção de navegação, tela de gestão do valor e um card no
Dashboard exibindo o total guardado.

Contexto atual (já verificado):

- O cofrinho pertence à **residência** (`Household` em `prisma/schema.prisma`), não ao usuário — o valor é
  compartilhado por todos os membros da mesma household, como já ocorre com `Expense` e `Category`.
- Valores monetários no projeto são armazenados **em centavos** (`Int`, ex.: `Expense.amountInCents`) e
  formatados em Real com o helper de moeda já existente (`formatCentsAsCurrency`).
- A navegação fica em `NAV_ITEMS` (`components/layout/app-sidebar.tsx`); as telas do app vivem em
  `app/(app)/…`; os cards de resumo do Dashboard estão em `components/dashboard/summary-cards.tsx`.
- Ícone sugerido: `PiggyBank` do `lucide-react` (já usado no branding do sidebar).

O que a spec precisa definir:

- **Model no Prisma**: representar o valor guardado da household (em centavos, `Int`). Decidir se é um valor
  único por household (ex.: model `Savings` com `amountInCents` e relação 1‑1 com `Household`) ou um histórico
  de lançamentos que somam o total. Descrever a migration correspondente.
- **Leitura via `data/`**: função em `data/` para buscar o total guardado da household ativa (Prisma nunca é
  chamado de componente). Reaproveitar o padrão de resolução da household ativa já usado nas outras telas.
- **Mutação via Server Action**: cadastrar/atualizar o valor guardado usando `next-safe-action` +
  `protectedActionClient` (com `.inputSchema`), na pasta `actions/`, com validação de autenticação e de que o
  usuário pertence à household. Usar a action `actions/create-booking.ts` como base.
- **Navegação e tela**: nova opção no menu (`NAV_ITEMS`) apontando para uma rota nova em `app/(app)/…`, com a
  tela para visualizar e cadastrar/editar o valor guardado. Apenas componentes shadcn/ui e tokens de tema;
  medidas em `rem`.
- **Card no Dashboard**: exibir o total guardado formatado em Real, no mesmo padrão de
  `components/dashboard/summary-cards.tsx`.

Fora de escopo: metas/objetivos de poupança; múltiplos cofrinhos por household; histórico de rendimentos ou
gráficos de evolução (a menos que a modelagem por lançamentos já os viabilize sem custo extra de UI).
