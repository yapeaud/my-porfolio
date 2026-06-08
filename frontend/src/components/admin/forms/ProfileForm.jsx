import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getProfile, updateProfile, uploadCv } from "@/services/profile.service";
import { UPLOADS_BASE } from "@/lib/constants";

const schema = z.object({
  name: z.string().min(1, "Requis"),
  title: z.string().min(1, "Requis"),
  bio: z.string().min(1, "Requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  location: z.string().optional(),
  githubUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  twitterUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  websiteUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  yearsOfExp: z.coerce.number().min(0).optional(),
  projectsCount: z.coerce.number().min(0).optional(),
});

export default function ProfileForm() {
  const [photoFile, setPhotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    getProfile().then((p) => { setProfile(p); reset(p); }).catch(() => {});
  }, [reset]);

  async function onSubmit(data) {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && v !== "" && fd.append(k, v.toString()));
      if (photoFile) fd.append("image", photoFile);
      await updateProfile(fd);
      if (cvFile) { await uploadCv(cvFile); }
      toast.success("Profil mis à jour avec succès.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  }

  const photoSrc = profile?.photoUrl ? (profile.photoUrl.startsWith("http") ? profile.photoUrl : `${UPLOADS_BASE}${profile.photoUrl}`) : "/Me.jpeg";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-6 mb-6">
        <img src={photoSrc} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
        <div className="space-y-1">
          <Label>Photo de profil</Label>
          <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Nom complet</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Titre professionnel</Label>
          <Input {...register("title")} />
          {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
        </div>
      </div>
      <div className="space-y-1">
        <Label>Biographie</Label>
        <Textarea rows={4} {...register("bio")} />
        {errors.bio && <p className="text-destructive text-xs">{errors.bio.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Email de contact</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Téléphone</Label>
          <Input {...register("phone")} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Localisation</Label>
          <Input {...register("location")} />
        </div>
        <div className="space-y-1">
          <Label>Site web personnel</Label>
          <Input type="url" {...register("websiteUrl")} />
          {errors.websiteUrl && <p className="text-destructive text-xs">{errors.websiteUrl.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>GitHub URL</Label>
          <Input type="url" {...register("githubUrl")} />
          {errors.githubUrl && <p className="text-destructive text-xs">{errors.githubUrl.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>LinkedIn URL</Label>
          <Input type="url" {...register("linkedinUrl")} />
          {errors.linkedinUrl && <p className="text-destructive text-xs">{errors.linkedinUrl.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Années d'expérience</Label>
          <Input type="number" {...register("yearsOfExp")} />
        </div>
        <div className="space-y-1">
          <Label>Nombre de projets</Label>
          <Input type="number" {...register("projectsCount")} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>CV (PDF)</Label>
        <Input type="file" accept="application/pdf" onChange={(e) => setCvFile(e.target.files[0])} />
        {profile?.cvUrl && <p className="text-xs text-muted-foreground">CV actuel: <a href={`${UPLOADS_BASE}${profile.cvUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">Voir le CV</a></p>}
      </div>
      <Button type="submit" disabled={isSubmitting || loading} size="lg">
        {isSubmitting ? "Enregistrement..." : "Sauvegarder le profil"}
      </Button>
    </form>
  );
}
