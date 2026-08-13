# Implementation Plan: Regras de Senha no Cadastro

**Branch**: `006-signup-password-rules` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-signup-password-rules/spec.md`

## Summary

Comunicar com clareza a política de senha na tela de cadastro: exibir as regras (mín. 8 e máx. 128 caracteres) próximas ao campo de senha antes de qualquer interação (US1) e oferecer um checklist que atualiza em tempo real conforme o usuário digita (US2). A abordagem técnica é criar uma **fonte única da verdade** para a política de senha (`lib/validation/password-policy.ts`) que alimenta simultaneamente: (a) o texto de apoio e o checklist na UI, (b) o schema Zod de validação do cliente em `lib/validation/auth.ts`, e (c) a configuração do Better Auth em `lib/auth.ts` — garantindo consistência cliente/servidor (FR-004). Nenhuma nova regra de complexidade é introduzida; a entrega apenas explicita e comunica a política vigente, herdada dos defaults do Better Auth.

## Technical Context

**Language/Version**: TypeScript 5 / React 19 / Next.js 16 (App Router)

**Primary Dependencies**: Better Auth (autenticação e política de senha no servidor), Zod (validação do cliente), react-hook-form + @hookform/resolvers/zod (formulário), shadcn/ui + Tailwind (UI), lucide-react (ícones)

**Storage**: PostgreSQL via Prisma 7 (não impactado por esta feature — nenhuma alteração de schema)

**Testing**: Validação manual via `quickstart.md` (o projeto não possui suíte de testes automatizados configurada)

**Target Platform**: Web (navegadores modernos), renderização client-side do formulário de cadastro

**Project Type**: Aplicação web (Next.js App Router, single project)

**Performance Goals**: Feedback do checklist perceptível a cada tecla sem lag (avaliação síncrona em memória — sem custo de rede)

**Constraints**: A validação do cliente DEVE ser idêntica à do servidor (Better Auth); acessibilidade — estado dos requisitos não pode depender só de cor (FR-008); apenas componentes shadcn/ui e tokens de tema

**Scale/Scope**: 1 tela (cadastro). Arquivos tocados: 1 novo módulo de política, 1 novo componente de checklist, atualização do schema Zod, do formulário e da config do Better Auth

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade | Notas |
|-----------|--------------|-------|
| I. Interface com shadcn/ui e Design Tokens | ✅ | Checklist construído com componentes shadcn (`Field`) + ícones `lucide-react` (`Check` para atendido, `Circle` para pendente); cores só de tokens de tema (`text-muted-foreground`, `text-primary`, etc.); medidas em `rem`. Verificado que não há componente shadcn dedicado a "checklist" — composição de primitivos é permitida |
| II. Camada de Dados Isolada | ✅ (N/A) | Feature não acessa banco. Nenhuma chamada Prisma em componentes; nenhuma função nova em `data/` necessária |
| III. Server Actions Seguras | ✅ (N/A) | O cadastro usa o cliente do Better Auth (`authClient.signUp.email`), padrão já estabelecido do projeto para autenticação — não é uma Server Action `next-safe-action`. A validação de servidor é feita pelo Better Auth. Nenhuma nova action é criada |
| IV. Clean Code e Convenções de TypeScript | ✅ | TypeScript, kebab-case nos arquivos, sem comentários, DRY via fonte única da política, ESLint deve passar |
| V. Documentação e Código via MCP | ✅ | Opções `minPasswordLength`/`maxPasswordLength` do Better Auth confirmadas via Context7. Guia relevante do Next.js será consultado se necessário na implementação |

**Resultado**: PASS. Sem violações. Complexity Tracking não aplicável.

## Project Structure

### Documentation (this feature)

```text
specs/006-signup-password-rules/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── password-policy.md
├── checklists/
│   └── requirements.md  # (já existente)
└── tasks.md             # Phase 2 output (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
lib/
├── validation/
│   ├── password-policy.ts   # NOVO — fonte única: constantes + requisitos + validador reutilizável
│   └── auth.ts              # ALTERADO — signupSchema consome a política (min 8, max 128)
└── auth.ts                  # ALTERADO — emailAndPassword.minPasswordLength/maxPasswordLength explícitos

components/
└── auth/
    ├── password-requirements.tsx  # NOVO — checklist acessível dos requisitos em tempo real
    └── signup-form.tsx            # ALTERADO — observa o campo senha e renderiza o checklist/texto de apoio
```

**Structure Decision**: Aplicação web single-project com App Router. A política vive em `lib/validation/password-policy.ts` como fonte única consumida por `lib/validation/auth.ts` (cliente), `lib/auth.ts` (servidor Better Auth) e `components/auth/password-requirements.tsx` (UI). O formulário existente `components/auth/signup-form.tsx` passa a observar o valor da senha (via `watch` do react-hook-form) e a renderizar o checklist logo abaixo do campo de senha.

## Complexity Tracking

> Não aplicável — Constitution Check passou sem violações.
