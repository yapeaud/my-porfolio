import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCertification, updateCertification } from "@/services/certification.service";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  issuer: z.string().min(1, "Requis"),
  issueDate: z.string().min(1, "Requis"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

export function CertificationForm({ initialData, onSuccess }) {
  const fmtDate = (d) => d ? new Date(d).toISOString().split("T")[0] : "";
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      title: initialData.title || "",
      issuer: initialData.issuer || "",
      issueDate: fmtDate(initialData.issueDate),
      expiryDate: fmtDate(initialData.expiryDate),
      credentialId: initialData.credentialId || "",
      credentialUrl: initialData.credentialUrl || "",
    } : {},
  });

  async function onSubmit(data) {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && v !== "" && fd.append(k, v));
      if (initialData) await updateCertification(initialData.id, fd);
      else await createCertification(fd);
      toast.success(initialData ? "Certification mise à jour." : "Certification ajoutée.");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Titre</Label>
        <Input {...register("title")} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Organisme</Label>
        <Input {...register("issuer")} />
        {errors.issuer && <p className="text-destructive text-xs">{errors.issuer.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Date d'obtention</Label>
          <Input type="date" {...register("issueDate")} />
          {errors.issueDate && <p className="text-destructive text-xs">{errors.issueDate.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Date d'expiration</Label>
          <Input type="date" {...register("expiryDate")} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>ID de certification</Label>
        <Input {...register("credentialId")} />
      </div>
      <div className="space-y-1">
        <Label>URL de vérification</Label>
        <Input type="url" {...register("credentialUrl")} />
        {errors.credentialUrl && <p className="text-destructive text-xs">{errors.credentialUrl.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  );
}
