"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type { z } from "zod";

import { createCategory } from "@/actions/create-category";
import { updateCategory } from "@/actions/update-category";
import { useActionErrorHandler } from "@/lib/action-error";
import { createCategorySchema } from "@/lib/validation/category";
import type { CategoryColorSlug } from "@/lib/category-colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryColorPicker } from "@/components/categories/category-color-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type CategoryRecord = { id: string; name: string; color?: string | null };
type CategoryFormValues = z.infer<typeof createCategorySchema>;

export function CategoryForm({
  category,
  trigger,
}: {
  category?: CategoryRecord;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      color: (category?.color as CategoryColorSlug | null | undefined) ?? undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        color: (category?.color as CategoryColorSlug | null | undefined) ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const actionOptions = {
    onSuccess: () => {
      toast.success(isEdit ? "Categoria atualizada." : "Categoria criada.");
      setOpen(false);
    },
    onError: useActionErrorHandler("Não foi possível salvar a categoria."),
  };

  const createAction = useAction(createCategory, actionOptions);
  const updateAction = useAction(updateCategory, actionOptions);
  const isPending = isEdit ? updateAction.isPending : createAction.isPending;

  function onSubmit(values: CategoryFormValues) {
    if (isEdit) {
      updateAction.execute({ id: category.id, ...values });
    } else {
      createAction.execute(values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>

        <form id="category-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="category-name">Nome</FieldLabel>
              <Input
                id="category-name"
                placeholder="Ex: Moradia"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field>
              <FieldLabel>Cor</FieldLabel>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <CategoryColorPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button type="submit" form="category-form" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
