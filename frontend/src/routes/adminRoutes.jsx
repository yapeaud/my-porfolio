import { Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute, GuestRoute } from "./guards";
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProfilePage from "@/pages/admin/ProfilePage";
import SkillsPage from "@/pages/admin/SkillsPage";
import ExperiencePage from "@/pages/admin/ExperiencePage";
import EducationPage from "@/pages/admin/EducationPage";
import CertificationsPage from "@/pages/admin/CertificationsPage";
import DiplomasPage from "@/pages/admin/DiplomasPage";
import TestimonialsPage from "@/pages/admin/TestimonialsPage";
import ProjectsAdminPage from "@/pages/admin/ProjectsAdminPage";
import BlogAdminPage from "@/pages/admin/BlogAdminPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import TechsPage from "@/pages/admin/TechsPage";
import MessagesPage from "@/pages/admin/MessagesPage";

function Admin({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

export function adminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/admin" element={<Admin><DashboardPage /></Admin>} />
      <Route path="/admin/profile" element={<Admin><ProfilePage /></Admin>} />
      <Route path="/admin/skills" element={<Admin><SkillsPage /></Admin>} />
      <Route path="/admin/experience" element={<Admin><ExperiencePage /></Admin>} />
      <Route path="/admin/education" element={<Admin><EducationPage /></Admin>} />
      <Route path="/admin/certifications" element={<Admin><CertificationsPage /></Admin>} />
      <Route path="/admin/diplomas" element={<Admin><DiplomasPage /></Admin>} />
      <Route path="/admin/testimonials" element={<Admin><TestimonialsPage /></Admin>} />
      <Route path="/admin/projects" element={<Admin><ProjectsAdminPage /></Admin>} />
      <Route path="/admin/blog" element={<Admin><BlogAdminPage /></Admin>} />
      <Route path="/admin/categories" element={<Admin><CategoriesPage /></Admin>} />
      <Route path="/admin/techs" element={<Admin><TechsPage /></Admin>} />
      <Route path="/admin/messages" element={<Admin><MessagesPage /></Admin>} />
    </>
  );
}
