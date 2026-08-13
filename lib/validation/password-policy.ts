export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const checklistRequirements: PasswordRequirement[] = [
  {
    id: "min-length",
    label: "Ao menos 8 caracteres",
    test: (password: string) => password.length >= PASSWORD_MIN_LENGTH,
  },
];
