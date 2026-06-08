import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDiploma, updateDiploma } from "@/services/diploma.service";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  institution: z.string().min(1, "Requis"),
  year: z.coerce.number().min(1900).max(2100),
});

export function DiplomaForm({ initialData, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { year: new Date().getFullYear() },
  });

  async function onSubmit(data) {
    try {
      if (initialData) await updateDiploma(initialData.id, data);
      else await createDiploma(data);
      toast.success(initialData ? "Diplôme mis à jour." : "Diplôme ajouté.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Titre du diplôme</Label>
        <Input {...register("title")} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Établissement</Label>
        <Input {...register("institution")} />
        {errors.institution && <p className="text-destructive text-xs">{errors.institution.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Année d'obtention</Label>
        <Input type="number" {...register("year")} />
        {errors.year && <p className="text-destructive text-xs">{errors.year.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
