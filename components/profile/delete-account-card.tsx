"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { deleteAccount } from "@/actions/delete-account";
import { useActionErrorHandler } from "@/lib/action-error";
import { deleteAccountSchema, type DeleteAccountInput } from "@/lib/validation/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
  });

  const onError = useActionErrorHandler("Não foi possível excluir a conta.");

  const { execute, isPending } = useAction(deleteAccount, {
    onSuccess: () => {
      toast.success("Conta excluída.");
      router.push("/");
    },
    onError,
  });

  function onSubmit(values: DeleteAccountInput) {
    execute(values);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle>Zona de perigo</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button variant="destructive" />}>
            <Trash2 />
            Excluir conta
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <DialogHeader>
                <DialogTitle>Excluir conta</DialogTitle>
                <DialogDescription>
                  Esta ação é permanente e não pode ser desfeita. Confirme sua senha para excluir
                  sua conta e todos os seus dados pessoais.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="delete-account-password">Senha</FieldLabel>
                  <Input
                    id="delete-account-password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <FieldError errors={errors.password ? [errors.password] : undefined} />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <Button type="submit" variant="destructive" disabled={isPending}>
                  {isPending ? "Excluindo..." : "Excluir conta"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
