# Prompt para o `/speckit-specify`

> Cole o bloco abaixo como argumento do `/speckit-specify` e siga o fluxo completo do Spec Kit
> (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) em PR próprio.
> Este arquivo contém **uma spec por vez**: ao concluir a 006, atualizamos com a 007 e depois a 008.
>
> Restrições da constituição (`CLAUDE.md` / `AGENTS.md`) valem para toda spec: shadcn/ui como única lib de
> componentes; cores só via tokens de `app/globals.css`; medidas em `rem`; ícones `lucide-react`; Prisma
> só em `data/`; mutações via Server Actions (`next-safe-action` + `protectedActionClient`, com `.inputSchema`);
> ESLint limpo; não rodar `npm run dev`.

---

## Spec 006 — Regras de senha no cadastro (Alta)

Na tela de cadastro (`app/(auth)/signup`, componente `components/auth/signup-form.tsx`), exibir ao usuário
as regras de senha de forma clara, para que ele saiba o que é exigido antes de submeter o formulário.

Contexto atual (já verificado):

- O Better Auth (`lib/auth.ts`) usa `emailAndPassword: { enabled: true }` sem `minPasswordLength`
  customizado — vale o default: **mínimo 8, máximo 128 caracteres**.
- O schema de validação (`lib/validation/auth.ts`) já exige `password.min(8)`, então a regra "mínimo 8
  caracteres" está consistente entre Better Auth e Zod.

O que a spec precisa definir:

- Quais regras exibir ao usuário (no mínimo "ao menos 8 caracteres"). Se novas regras forem adotadas
  (ex.: evitar sequências óbvias, exigir letra e número), elas precisam ser **aplicadas em dois lugares**:
  no schema Zod (`lib/validation/auth.ts`) e alinhadas ao Better Auth, para a validação do cliente não
  divergir do servidor.
- Como apresentar as regras: texto de apoio abaixo do campo e/ou feedback em tempo real conforme o usuário
  digita (checklist de requisitos atendidos). Usar apenas componentes shadcn/ui e tokens de tema.

Fora de escopo: fluxo de recuperação/troca de senha; alteração da política para usuários já cadastrados.
