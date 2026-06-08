import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { getProjects, deleteProject } from "@/services/project.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProjectsAdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getProjects({ limit: 100 }).then((r) => setData(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteProject(deleting.id); toast.success("Projet supprimé."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const columns = [
    { key: "title", label: "Titre" },
    { key: "category", label: "Catégorie", render: (r) => r.category?.name || "—" },
    { key: "techs", label: "Technologies", render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.techs?.slice(0, 3).map((t) => <Badge key={t.id} variant="secondary" className="text-xs py-0">{t.name}</Badge>)}
        {r.techs?.length > 3 && <Badge variant="secondary" className="text-xs py-0">+{r.techs.length - 3}</Badge>}
      </div>
    )},
    { key: "featured", label: "Vedette", render: (r) => r.featured ? "✓" : "—" },
    { key: "status", label: "Statut" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Projets</h1><p className="text-muted-foreground">{data.length} projet(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucun projet." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} un projet</DialogTitle></DialogHeader>
          <ProjectForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer le projet" description={`Supprimer "${deleting?.title}" et toutes ses images ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
