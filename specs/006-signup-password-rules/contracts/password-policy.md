# Contract: Password Policy (fonte única) & Interface de Cadastro

Esta feature não expõe API HTTP nova. Os "contratos" relevantes são: (1) a interface do módulo de política consumida por UI, Zod e Better Auth; e (2) o contrato de erro do endpoint de cadastro do Better Auth já usado pelo cliente. Ambos DEVEM permanecer consistentes (FR-004).

## 1. Módulo `lib/validation/password-policy.ts`

Interface pública (a implementação vive na fase de tasks/implement):

```ts
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const checklistRequirements: PasswordRequirement[];
```

**Garantias do contrato**:
- `PASSWORD_MIN_LENGTH`/`PASSWORD_MAX_LENGTH` são a **única** definição desses números no código. Qualquer literal `8`/`128` para senha fora deste módulo é violação.
- `checklistRequirements` contém **apenas** os requisitos exibidos como itens do checklist em tempo real (nesta entrega, somente `min-length`). O máximo de 128 é aplicado via `PASSWORD_MAX_LENGTH` (Zod/Better Auth) e comunicado como texto de apoio — não é item do checklist (FR-005, Clarification Q2). Adicionar um requisito a `checklistRequirements` DEVE implicar que o mesmo é aplicado por Zod/Better Auth (nenhuma regra "só de UI").
- `test` avalia o valor cru do campo (sem `trim`) — coerente com o servidor.

## 2. Consumo pelo Zod — `lib/validation/auth.ts`

```ts
password: z
  .string()
  .min(PASSWORD_MIN_LENGTH, "A senha deve ter ao menos 8 caracteres")
  .max(PASSWORD_MAX_LENGTH, "A senha deve ter no máximo 128 caracteres"),
```

**Garantia**: as mensagens de erro do Zod DEVEM ser consistentes com os `label` dos requisitos (FR-007) — não introduzir nem contradizer regras.

## 3. Consumo pelo Better Auth — `lib/auth.ts`

```ts
emailAndPassword: {
  enabled: true,
  minPasswordLength: PASSWORD_MIN_LENGTH,
  maxPasswordLength: PASSWORD_MAX_LENGTH,
},
```

## 4. Contrato de erro do cadastro (Better Auth → cliente)

Fluxo: `authClient.signUp.email(...)` em `components/auth/signup-form.tsx`.

| Situação | Código Better Auth | Tratamento no cliente |
|----------|--------------------|-----------------------|
| Senha < 8 | `PASSWORD_TOO_SHORT` | Bloqueado antes pelo Zod; se ocorrer, mensagem consistente com "ao menos 8 caracteres" via `mapAuthError` |
| Senha > 128 | `PASSWORD_TOO_LONG` | Bloqueado antes pelo Zod; se ocorrer, mensagem consistente com "no máximo 128 caracteres" via `mapAuthError` |
| E-mail já existe | `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL` | Já tratado (erro no campo e-mail) |

> Como o Zod (cliente) e o Better Auth (servidor) derivam das mesmas constantes, na prática o servidor nunca deveria rejeitar por comprimento uma senha aprovada pelo checklist (SC-002, SC-003). O mapeamento acima existe como salvaguarda de consistência de mensagem (FR-007). Recomenda-se acrescentar `PASSWORD_TOO_SHORT`/`PASSWORD_TOO_LONG` ao `CODE_MESSAGES` em `lib/auth-errors.ts`.

## Critérios de aceitação do contrato

- [ ] Nenhum literal de comprimento de senha (`8`/`128`) fora de `password-policy.ts`.
- [ ] `signupSchema.password` aplica `.min(MIN).max(MAX)` sem `.trim()`.
- [ ] `lib/auth.ts` define `minPasswordLength`/`maxPasswordLength` a partir das constantes.
- [ ] Mensagens de erro (Zod e `mapAuthError`) coerentes com os `label` dos requisitos (FR-007).
