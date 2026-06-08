import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getMessages, toggleRead, deleteMessage } from "@/services/contact.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => { setLoading(true); getMessages().then((r) => setMessages(r.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleToggleRead(msg) {
    try { await toggleRead(msg.id); load(); }
    catch { toast.error("Erreur."); }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try { await deleteMessage(deleting.id); toast.success("Message supprimé."); setDeleting(null); if (selected?.id === deleting.id) setSelected(null); load(); }
    catch { toast.error("Erreur."); }
    finally { setDeleteLoading(false); }
  }

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages de Contact</h1>
        <p className="text-muted-foreground">{messages.length} message(s) — {unread} non lu(s)</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {loading ? <p className="text-muted-foreground text-sm">Chargement...</p>
            : messages.length === 0 ? <p className="text-muted-foreground text-sm py-8 text-center">Aucun message.</p>
            : messages.map((msg) => (
              <Card
                key={msg.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${selected?.id === msg.id ? "ring-2 ring-primary" : ""} ${!msg.isRead ? "border-primary/30 bg-primary/5" : ""}`}
                onClick={() => setSelected(msg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {msg.isRead ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                      <span className={`font-medium text-sm ${!msg.isRead ? "text-foreground" : "text-muted-foreground"}`}>{msg.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{format(new Date(msg.createdAt), "d MMM", { locale: fr })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                </CardContent>
              </Card>
            ))}
        </div>
        {selected ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{selected.subject}</h3>
                  <p className="text-sm text-muted-foreground">{selected.name} — <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a></p>
                  <p className="text-xs text-muted-foreground">{format(new Date(selected.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}</p>
                </div>
                <Badge variant={selected.isRead ? "secondary" : "default"}>{selected.isRead ? "Lu" : "Non lu"}</Badge>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap border-t pt-4">{selected.message}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleToggleRead(selected)}>
                  {selected.isRead ? "Marquer non lu" : "Marquer lu"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleting(selected)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="hidden md:flex items-center justify-center text-muted-foreground border rounded-lg">
            <p>Sélectionnez un message</p>
          </div>
        )}
      </div>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Supprimer le message" description="Cette action est irréversible." onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
