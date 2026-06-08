import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjects } from "@/services/project.service";
import { getCategories } from "@/services/category.service";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProjectsPage() {
  const [data, setData] = useState({ data: [], total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    getProjects({ search: debouncedSearch, category: category || undefined, page, limit: 9 })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, page]);

  return (
    <SectionWrapper className="pt-24">
      <SectionTitle title="Tous mes Projets" subtitle="Découvrez l'ensemble de mes réalisations" />
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Rechercher un projet..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!category ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-sm"
            onClick={() => { setCategory(""); setPage(1); }}
          >Tous</Badge>
          {categories.map((c) => (
            <Badge
              key={c.id}
              variant={category === c.slug ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm"
              onClick={() => { setCategory(c.slug); setPage(1); }}
            >{c.name}</Badge>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      ) : data.data.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">Aucun projet trouvé.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.data.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Précédent</Button>
              <span className="flex items-center text-sm text-muted-foreground px-3">Page {page} / {data.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Suivant</Button>
            </div>
          )}
        </>
      )}
    </SectionWrapper>
  );
}
