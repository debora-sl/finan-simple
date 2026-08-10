"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { deleteHousehold } from "@/actions/delete-household";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteHouseholdButton({
  householdId,
  householdName,
}: {
  householdId: string;
  householdName: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { execute, isPending } = useAction(deleteHousehold, {
    onSuccess: () => {
      toast.success("Residência excluída.");
      router.push("/dashboard");
    },
    onError: useActionErrorHandler("Não foi possível excluir a residência."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2 />
        Excluir residência
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir residência</DialogTitle>
          <DialogDescription>
            Esta ação é permanente e não pode ser desfeita. Todas as despesas, categorias,
            convites e vínculos de membros de &quot;{householdName}&quot; serão removidos, e o
            acesso de todos os membros será revogado.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => execute({ householdId })}
          >
            {isPending ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
