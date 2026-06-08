import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContact } from "@/services/contact.service";
import { useEffect, useState } from "react";
import { getProfile } from "@/services/profile.service";

const schema = z.object({
  name: z.string().min(2, "Le nom est requis (min 2 caractères)"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(3, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export function ContactSection() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { getProfile().then(setProfile).catch(() => {}); }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      await submitContact(data);
      toast.success("Message envoyé ! Je vous répondrai dans les plus brefs délais.");
      reset();
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  }

  return (
    <SectionWrapper id="contact" className="bg-secondary/20">
      <SectionTitle title="Me Contacter" subtitle="Vous avez un projet ? Parlons-en !" />
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-muted-foreground">Je suis toujours ouvert à de nouvelles opportunités et collaborations. N'hésitez pas à me contacter !</p>
          {profile?.email && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors text-sm">{profile.email}</a>
              </div>
            </div>
          )}
          {profile?.location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Localisation</p>
                <p className="text-sm">{profile.location}</p>
              </div>
            </div>
          )}
          {profile?.phone && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="text-sm">{profile.phone}</p>
              </div>
            </div>
          )}
        </motion.div>
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" placeholder="Votre nom" {...register("name")} />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" {...register("email")} />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" placeholder="Objet de votre message" {...register("subject")} />
            {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Votre message..." rows={5} {...register("message")} />
            {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? "Envoi en cours..." : <><Send className="mr-2 h-4 w-4" /> Envoyer le message</>}
          </Button>
        </motion.form>
      </div>
    </SectionWrapper>
  );
}
