import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createExperience, updateExperience } from "@/services/experience.service";
import { toast } from "sonner";

const schema = z.object({
  company: z.string().min(1, "Requis"),
  position: z.string().min(1, "Requis"),
  startDate: z.string().min(1, "Requis"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Requis"),
  location: z.string().optional(),
});

export function ExperienceForm({ initialData, onSuccess }) {
  const fmtDate = (d) => d ? new Date(d).toISOString().split("T")[0] : "";
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      company: initialData.company || "",
      position: initialData.position || "",
      startDate: fmtDate(initialData.startDate),
      endDate: fmtDate(initialData.endDate),
      description: initialData.description || "",
      location: initialData.location || "",
    } : {},
  });

  async function onSubmit(data) {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && v !== "" && fd.append(k, v));
      if (initialData) await updateExperience(initialData.id, fd);
      else await createExperience(fd);
      toast.success(initialData ? "Expérience mise à jour." : "Expérience ajoutée.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Entreprise</Label>
          <Input {...register("company")} />
          {errors.company && <p className="text-destructive text-xs">{errors.company.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Poste</Label>
          <Input {...register("position")} />
          {errors.position && <p className="text-destructive text-xs">{errors.position.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Date de début</Label>
          <Input type="date" {...register("startDate")} />
          {errors.startDate && <p className="text-destructive text-xs">{errors.startDate.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Date de fin (vide = Présent)</Label>
          <Input type="date" {...register("endDate")} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Localisation</Label>
        <Input {...register("location")} />
      </div>
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea rows={4} {...register("description")} />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
