import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createTestimonial, updateTestimonial } from "@/services/testimonial.service";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Requis"),
  position: z.string().min(1, "Requis"),
  company: z.string().min(1, "Requis"),
  content: z.string().min(10, "Minimum 10 caractères"),
  rating: z.coerce.number().min(1).max(5),
});

export function TestimonialForm({ initialData, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { rating: 5 },
  });

  async function onSubmit(data) {
    try {
      if (initialData) await updateTestimonial(initialData.id, data);
      else await createTestimonial(data);
      toast.success(initialData ? "Témoignage mis à jour." : "Témoignage ajouté.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Nom</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Poste</Label>
          <Input {...register("position")} />
          {errors.position && <p className="text-destructive text-xs">{errors.position.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Entreprise</Label>
          <Input {...register("company")} />
          {errors.company && <p className="text-destructive text-xs">{errors.company.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Note (1-5)</Label>
          <Input type="number" min="1" max="5" {...register("rating")} />
          {errors.rating && <p className="text-destructive text-xs">{errors.rating.message}</p>}
        </div>
      </div>
      <div className="space-y-1">
        <Label>Commentaire</Label>
        <Textarea rows={4} {...register("content")} />
        {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
