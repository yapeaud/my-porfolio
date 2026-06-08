import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createPost, updatePost } from "@/services/blog.service";
import { getCategories } from "@/services/category.service";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  excerpt: z.string().min(1, "Requis"),
  content: z.string().min(1, "Requis"),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export function BlogPostForm({ initialData, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?.toString() || "");
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  async function onSubmit(data) {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && v !== "" && fd.append(k, v));
      if (categoryId && categoryId !== "none") fd.append("categoryId", categoryId);
      if (coverImage) fd.append("image", coverImage);
      if (initialData) await updatePost(initialData.id, fd);
      else await createPost(fd);
      toast.success(initialData ? "Article mis à jour." : "Article créé.");
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
        <Label>Extrait</Label>
        <Textarea rows={2} {...register("excerpt")} />
        {errors.excerpt && <p className="text-destructive text-xs">{errors.excerpt.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Contenu (HTML ou texte)</Label>
        <Textarea rows={8} {...register("content")} />
        {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Catégorie</Label>
        <Select onValueChange={setCategoryId} defaultValue={categoryId || "none"}>
          <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Image de couverture</Label>
        <Input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Meta Titre (SEO)</Label>
          <Input {...register("metaTitle")} />
        </div>
        <div className="space-y-1">
          <Label>Meta Description (SEO)</Label>
          <Input {...register("metaDesc")} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer l'article"}
      </Button>
    </form>
  );
}
