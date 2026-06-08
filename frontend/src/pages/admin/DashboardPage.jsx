import { useEffect, useState } from "react";
import { FolderKanban, Zap, Award, MessageSquare, Briefcase, Quote, FileText, BookOpen } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { getDashboardStats } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { getDashboardStats().then(setStats).catch(() => {}); }, []);

  const cards = [
    { title: "Projets", value: stats?.projects, icon: FolderKanban },
    { title: "Compétences", value: stats?.skills, icon: Zap },
    { title: "Certifications", value: stats?.certifications, icon: Award },
    { title: "Diplômes", value: stats?.diplomas, icon: BookOpen },
    { title: "Expériences", value: stats?.experiences, icon: Briefcase },
    { title: "Témoignages", value: stats?.testimonials, icon: Quote },
    { title: "Articles", value: stats?.posts, icon: FileText },
    { title: "Messages", value: stats?.messages, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre portfolio</p>
      </div>
      {stats?.unreadMessages > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm text-primary font-medium">
          Vous avez {stats.unreadMessages} message(s) non lu(s).
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => <StatsCard key={c.title} {...c} />)}
      </div>
    </div>
  );
}
