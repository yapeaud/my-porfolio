import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getProjects } from "@/services/project.service";

export function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects({ featured: true, limit: 6 }).then((r) => setProjects(r.data || [])).catch(() => {});
  }, []);

  if (!projects.length) return null;

  return (
    <SectionWrapper id="projects">
      <SectionTitle title="Mes Projets" subtitle="Une sélection de mes réalisations" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
      </div>
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link to="/projects">
            Voir tous mes projets <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
