import { useEffect, useState } from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { getExperiences } from "@/services/experience.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function ExperienceSection() {
  const [items, setItems] = useState([]);
  useEffect(() => { getExperiences().then(setItems).catch(() => {}); }, []);
  if (!items.length) return null;

  const fmt = (d) => format(new Date(d), "MMM yyyy", { locale: fr });

  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Expériences Professionnelles" subtitle="Mon parcours en entreprise" />
      <div className="max-w-2xl mx-auto">
        {items.map((item, i) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={i}
            dateLabel={`${fmt(item.startDate)} — ${item.endDate ? fmt(item.endDate) : "Présent"}`}
            title={item.company}
            subtitle={`${item.position}${item.location ? ` · ${item.location}` : ""}`}
            description={item.description}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
