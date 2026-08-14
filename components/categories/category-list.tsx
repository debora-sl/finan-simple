"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { deleteCategory } from "@/actions/delete-category";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryIcon } from "@/components/categories/category-icon";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

type Category = { id: string; name: string; color?: string | null };

export function CategoryList({ categories }: { categories: Category[] }) {
  const { execute: removeCategory } = useAction(deleteCategory, {
    onSuccess: () => toast.success("Categoria removida."),
    onError: useActionErrorHandler("Não foi possível remover a categoria."),
  });

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">Nenhuma categoria cadastrada</p>
        <p className="text-sm text-muted-foreground">
          Crie categorias para organizar suas despesas.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex items-center justify-between gap-4 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <CategoryIcon id={category.id} color={category.color} />
            <span className="text-sm font-medium text-foreground">{category.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <CategoryForm
              category={category}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Editar categoria">
                  <Pencil />
                </Button>
              }
            />
            <ConfirmDeleteButton
              triggerLabel="Remover categoria"
              title="Remover categoria"
              description={`Tem certeza que deseja remover a categoria "${category.name}"? As despesas dessa categoria ficarão sem categoria. Esta ação não pode ser desfeita.`}
              confirmLabel="Remover"
              onConfirm={() => removeCategory({ id: category.id })}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
