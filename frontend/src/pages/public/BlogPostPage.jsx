import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPost } from "@/services/blog.service";
import { UPLOADS_BASE } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(slug).then(setPost).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 pt-24 space-y-4"><Skeleton className="h-64 w-full rounded-lg" /><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-full" /></div>;
  if (!post) return <div className="pt-24 text-center"><p className="text-muted-foreground">Article introuvable.</p><Link to="/blog" className="text-primary underline mt-4 block">Retour au blog</Link></div>;

  const imgSrc = post.coverImageUrl ? (post.coverImageUrl.startsWith("http") ? post.coverImageUrl : `${UPLOADS_BASE}${post.coverImageUrl}`) : null;

  return (
    <article className="max-w-3xl mx-auto px-4 pt-24 pb-16">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au blog</Link>
      </Button>
      {imgSrc && <img src={imgSrc} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-8" />}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        {post.category && <Badge>{post.category.name}</Badge>}
        {post.publishedAt && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: fr })}
          </span>
        )}
        {post.readingTime && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {post.readingTime} min de lecture
          </span>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground text-lg mb-8 border-l-4 border-primary pl-4">{post.excerpt}</p>
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
