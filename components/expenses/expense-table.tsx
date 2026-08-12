"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { deleteExpense } from "@/actions/delete-expense";
import { toggleExpensePaid } from "@/actions/toggle-expense-paid";
import { useActionErrorHandler } from "@/lib/action-error";
import { formatCentsAsCurrency } from "@/lib/money";
import { formatCalendarDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseForm } from "@/components/expenses/expense-form";

type Category = { id: string; name: string };

type ExpenseRow = {
  id: string;
  description: string;
  amountInCents: number;
  dueDate: Date | null;
  paidDate: Date | null;
  categoryId: string | null;
  category: Category | null;
};

function getLocalToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ExpenseTable({
  expenses,
  categories,
}: {
  expenses: ExpenseRow[];
  categories: Category[];
}) {
  const { execute: removeExpense } = useAction(deleteExpense, {
    onSuccess: () => toast.success("Despesa removida."),
    onError: useActionErrorHandler("Não foi possível remover a despesa."),
  });

  const { execute: togglePaid } = useAction(toggleExpensePaid, {
    onError: useActionErrorHandler("Não foi possível atualizar o status da despesa."),
  });

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">Nenhuma despesa cadastrada</p>
        <p className="text-sm text-muted-foreground">
          Adicione sua primeira despesa para começar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium text-foreground">
              {expense.description}
            </TableCell>
            <TableCell>
              {expense.category ? (
                <Badge variant="secondary">{expense.category.name}</Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Sem categoria</span>
              )}
            </TableCell>
            <TableCell>
              {expense.dueDate ? (
                formatCalendarDate(new Date(expense.dueDate))
              ) : (
                <span className="text-sm text-muted-foreground">Sem vencimento</span>
              )}
            </TableCell>
            <TableCell className="cf-money text-right font-semibold text-foreground">
              {formatCentsAsCurrency(expense.amountInCents)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={expense.paidDate != null}
                  onCheckedChange={(checked) =>
                    togglePaid({
                      id: expense.id,
                      isPaid: checked,
                      clientToday: getLocalToday(),
                    })
                  }
                  aria-label={
                    expense.paidDate != null ? "Marcar como pendente" : "Marcar como paga"
                  }
                />
                <div className="flex flex-col">
                  <Badge variant={expense.paidDate != null ? "default" : "secondary"}>
                    {expense.paidDate != null ? "Paga" : "Pendente"}
                  </Badge>
                  {expense.paidDate ? (
                    <span className="text-xs text-muted-foreground">
                      {formatCalendarDate(new Date(expense.paidDate))}
                    </span>
                  ) : null}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <ExpenseForm
                  categories={categories}
                  expense={expense}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Editar despesa">
                      <Pencil />
                    </Button>
                  }
                />
                <ConfirmDeleteButton
                  triggerLabel="Remover despesa"
                  title="Remover despesa"
                  description={`Tem certeza que deseja remover "${expense.description}"? Esta ação não pode ser desfeita.`}
                  confirmLabel="Remover"
                  onConfirm={() => removeExpense({ id: expense.id })}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
