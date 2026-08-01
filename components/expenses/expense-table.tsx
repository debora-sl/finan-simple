"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { deleteExpense } from "@/actions/delete-expense";
import { toggleExpensePaid } from "@/actions/toggle-expense-paid";
import { formatCentsAsCurrency } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseForm } from "@/components/expenses/expense-form";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

type Category = { id: string; name: string };

type ExpenseRow = {
  id: string;
  description: string;
  amountInCents: number;
  date: Date;
  isPaid: boolean;
  categoryId: string | null;
  category: Category | null;
};

export function ExpenseTable({
  expenses,
  categories,
}: {
  expenses: ExpenseRow[];
  categories: Category[];
}) {
  const { execute: removeExpense } = useAction(deleteExpense, {
    onSuccess: () => toast.success("Despesa removida."),
    onError: ({ error }) =>
      toast.error(error.serverError ?? "Não foi possível remover a despesa."),
  });

  const { execute: togglePaid } = useAction(toggleExpensePaid, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "Não foi possível atualizar o status da despesa."),
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
          <TableHead>Data</TableHead>
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
            <TableCell>{dateFormatter.format(new Date(expense.date))}</TableCell>
            <TableCell className="text-right">
              {formatCentsAsCurrency(expense.amountInCents)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={expense.isPaid}
                  onCheckedChange={(checked) =>
                    togglePaid({ id: expense.id, isPaid: checked })
                  }
                  aria-label={expense.isPaid ? "Marcar como pendente" : "Marcar como paga"}
                />
                <Badge variant={expense.isPaid ? "default" : "secondary"}>
                  {expense.isPaid ? "Paga" : "Pendente"}
                </Badge>
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remover despesa"
                  onClick={() => removeExpense({ id: expense.id })}
                >
                  <Trash2 />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
