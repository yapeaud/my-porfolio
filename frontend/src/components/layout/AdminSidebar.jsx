import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, User, Zap, GraduationCap, Award, BookOpen,
  Briefcase, FolderKanban, MessageSquare, Quote, FileText, Tag, Cpu, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", icon: LayoutDashboard, label: "Tableau de bord", exact: true },
  { to: "/admin/profile", icon: User, label: "Profil" },
  { to: "/admin/skills", icon: Zap, label: "Compétences" },
  { to: "/admin/education", icon: GraduationCap, label: "Parcours" },
  { to: "/admin/certifications", icon: Award, label: "Certifications" },
  { to: "/admin/diplomas", icon: BookOpen, label: "Diplômes" },
  { to: "/admin/experience", icon: Briefcase, label: "Expériences" },
  { to: "/admin/projects", icon: FolderKanban, label: "Projets" },
  { to: "/admin/testimonials", icon: Quote, label: "Témoignages" },
  { to: "/admin/blog", icon: FileText, label: "Blog" },
  { to: "/admin/categories", icon: Tag, label: "Catégories" },
  { to: "/admin/techs", icon: Cpu, label: "Technologies" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export function AdminSidebar({ onClose }) {
  return (
    <aside className="h-full bg-background border-r flex flex-col w-64">
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-bold text-primary text-lg">Admin</span>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {LINKS.map(({ to, icon: Icon, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
                }
                onClick={onClose}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
