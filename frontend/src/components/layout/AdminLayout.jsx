import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner";

export function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:flex-col md:w-64 border-r bg-background fixed inset-y-0 left-0 z-30">
        <AdminSidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 inset-y-0 w-64">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-14 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-20">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> Voir le site
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={logout} title="Se déconnecter">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-secondary/10">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
