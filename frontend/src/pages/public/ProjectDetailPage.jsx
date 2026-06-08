import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/SocialIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProject } from "@/services/project.service";
import { UPLOADS_BASE } from "@/lib/constants";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    getProject(slug).then(setProject).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 pt-24 space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );

  if (!project) return (
    <div className="pt-24 text-center">
      <p className="text-muted-foreground">Projet introuvable.</p>
      <Link to="/projects" className="text-primary underline mt-4 block">Retour aux projets</Link>
    </div>
  );

  const images = project.images || [];
  const primaryImg = images.find((i) => i.isPrimary) || images[0];
  const sorted = primaryImg ? [primaryImg, ...images.filter((i) => i.id !== primaryImg.id)] : images;
  const current = sorted[activeImg];
  const imgSrc = current ? (current.url.startsWith("http") ? current.url : `${UPLOADS_BASE}${current.url}`) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link to="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets</Link>
      </Button>

      {imgSrc && (
        <div className="mb-8">
          <img src={imgSrc} alt={current?.alt || project.title} className="w-full h-72 md:h-96 object-cover rounded-xl mb-3" />
          {sorted.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sorted.map((img, i) => {
                const src = img.url.startsWith("http") ? img.url : `${UPLOADS_BASE}${img.url}`;
                return (
                  <button key={img.id} onClick={() => setActiveImg(i)} className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                    <img src={src} alt={img.alt || ""} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {project.category && <Badge>{project.category.name}</Badge>}
        {project.status && <Badge variant="outline">{project.status}</Badge>}
        {project.featured && <Badge variant="secondary">Vedette</Badge>}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>

      {project.summary && <p className="text-muted-foreground text-lg mb-6 border-l-4 border-primary pl-4">{project.summary}</p>}

      {project.description && (
        <div className="prose prose-slate max-w-none mb-8" dangerouslySetInnerHTML={{ __html: project.description }} />
      )}

      {project.techs?.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.techs.map((t) => <Badge key={t.id} variant="secondary">{t.name}</Badge>)}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {project.liveUrl && (
          <Button asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Voir le projet
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button asChild variant="outline">
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="mr-2 h-4 w-4" /> Code source
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
