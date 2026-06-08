import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createEducation, updateEducation } from "@/services/education.service";
import { toast } from "sonner";

const schema = z.object({
  school: z.string().min(1, "Requis"),
  degree: z.string().min(1, "Requis"),
  field: z.string().min(1, "Requis"),
  startYear: z.coerce.number().min(1900).max(2100),
  endYear: z.coerce.number().min(1900).max(2100).optional().or(z.literal("")),
  description: z.string().optional(),
});

export function EducationForm({ initialData, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      school: initialData.school || "",
      degree: initialData.degree || "",
      field: initialData.field || "",
      startYear: initialData.startYear || new Date().getFullYear(),
      endYear: initialData.endYear || "",
      description: initialData.description || "",
    } : { startYear: new Date().getFullYear(), endYear: "", description: "" },
  });

  async function onSubmit(data) {
    try {
      const payload = { ...data, endYear: data.endYear || null };
      if (initialData) await updateEducation(initialData.id, payload);
      else await createEducation(payload);
      toast.success(initialData ? "Formation mise à jour." : "Formation ajoutée.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>École / Université</Label>
        <Input {...register("school")} />
        {errors.school && <p className="text-destructive text-xs">{errors.school.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Diplôme/Titre</Label>
          <Input {...register("degree")} />
          {errors.degree && <p className="text-destructive text-xs">{errors.degree.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Domaine</Label>
          <Input {...register("field")} />
          {errors.field && <p className="text-destructive text-xs">{errors.field.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Année de début</Label>
          <Input type="number" {...register("startYear")} />
          {errors.startYear && <p className="text-destructive text-xs">{errors.startYear.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Année de fin (vide = En cours)</Label>
          <Input type="number" {...register("endYear")} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea rows={3} {...register("description")} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
