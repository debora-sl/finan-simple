export function parseCalendarDate(input: string): Date {
  return new Date(`${input}T00:00:00.000Z`);
}

const calendarDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "UTC",
});

export function formatCalendarDate(date: Date): string {
  return calendarDateFormatter.format(date);
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}
