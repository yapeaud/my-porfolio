import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getTechs, createTech, updateTech, deleteTech } from "@/services/tech.service";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1, "Nom requis") });

function TechForm({ initialData, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: initialData?.name || "" },
  });
  async function onSubmit(values) {
    try {
      if (initialData) await updateTech(initialData.id, values);
      else await createTech(values);
      toast.success(initialData ? "Technologie modifiée." : "Technologie créée.");
      onSuccess();
    } catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-1"><Label>Nom</Label><Input {...register("name")} placeholder="ex: React, Node.js..." />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
      <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Enregistrement..." : "Enregistrer"}</Button>
    </form>
  );
}

export default function TechsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getTechs().then((r) => setItems(r || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteTech(deleting.id); toast.success("Technologie supprimée."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const columns = [
    { key: "name", label: "Nom" },
    { key: "_count", label: "Projets liés", render: (r) => r._count?.projects ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Technologies</h1><p className="text-muted-foreground">{items.length} technologie(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucune technologie." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une technologie</DialogTitle></DialogHeader>
          <TechForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer" description={`Supprimer "${deleting?.name}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
