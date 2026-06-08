import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/SocialIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UPLOADS_BASE } from "@/lib/constants";

export function ProjectCard({ project, index = 0 }) {
  const primaryImage = project.images?.find((i) => i.isPrimary) || project.images?.[0];
  const imgSrc = primaryImage?.url
    ? primaryImage.url.startsWith("http") ? primaryImage.url : `${UPLOADS_BASE}${primaryImage.url}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
          {imgSrc ? (
            <img src={imgSrc} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-bold">
              {project.title[0]}
            </div>
          )}
          {project.featured && (
            <Badge className="absolute top-2 right-2 bg-primary">Vedette</Badge>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
            {project.category && <Badge variant="outline" className="text-xs ml-2 shrink-0">{project.category.name}</Badge>}
          </div>
          <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-3">{project.summary || project.description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techs?.slice(0, 4).map((t) => (
              <Badge key={t.id} variant="secondary" className="text-xs">{t.name}</Badge>
            ))}
            {project.techs?.length > 4 && <Badge variant="secondary" className="text-xs">+{project.techs.length - 4}</Badge>}
          </div>
          <div className="flex gap-2">
            {project.repoUrl && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="mr-1 h-3 w-3" /> Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button size="sm" asChild className="flex-1">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" /> Demo
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
