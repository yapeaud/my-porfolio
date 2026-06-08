import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EducationForm } from "@/components/admin/forms/EducationForm";
import { getEducation, deleteEducation } from "@/services/education.service";
import { toast } from "sonner";

export default function EducationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getEducation().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteEducation(deleting.id); toast.success("Formation supprimée."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const columns = [
    { key: "school", label: "École" },
    { key: "degree", label: "Diplôme" },
    { key: "field", label: "Domaine" },
    { key: "startYear", label: "Période", render: (r) => `${r.startYear} — ${r.endYear || "En cours"}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Parcours Scolaire</h1><p className="text-muted-foreground">{items.length} formation(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucune formation." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une formation</DialogTitle></DialogHeader>
          <EducationForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer" description={`Supprimer "${deleting?.school}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
