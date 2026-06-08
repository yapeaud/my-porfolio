import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/services/blog.service";

export function BlogSection() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts({ published: true, limit: 3 }).then((r) => setPosts(r.data || [])).catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <SectionWrapper id="blog">
      <SectionTitle title="Derniers Articles" subtitle="Mes réflexions sur le développement web" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((p, i) => <BlogCard key={p.id} post={p} index={i} />)}
      </div>
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link to="/blog">Voir tous les articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
