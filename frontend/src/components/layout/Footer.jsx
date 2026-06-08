import { Mail, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile } from "@/services/profile.service";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/SocialIcons";

export function Footer() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { getProfile().then(setProfile).catch(() => {}); }, []);

  const socials = [
    { icon: GithubIcon, href: profile?.githubUrl, label: "GitHub" },
    { icon: LinkedinIcon, href: profile?.linkedinUrl, label: "LinkedIn" },
    { icon: TwitterIcon, href: profile?.twitterUrl, label: "Twitter" },
    { icon: Mail, href: profile ? `mailto:${profile.email}` : null, label: "Email" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-secondary/30 border-t py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Code2 className="h-5 w-5" />
          <span>{profile?.name || "Portfolio"}</span>
        </div>
        <div className="flex gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={label}>
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile?.name || "Portfolio"}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
