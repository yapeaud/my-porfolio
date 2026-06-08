import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { getProfile } from "@/services/profile.service";

export function AboutSection() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { getProfile().then(setProfile).catch(() => {}); }, []);

  const stats = [
    { value: profile?.yearsOfExp || 0, suffix: "+", label: "Années d'expérience" },
    { value: profile?.projectsCount || 0, suffix: "+", label: "Projets réalisés" },
  ];

  return (
    <SectionWrapper id="about" className="bg-secondary/20">
      <SectionTitle title="À propos de moi" subtitle="Découvrez mon parcours et ce qui me passionne" />
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            {profile?.bio || "Passionné par le développement web moderne."}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {profile?.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile?.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">{profile.email}</a>
            </div>
          )}
          {profile?.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile?.websiteUrl && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{profile.websiteUrl}</a>
            </div>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
