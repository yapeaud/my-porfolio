import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";
import { getExperiences, deleteExperience } from "@/services/experience.service";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ExperiencePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getExperiences().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteExperience(deleting.id);
      toast.success("Expérience supprimée.");
      setDeleting(null);
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const fmt = (d) => d ? format(new Date(d), "MM/yyyy") : "Présent";
  const columns = [
    { key: "company", label: "Entreprise" },
    { key: "position", label: "Poste" },
    { key: "startDate", label: "Période", render: (r) => `${fmt(r.startDate)} — ${fmt(r.endDate)}` },
    { key: "location", label: "Lieu" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Expériences</h1><p className="text-muted-foreground">{items.length} expérience(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucune expérience." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une expérience</DialogTitle></DialogHeader>
          <ExperienceForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer l'expérience" description={`Supprimer "${deleting?.company} — ${deleting?.position}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
