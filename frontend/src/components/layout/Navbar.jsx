import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/shared/DarkModeToggle";

const NAV_LINKS = [
  { href: "#about", label: "À propos" },
  { href: "#skills", label: "Compétences" },
  { href: "#education", label: "Parcours" },
  { href: "#experience", label: "Expériences" },
  { href: "#projects", label: "Projets" },
  { href: "#testimonials", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const handleClick = (href) => {
    setOpen(false);
    if (!isHome) return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent")}>
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Code2 className="h-6 w-6" />
          <span>Portfolio</span>
        </Link>
        <ul className="hidden md:flex items-center gap-1">
          {isHome && NAV_LINKS.map((l) => (
            <li key={l.href}>
              <button onClick={() => handleClick(l.href)} className="px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                {l.label}
              </button>
            </li>
          ))}
          {!isHome && (
            <li><Link to="/" className="px-3 py-2 text-sm hover:text-primary transition-colors">Accueil</Link></li>
          )}
          <li><Link to="/projects" className="px-3 py-2 text-sm hover:text-primary transition-colors">Projets</Link></li>
          <li><Link to="/blog" className="px-3 py-2 text-sm hover:text-primary transition-colors">Blog</Link></li>
          <li><DarkModeToggle /></li>
        </ul>
        <div className="flex items-center gap-1 md:hidden">
          <DarkModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-b px-4 py-4">
          <ul className="space-y-1">
            {isHome && NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button onClick={() => handleClick(l.href)} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  {l.label}
                </button>
              </li>
            ))}
            <li><Link to="/projects" className="block px-3 py-2 text-sm hover:bg-accent rounded-md" onClick={() => setOpen(false)}>Projets</Link></li>
            <li><Link to="/blog" className="block px-3 py-2 text-sm hover:bg-accent rounded-md" onClick={() => setOpen(false)}>Blog</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
