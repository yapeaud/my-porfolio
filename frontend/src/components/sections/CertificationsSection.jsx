import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Calendar } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCertifications } from "@/services/certification.service";
import { getDiplomas } from "@/services/diploma.service";
import { UPLOADS_BASE } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function CertCard({ item, index }) {
  const img = item.imageUrl ? (item.imageUrl.startsWith("http") ? item.imageUrl : `${UPLOADS_BASE}${item.imageUrl}`) : null;
  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex gap-4">
          {img ? (
            <img src={img} alt={item.title} className="w-14 h-14 object-contain rounded shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded bg-primary/10 flex items-center justify-center text-primary text-2xl shrink-0">🏆</div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
            <p className="text-muted-foreground text-xs mb-2">{item.issuer || item.institution}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.issueDate || `${item.year}-01-01`), "MMM yyyy", { locale: fr })}
              </span>
              {isExpired && <Badge variant="secondary" className="text-xs py-0">Expiré</Badge>}
              {item.credentialUrl && (
                <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> Vérifier
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CertificationsSection() {
  const [certs, setCerts] = useState([]);
  const [diplomas, setDiplomas] = useState([]);
  useEffect(() => {
    getCertifications().then(setCerts).catch(() => {});
    getDiplomas().then(setDiplomas).catch(() => {});
  }, []);

  if (!certs.length && !diplomas.length) return null;

  return (
    <SectionWrapper id="certifications" className="bg-secondary/20">
      {certs.length > 0 && (
        <>
          <SectionTitle title="Certifications" subtitle="Mes accréditations professionnelles" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {certs.map((c, i) => <CertCard key={c.id} item={{ ...c, issueDate: c.issueDate }} index={i} />)}
          </div>
        </>
      )}
      {diplomas.length > 0 && (
        <>
          <SectionTitle title="Diplômes" subtitle="Mes titres académiques" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diplomas.map((d, i) => <CertCard key={d.id} item={{ ...d, issueDate: `${d.year}-01-01`, issuer: d.institution }} index={i} />)}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
