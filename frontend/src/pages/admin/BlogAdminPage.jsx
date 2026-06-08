import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BlogPostForm } from "@/components/admin/forms/BlogPostForm";
import { getPosts, deletePost, togglePublish } from "@/services/blog.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BlogAdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getPosts({ limit: 100 }).then((r) => setData(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deletePost(deleting.id); toast.success("Article supprimé."); setDeleting(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Erreur."); }
    finally { setDeleteLoading(false); }
  }

  async function handleTogglePublish(post) {
    try { await togglePublish(post.id); toast.success(post.published ? "Article dépublié." : "Article publié."); load(); }
    catch (e) { toast.error("Erreur."); }
  }

  const columns = [
    { key: "title", label: "Titre" },
    { key: "category", label: "Catégorie", render: (r) => r.category?.name || "—" },
    { key: "published", label: "Statut", render: (r) => (
      <button onClick={() => handleTogglePublish(r)}>
        <Badge variant={r.published ? "default" : "secondary"}>{r.published ? "Publié" : "Brouillon"}</Badge>
      </button>
    )},
    { key: "readingTime", label: "Lecture", render: (r) => r.readingTime ? `${r.readingTime} min` : "—" },
    { key: "createdAt", label: "Date", render: (r) => format(new Date(r.createdAt), "dd/MM/yyyy") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Articles de Blog</h1><p className="text-muted-foreground">{data.length} article(s)</p></div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nouveau</Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={(r) => { setEditing(r); setDialogOpen(true); }} onDelete={setDeleting} emptyText="Aucun article." />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editing ? "Modifier" : "Créer"} un article</DialogTitle></DialogHeader>
          <BlogPostForm initialData={editing} onSuccess={() => { setDialogOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer l'article" description={`Supprimer "${deleting?.title}" ?`} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
