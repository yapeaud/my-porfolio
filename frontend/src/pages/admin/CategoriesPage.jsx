import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/category.service";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1), slug: z.string().min(1) });

function CategoryForm({ initialData, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: initialData?.name || "", slug: initialData?.slug || "" },
  });
  async function onSubmit(values) {
    try {
      if (initialData) await updateCategory(initialData.id, values);
      else await createCategory(values);
      toast.success(initialData ? "Catégorie modifiée." : "Catégorie créée.");
      onSuccess();
    } catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-1"><Label>Nom</Label><Input {...register("name")} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
      <div className="space-y-1"><Label>Slug</Label><Input {...register("slug")} />{errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}</div>
      <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Enregistrement..." : "Enregistrer"}</Button>
    </form>
  );
}

export default function CategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getCategories().then((r) => setItems(r || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteCategory(deleting.id); toast.success("Catégorie supprimée."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const columns = [
    { key: "name", label: "Nom" },
    { key: "slug", label: "Slug" },
    { key: "_count", label: "Projets", render: (r) => r._count?.projects ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Catégories</h1><p className="text-muted-foreground">{items.length} catégorie(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucune catégorie." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une catégorie</DialogTitle></DialogHeader>
          <CategoryForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer" description={`Supprimer la catégorie "${deleting?.name}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
