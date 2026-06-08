import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SkillForm } from "@/components/admin/forms/SkillForm";
import { getSkills, deleteSkill } from "@/services/skill.service";
import { toast } from "sonner";

export default function SkillsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getSkills().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setDialogOpen(true); }
  function openEdit(row) { setEditing(row); setDialogOpen(true); }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteSkill(deleting.id);
      toast.success("Compétence supprimée.");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = [
    { key: "name", label: "Nom" },
    { key: "category", label: "Catégorie" },
    { key: "level", label: "Niveau", render: (r) => `${r.level}%` },
    { key: "order", label: "Ordre" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compétences</h1>
          <p className="text-muted-foreground">{items.length} compétence(s)</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={setDeleting} emptyText="Aucune compétence." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une compétence</DialogTitle></DialogHeader>
          <SkillForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer la compétence" description={`Voulez-vous supprimer "${deleting?.name}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
