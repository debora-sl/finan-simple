# Phase 1 Data Model: Regras de Senha no Cadastro

> Esta feature **não** altera o banco de dados nem o `prisma/schema.prisma`. As "entidades" abaixo são estruturas de domínio em memória (a fonte única da política de senha) que alimentam UI, validação de cliente e configuração de servidor.

## Entidade: Política de Senha (`PasswordPolicy`)

Fonte única da verdade da política. Reside em `lib/validation/password-policy.ts`.

| Campo | Tipo | Valor | Regra / Origem |
|-------|------|-------|----------------|
| `PASSWORD_MIN_LENGTH` | `number` (const) | `8` | Espelha `emailAndPassword.minPasswordLength` do Better Auth (default 8). FR-002 |
| `PASSWORD_MAX_LENGTH` | `number` (const) | `128` | Espelha `emailAndPassword.maxPasswordLength` do Better Auth (default 128). FR-003 |

**Invariantes**:
- Os mesmos valores DEVEM ser consumidos por: (a) `signupSchema` em `lib/validation/auth.ts`, (b) `auth` em `lib/auth.ts`, (c) `checklistRequirements` (abaixo). Nenhum literal `8`/`128` duplicado fora deste módulo (DRY, FR-004).

## Entidade: Requisito de Senha (`PasswordRequirement`)

Cada regra comunicável ao usuário, avaliável em tempo real.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | Identificador estável do requisito (ex.: `"min-length"`, `"max-length"`) — usado como `key` e para acessibilidade |
| `label` | `string` | Texto claro, sem jargão, em pt-BR (ex.: `"Ao menos 8 caracteres"`, `"No máximo 128 caracteres"`). FR-002, FR-008 |
| `test` | `(password: string) => boolean` | Predicado que decide se o requisito está atendido para o valor atual |

**Coleção**: `checklistRequirements: PasswordRequirement[]` — a ordem define a ordem de exibição no checklist. Contém **apenas** os requisitos exibidos como itens do checklist em tempo real.

**Requisitos desta entrega** (sem novas regras de complexidade — Assumptions da spec):

| id | label | test |
|----|-------|------|
| `min-length` | `Ao menos 8 caracteres` | `password.length >= PASSWORD_MIN_LENGTH` |

> O limite **máximo de 128** NÃO é item do checklist (FR-005, Clarification Q2): é aplicado por `PASSWORD_MAX_LENGTH` na validação (Zod/Better Auth) e comunicado como texto de apoio (US1) + mensagem de erro quando excedido.
> A avaliação usa `password.length` sobre o valor cru (sem `trim`), coerente com o servidor (Research R3).

## Estado derivado (UI — checklist)

Não é persistido; calculado por render a partir do valor observado do campo (`watch("password")`).

| Estado | Condição | Representação (não só cor — FR-008) |
|--------|----------|--------------------------------------|
| `pendente` | `requirement.test(password) === false` | Ícone `Circle` (lucide) + texto do label + sufixo assistivo "pendente"; token `text-muted-foreground` |
| `atendido` | `requirement.test(password) === true` | Ícone `Check` (lucide) + texto do label + sufixo assistivo "atendido"; token `text-primary` |

**Transições** (FR-006):
- `pendente → atendido`: quando o predicado passa a ser verdadeiro ao digitar.
- `atendido → pendente`: quando o predicado deixa de ser verdadeiro ao apagar.
- Campo vazio no carregamento: o único item do checklist (`min-length`) é `pendente` (US2-AS1: todos os requisitos aparecem pendentes no load) — o texto de apoio estático (US1), incluindo o máximo de 128, permanece visível independentemente do estado.

## Consumidores da fonte única

```text
lib/validation/password-policy.ts  (PasswordPolicy + checklistRequirements)
        │
        ├──► lib/validation/auth.ts        signupSchema.password = z.string().min(MIN).max(MAX)
        │
        ├──► lib/auth.ts                    emailAndPassword.minPasswordLength = MIN / maxPasswordLength = MAX
        │
        └──► components/auth/password-requirements.tsx   itera checklistRequirements, aplica .test(password)
                     ▲
                     └── components/auth/signup-form.tsx  passa watch("password")
```
