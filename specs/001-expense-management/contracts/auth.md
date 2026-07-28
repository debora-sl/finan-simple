# Contract: Autenticação (Better Auth)

**Feature**: 001-expense-management | Cobre: US1, FR-001..FR-006

A autenticação é exposta pelo Better Auth via handler HTTP e consumida no cliente pelo auth-client. Não há Server Actions próprias de auth — usa-se a API do Better Auth. Isolamento e verificação de sessão ficam na DAL (`lib/dal.ts`).

## Endpoint HTTP

- **Rota**: `app/api/auth/[...all]/route.ts` (exports `GET`, `POST` via `toNextJsHandler(auth)`).
- **Base**: `/api/auth/*` (gerenciado internamente pelo Better Auth).

## Operações do cliente (`lib/auth-client.ts`)

### signUp.email
- **Entrada**: `{ name: string, email: string, password: string }`
- **Sucesso**: cria `User` + `Account` (hash de senha), inicia sessão, retorna usuário.
- **Erros**:
  - E-mail já cadastrado → mensagem clara, cadastro recusado (FR-002; Cenário US1.3).
  - Validação (nome < 2, e-mail inválido, senha < 8) → erro por campo (FR-018; edge cases).

### signIn.email
- **Entrada**: `{ email: string, password: string }`
- **Sucesso**: valida credenciais, cria `Session`, define cookie de sessão.
- **Erros**: credenciais inválidas → mensagem genérica **sem revelar** qual campo está errado (Cenário US1.4).

### signOut
- **Entrada**: — (sessão atual)
- **Sucesso**: invalida a sessão e remove o cookie; usuário perde acesso à área autenticada (FR-004; Cenário US1.5).

### useSession (hook client)
- Retorna `{ data: session | null, isPending }` para UI reativa (ex.: exibir nome, botão sair).

## Camada de acesso a dados (`lib/dal.ts`) — servidor

### verifySession()
- Lê a sessão via `auth.api.getSession({ headers: await headers() })`.
- Sem sessão → `redirect('/login')`.
- Com sessão → retorna `{ userId }`. Memoizado com `cache` (React) por render pass.

### getCurrentUser()
- Chama `verifySession()`, retorna dados mínimos do usuário (`id`, `name`, `email`) — DTO, sem campos sensíveis.

## Proteção de rotas (`proxy.ts`)

- Checagem **otimista** por cookie de sessão (sem consulta ao banco).
- Rota do grupo `(app)` sem cookie → redirect `/login`.
- `/login` ou `/signup` com cookie → redirect `/dashboard`.
- `matcher` exclui `api`, `_next/static`, `_next/image`, assets.

## Invariantes de segurança
- Nenhuma senha em texto puro é persistida ou logada.
- Toda rota/ação autenticada depende de `verifySession()` — o proxy não é a única defesa (FR-005, SC-004).
- Falhas de login não distinguem "e-mail inexistente" de "senha errada".
