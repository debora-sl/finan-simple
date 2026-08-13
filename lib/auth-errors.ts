const CODE_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha inválidos.",
  INVALID_PASSWORD: "Senha incorreta.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Já existe uma conta com este e-mail.",
  EMAIL_NOT_VERIFIED: "Sua conta ainda não foi verificada. Verifique seu e-mail para continuar.",
  SESSION_EXPIRED: "Sua sessão expirou. Faça login novamente.",
  PASSWORD_TOO_SHORT: "A senha deve ter ao menos 8 caracteres.",
  PASSWORD_TOO_LONG: "A senha deve ter no máximo 128 caracteres.",
};

const STATUS_MESSAGES: Record<number, string> = {
  403: "Sua conta ainda não foi verificada. Verifique seu e-mail para continuar.",
};

const DEFAULT_MESSAGE = "Algo deu errado. Tente novamente.";

export function mapAuthError(codeOuStatus?: string | number | null): string {
  if (typeof codeOuStatus === "number") {
    return STATUS_MESSAGES[codeOuStatus] ?? DEFAULT_MESSAGE;
  }

  if (typeof codeOuStatus === "string" && codeOuStatus in CODE_MESSAGES) {
    return CODE_MESSAGES[codeOuStatus];
  }

  return DEFAULT_MESSAGE;
}
