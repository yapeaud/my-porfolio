import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/services/profile.service";
import { UPLOADS_BASE } from "@/lib/constants";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";

export function HeroSection() {
  const [profile, setProfile] = useState(null);

  useEffect(() => { getProfile().then(setProfile).catch(() => {}); }, []);

  const photo = profile?.photoUrl
    ? (profile.photoUrl.startsWith("http") ? profile.photoUrl : `${UPLOADS_BASE}${profile.photoUrl}`)
    : "/Me.jpeg";

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="min-h-screen flex items-center pt-16 px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto w-full py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <motion.p
              className="text-primary font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bonjour, je suis
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {profile?.name || "Abednego Yapeaud"}
            </motion.h1>
            <motion.h2
              className="text-xl md:text-2xl text-primary font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {profile?.title || "Développeur Full Stack"}
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {profile?.bio || "Passionné par le développement web moderne, je crée des applications performantes et des expériences utilisateurs exceptionnelles."}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {profile?.cvUrl && (
                <Button asChild size="lg">
                  <a href={`${UPLOADS_BASE}${profile.cvUrl}`} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" /> Télécharger CV
                  </a>
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => scrollTo("contact")}>
                <Mail className="mr-2 h-4 w-4" /> Me contacter
              </Button>
              <Button variant="ghost" size="lg" onClick={() => scrollTo("projects")}>
                <FolderKanban className="mr-2 h-4 w-4" /> Mes projets
              </Button>
            </motion.div>
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <GithubIcon className="h-6 w-6" />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <LinkedinIcon className="h-6 w-6" />
                </a>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img src={photo} alt={profile?.name || "Profile"} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
