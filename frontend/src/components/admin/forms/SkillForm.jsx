import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { createSkill, updateSkill } from "@/services/skill.service";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Requis"),
  category: z.string().min(1, "Requis"),
  level: z.coerce.number().min(0).max(100),
  iconUrl: z.string().optional(),
  order: z.coerce.number().optional(),
});

export function SkillForm({ initialData, onSuccess }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { level: 50, order: 0 },
  });

  async function onSubmit(data) {
    try {
      if (initialData) await updateSkill(initialData.id, data);
      else await createSkill(data);
      toast.success(initialData ? "Compétence mise à jour." : "Compétence ajoutée.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Nom</Label>
        <Input placeholder="ex: React" {...register("name")} />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Catégorie</Label>
        <Select onValueChange={(v) => setValue("category", v)} defaultValue={initialData?.category || ""}>
          <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
          <SelectContent>
            {SKILL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-destructive text-xs">{errors.category.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Niveau ({watch("level") || 50}%)</Label>
        <Input type="range" min="0" max="100" {...register("level")} className="accent-primary" />
      </div>
      <div className="space-y-1">
        <Label>Ordre d'affichage</Label>
        <Input type="number" {...register("order")} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
