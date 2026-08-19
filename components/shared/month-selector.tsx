"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMonthLabel, parseMonthValue } from "@/lib/report-period";
import type { AvailableMonth } from "@/data/expenses";

const ALL_MONTHS_VALUE = "all";

type MonthSelectorProps = {
  months: AvailableMonth[];
  value: string;
};

export function MonthSelector({ months, value }: MonthSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasSelectedMonth = months.some((month) => month.value === value);
  const parsedSelectedMonth = value !== ALL_MONTHS_VALUE ? parseMonthValue(value) : null;

  const options =
    !hasSelectedMonth && parsedSelectedMonth
      ? [
          {
            value,
            label: formatMonthLabel(parsedSelectedMonth.year, parsedSelectedMonth.month),
          },
          ...months,
        ]
      : months;

  function handleValueChange(next: string | null) {
    if (!next) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("month", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      items={[{ value: ALL_MONTHS_VALUE, label: "Todos os meses" }, ...options]}
    >
      <SelectTrigger>
        <CalendarDays className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_MONTHS_VALUE}>Todos os meses</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
