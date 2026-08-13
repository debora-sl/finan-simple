"use client";

import { Check, Circle } from "lucide-react";

import { checklistRequirements } from "@/lib/validation/password-policy";
import { cn } from "@/lib/utils";

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul aria-live="polite" className="mt-2 flex flex-col gap-1">
      {checklistRequirements.map((requirement) => {
        const isMet = requirement.test(password);
        const Icon = isMet ? Check : Circle;

        return (
          <li
            key={requirement.id}
            className={cn(
              "flex items-center gap-2 text-sm",
              isMet ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>
              {requirement.label}
              <span className="sr-only">{isMet ? " — atendido" : " — pendente"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
