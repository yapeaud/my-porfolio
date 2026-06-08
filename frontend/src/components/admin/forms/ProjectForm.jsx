import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { createProject, updateProject } from "@/services/project.service";
import { getCategories } from "@/services/category.service";
import { getTechs } from "@/services/tech.service";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  summary: z.string().min(1, "Requis"),
  description: z.string().min(1, "Requis"),
  liveUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  repoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  status: z.string().optional(),
  featured: z.boolean().optional(),
});

export function ProjectForm({ initialData, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [techs, setTechs] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState(initialData?.techs?.map((t) => t.id) || []);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?.toString() || "");
  const [images, setImages] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getTechs().then(setTechs).catch(() => {});
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { status: "completed", featured: false },
  });

  function toggleTech(id) {
    setSelectedTechs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function onSubmit(data) {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && v !== "" && fd.append(k, v.toString()));
      if (categoryId) fd.append("categoryId", categoryId);
      fd.append("techIds", selectedTechs.join(","));
      images.forEach((f) => fd.append("images", f));
      if (initialData) await updateProject(initialData.id, fd);
      else await createProject(fd);
      toast.success(initialData ? "Projet mis à jour." : "Projet ajouté.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="space-y-1">
        <Label>Titre</Label>
        <Input {...register("title")} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Résumé court</Label>
        <Input {...register("summary")} />
        {errors.summary && <p className="text-destructive text-xs">{errors.summary.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Description complète</Label>
        <Textarea rows={4} {...register("description")} />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>URL du demo</Label>
          <Input type="url" placeholder="https://..." {...register("liveUrl")} />
          {errors.liveUrl && <p className="text-destructive text-xs">{errors.liveUrl.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>URL GitHub</Label>
          <Input type="url" placeholder="https://github.com/..." {...register("repoUrl")} />
          {errors.repoUrl && <p className="text-destructive text-xs">{errors.repoUrl.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Catégorie</Label>
          <Select onValueChange={setCategoryId} defaultValue={categoryId}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Statut</Label>
          <Select onValueChange={(v) => {}} defaultValue="completed">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md bg-background">
          {selectedTechs.map((id) => {
            const t = techs.find((x) => x.id === id);
            if (!t) return null;
            return (
              <Badge key={id} className="gap-1">
                {t.name}
                <button type="button" onClick={() => toggleTech(id)}><X className="h-3 w-3" /></button>
              </Badge>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {techs.filter((t) => !selectedTechs.includes(t.id)).map((t) => (
            <Badge key={t.id} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => toggleTech(t.id)}>{t.name}</Badge>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <Label>Images (multiples)</Label>
        <Input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />
        <p className="text-xs text-muted-foreground">JPEG, PNG, WebP — max 5 MB chacune</p>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
