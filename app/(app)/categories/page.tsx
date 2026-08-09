import { Plus } from "lucide-react";

import { getActiveHousehold } from "@/lib/active-household";
import { getCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";

export default async function CategoriesPage() {
  const { householdId } = await getActiveHousehold();
  const categories = await getCategories(householdId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Categorias
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize suas despesas em categorias.
          </p>
        </div>
        <CategoryForm
          trigger={
            <Button>
              <Plus />
              Nova categoria
            </Button>
          }
        />
      </div>

      <CategoryList categories={categories} />
    </div>
  );
}
