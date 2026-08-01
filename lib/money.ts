export function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function centsToAmount(amountInCents: number): number {
  return amountInCents / 100;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCentsAsCurrency(amountInCents: number): string {
  return currencyFormatter.format(centsToAmount(amountInCents));
}
