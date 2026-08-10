# Contrato — Mensagens de Erro em Português (US4)

## Módulo central — `lib/auth-errors.ts` (NOVO)

Função pura que mapeia códigos do Better Auth (`APIError.body.code` / `error.status`) para mensagens pt-BR. Fonte única (DRY) consumida por login, signup, alteração de senha e exclusão de conta.

```
mapAuthError(codeOuStatus) -> string  // sempre pt-BR, nunca texto cru do provedor
```

### Login — `components/auth/login-form.tsx`
Better Auth retorna um único `INVALID_EMAIL_OR_PASSWORD` para todas as falhas de credencial (confirmado via Context7). Para distinguir (FR-017), fazer **pré-check** antes/junto ao sign-in:
- `data/users.ts → getUserByEmail(email)` (ou Server Action equivalente): se **não** existir conta → "Não encontramos uma conta com este e-mail. Que tal criar uma?" (sugerir cadastro).
- Se existir e o sign-in falhar → "Senha incorreta."
- `status === 403` (`EMAIL_NOT_VERIFIED`, quando verificação ativa) → "Sua conta ainda não foi verificada. Verifique seu e-mail para continuar."
- Enumeração de contas: aceita conscientemente (Assumptions da spec).

### Signup — `components/auth/signup-form.tsx`
- `USER_ALREADY_EXISTS` → "Já existe uma conta com este e-mail."
- Senha fraca / e-mail inválido → validação zod pt-BR exibida no campo (`FieldError`).

### Alteração de senha — `components/profile/password-form.tsx` / `actions/change-password.ts`
- `INVALID_PASSWORD` → "Senha atual incorreta." (já implementado; migrar para o mapa central)
- Nova senha inválida / igual à atual → mensagem específica (validação + tratamento de erro).

### Ações protegidas (transversal)
- Não autenticado / sessão expirada → mensagem clara + redirecionar ao login quando aplicável.
- Falta de permissão → mensagem de permissão insuficiente.
- Registro não encontrado / já removido → mensagem específica.

## Padronização de canal e tom (FR-022)
- **Validação de campo** (obrigatório, tamanho, formato) → `FieldError` junto ao campo, em pt-BR (schemas zod).
- **Falha de submissão/servidor** → `toast` (sonner) com a mensagem mapeada.
- Tom orientador e consistente em todo o app; nunca exibir texto cru em inglês do provedor (SC-003).

## Cobertura de requisitos
FR-016, FR-017, FR-018, FR-019, FR-020 (mensagens de convite — ver `invitations.md`), FR-021, FR-022.
