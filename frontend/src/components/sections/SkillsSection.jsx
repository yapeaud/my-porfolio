import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getSkills } from "@/services/skill.service";
import { SKILL_CATEGORIES } from "@/lib/constants";

function SkillBar({ skill, index }) {
  const [ref, visible] = useIntersectionObserver();
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: visible ? `${skill.level}%` : 0 }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const [skills, setSkills] = useState([]);
  useEffect(() => { getSkills().then(setSkills).catch(() => {}); }, []);

  const grouped = SKILL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});
  const presentCats = SKILL_CATEGORIES.filter((c) => grouped[c]?.length > 0);

  if (!skills.length) return null;

  return (
    <SectionWrapper id="skills">
      <SectionTitle title="Mes Compétences" subtitle="Technologies et outils que je maîtrise" />
      <Tabs defaultValue={presentCats[0] || "Frontend"} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-transparent justify-center">
          {presentCats.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {presentCats.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {grouped[cat].map((skill, i) => (
                <SkillBar key={skill.id} skill={skill} index={i} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionWrapper>
  );
}
