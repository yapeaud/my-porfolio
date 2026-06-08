import ProfileForm from "@/components/admin/forms/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez les informations de votre portfolio</p>
      </div>
      <ProfileForm />
    </div>
  );
}
