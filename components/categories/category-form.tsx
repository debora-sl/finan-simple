"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createCategory } from "@/actions/create-category";
import { updateCategory } from "@/actions/update-category";
import { categorySchema, type CategoryInput } from "@/lib/validation/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type CategoryRecord = { id: string; name: string };

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
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "" },
  });

  useEffect(() => {
    if (open) {
      reset({ name: category?.name ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const actionOptions = {
    onSuccess: () => {
      toast.success(isEdit ? "Categoria atualizada." : "Categoria criada.");
      setOpen(false);
    },
    onError: ({ error }: { error: { serverError?: string } }) => {
      toast.error(error.serverError ?? "Não foi possível salvar a categoria.");
    },
  };

  const createAction = useAction(createCategory, actionOptions);
  const updateAction = useAction(updateCategory, actionOptions);
  const isPending = isEdit ? updateAction.isPending : createAction.isPending;

  function onSubmit(values: CategoryInput) {
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
