"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { deleteCategory } from "@/actions/delete-category";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryIcon } from "@/components/categories/category-icon";

type Category = { id: string; name: string };

export function CategoryList({ categories }: { categories: Category[] }) {
  const { execute: removeCategory } = useAction(deleteCategory, {
    onSuccess: () => toast.success("Categoria removida."),
    onError: ({ error }) =>
      toast.error(error.serverError ?? "Não foi possível remover a categoria."),
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
            <CategoryIcon id={category.id} />
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
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remover categoria"
              onClick={() => removeCategory({ id: category.id })}
            >
              <Trash2 />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
