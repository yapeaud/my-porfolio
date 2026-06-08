import { useEffect, useState } from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { getEducation } from "@/services/education.service";

export function EducationSection() {
  const [items, setItems] = useState([]);
  useEffect(() => { getEducation().then(setItems).catch(() => {}); }, []);
  if (!items.length) return null;

  return (
    <SectionWrapper id="education" className="bg-secondary/20">
      <SectionTitle title="Parcours Scolaire" subtitle="Mon chemin vers l'excellence" />
      <div className="max-w-2xl mx-auto">
        {items.map((item, i) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={i}
            dateLabel={`${item.startYear} — ${item.endYear || "Présent"}`}
            title={item.school}
            subtitle={`${item.degree}${item.field ? ` · ${item.field}` : ""}`}
            description={item.description}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
