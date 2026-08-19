const APP_TIME_ZONE = "America/Sao_Paulo";

export type ReportPeriod =
  | { kind: "all" }
  | { kind: "month"; year: number; month: number; gte: Date; lt: Date };

function buildMonthPeriod(year: number, month: number): ReportPeriod {
  return {
    kind: "month",
    year,
    month,
    gte: new Date(Date.UTC(year, month - 1, 1)),
    lt: new Date(Date.UTC(year, month, 1)),
  };
}

function getCurrentMonthInAppTimeZone(): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);

  return { year, month };
}

export function resolveReportPeriod(monthParam?: string | string[]): ReportPeriod {
  const value = Array.isArray(monthParam) ? monthParam[0] : monthParam;

  if (value === "all") {
    return { kind: "all" };
  }

  const parsed = value ? parseMonthValue(value) : null;

  if (parsed) {
    return buildMonthPeriod(parsed.year, parsed.month);
  }

  const current = getCurrentMonthInAppTimeZone();
  return buildMonthPeriod(current.year, current.month);
}

export function formatMonthLabel(year: number, month: number): string {
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  return label;
}

export function toMonthValue(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseMonthValue(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) {
    return null;
  }

  return { year, month };
}

export function periodToValue(period: ReportPeriod): string {
  return period.kind === "all" ? "all" : toMonthValue(period.year, period.month);
}
