import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { getTestimonials, deleteTestimonial } from "@/services/testimonial.service";
import { toast } from "sonner";

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getTestimonials().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteTestimonial(deleting.id); toast.success("Témoignage supprimé."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const columns = [
    { key: "name", label: "Nom" },
    { key: "position", label: "Poste" },
    { key: "company", label: "Entreprise" },
    { key: "rating", label: "Note", render: (r) => `${r.rating}/5` },
    { key: "content", label: "Commentaire", render: (r) => <span className="line-clamp-1 max-w-xs block">{r.content}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Témoignages</h1><p className="text-muted-foreground">{items.length} témoignage(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucun témoignage." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} un témoignage</DialogTitle></DialogHeader>
          <TestimonialForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer" description={`Supprimer le témoignage de "${deleting?.name}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
