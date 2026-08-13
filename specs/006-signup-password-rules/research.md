# Phase 0 Research: Regras de Senha no Cadastro

## R1 — Política de senha efetiva do servidor (Better Auth)

**Decisão**: Manter a política atual — mínimo 8, máximo 128 caracteres — e torná-la **explícita** na configuração do Better Auth via `emailAndPassword.minPasswordLength` e `emailAndPassword.maxPasswordLength`.

**Rationale**: Verificado via Context7 (`/better-auth/better-auth`, `docs/reference/options.mdx` e `packages/core/src/types/init-options.ts`) que o `emailAndPassword` aceita `minPasswordLength` (default 8) e `maxPasswordLength` (default 128). Hoje `lib/auth.ts` não define esses valores, dependendo dos defaults implícitos. Torná-los explícitos documenta a política no código, evita quebra silenciosa caso os defaults mudem entre versões e serve como âncora de verificação para a fonte única da UI/Zod. O `signupSchema` atual (`lib/validation/auth.ts`) já usa `min(8)` mas **não** limita o máximo — o teto de 128 é aplicado hoje apenas pelo servidor, o que satisfaz FR-003/FR-004 apenas se replicado no cliente.

**Alternativas consideradas**:
- *Não tocar em `lib/auth.ts` e confiar nos defaults*: rejeitado — deixa a política implícita e não auditável; contraria a intenção de "fonte única da verdade" e o risco de divergência entre versões.
- *Endurecer a política (letra + número, etc.)*: rejeitado — fora de escopo por decisão explícita nas Assumptions da spec (não endurecer sem decisão).

## R2 — Consistência cliente/servidor (FR-004)

**Decisão**: Criar `lib/validation/password-policy.ts` como fonte única exportando as constantes (`PASSWORD_MIN_LENGTH = 8`, `PASSWORD_MAX_LENGTH = 128`), a lista de requisitos com seus predicados, e um helper para aplicar min/max ao Zod. `signupSchema` e a config do Better Auth consomem as mesmas constantes.

**Rationale**: FR-004 e SC-003 exigem que toda regra exibida seja aplicada de forma idêntica no cliente e no servidor. Better Auth (servidor) valida por comprimento numérico; Zod (cliente) deve validar `.min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH)` com as **mesmas** constantes. Assim, texto exibido, checklist, Zod e Better Auth derivam todos do mesmo módulo — DRY (Princípio IV) e sem divergência possível.

**Alternativas consideradas**:
- *Duplicar os números "8" e "128" em cada local*: rejeitado — viola DRY e é a causa raiz exata da divergência descrita nos Edge Cases da spec.

## R3 — Contagem de caracteres e espaços em branco (Edge Case)

**Decisão**: O checklist e o Zod contam `password.length` sobre o valor **cru** do campo (sem `trim`), coerente com o que o Better Auth valida (o servidor não apara a senha). O `signupSchema` do campo `password` **não** aplica `.trim()`.

**Rationale**: A spec (Edge Cases → "Espaços em branco") exige que a contagem para "ao menos 8" siga a mesma regra da validação efetiva, sem recorte silencioso que faça o checklist divergir da submissão. O Better Auth valida o comprimento da senha como enviada. Portanto o cliente deve contar da mesma forma. (Nota: o campo `name` continua com `.trim()` — a mudança é só no `password`.)

**Alternativas consideradas**:
- *Aplicar `.trim()` na senha no cliente*: rejeitado — faria o checklist marcar "atendido" para uma senha que o servidor conta diferente, quebrando SC-003.

## R4 — Componente de checklist acessível (FR-005, FR-006, FR-008, SC-005)

**Decisão**: Novo componente `components/auth/password-requirements.tsx` que recebe o valor atual da senha, avalia cada requisito e renderiza uma lista onde cada item combina **ícone** (`lucide-react`: `Check` para atendido, `Circle` para pendente) **e texto**, com estado também exposto a leitores de tela. Usa `role="list"`/itens e `aria-live="polite"` para anunciar mudanças; cada item traz texto de estado (ex.: sufixo visualmente oculto "— atendido"/"— pendente") para não depender só de cor. Sem novo componente shadcn — composição de `Field`/primitivos + tokens de tema.

**Rationale**: Não há componente shadcn/ui dedicado a "checklist de requisitos" (inventário verificado em `components/ui/`). A constituição permite compor primitivos quando não há equivalente pronto. FR-008/SC-005 exigem percepção por tecnologia assistiva e independência de cor — daí ícone + texto de estado + `aria-live`. A cor apenas reforça (token `text-primary`/`text-muted-foreground`), nunca é o único sinal.

**Alternativas consideradas**:
- *Usar apenas cor (verde/cinza) nos itens*: rejeitado — viola FR-008 e SC-005.
- *Usar o componente `Progress`*: rejeitado — comunica progresso agregado, não o estado por-requisito exigido por FR-005/FR-006.

## R5 — Observar o valor da senha em tempo real (FR-005, FR-006)

**Decisão**: No `signup-form.tsx`, usar `watch("password")` do react-hook-form já em uso para obter o valor a cada tecla e passá-lo ao `PasswordRequirements`. O texto de apoio estático (US1) é renderizado independentemente do estado, sempre visível abaixo do campo.

**Rationale**: O formulário já usa `useForm` com `zodResolver`; `watch` é o mecanismo idiomático para leitura reativa sem estado adicional, atendendo tanto adição quanto remoção de caracteres (FR-006). O texto de apoio fixo garante US1 (visível antes de qualquer interação) mesmo com o campo vazio.

**Alternativas consideradas**:
- *`useState` separado para a senha*: rejeitado — duplicaria a fonte do valor já gerenciada pelo react-hook-form, contrariando DRY.
