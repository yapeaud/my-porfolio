import { useEffect, useState } from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts } from "@/services/blog.service";

export default function BlogPage() {
  const [data, setData] = useState({ data: [], totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts({ published: true, page, limit: 6 }).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  return (
    <SectionWrapper className="pt-24">
      <SectionTitle title="Blog" subtitle="Mes réflexions sur le développement web" />
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      ) : data.data.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">Aucun article disponible pour le moment.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.data.map((p, i) => <BlogCard key={p.id} post={p} index={i} />)}
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
