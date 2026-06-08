import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CertificationForm } from "@/components/admin/forms/CertificationForm";
import { getCertifications, deleteCertification } from "@/services/certification.service";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CertificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getCertifications().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteCertification(deleting.id); toast.success("Certification supprimée."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const columns = [
    { key: "title", label: "Titre" },
    { key: "issuer", label: "Organisme" },
    { key: "issueDate", label: "Date", render: (r) => r.issueDate ? format(new Date(r.issueDate), "MM/yyyy") : "—" },
    { key: "credentialId", label: "ID" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Certifications</h1><p className="text-muted-foreground">{items.length} certification(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucune certification." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une certification</DialogTitle></DialogHeader>
          <CertificationForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer" description={`Supprimer "${deleting?.title}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
