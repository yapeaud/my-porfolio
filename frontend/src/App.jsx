import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public pages
import HomePage from "@/pages/public/HomePage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetailPage from "@/pages/public/ProjectDetailPage";
import BlogPage from "@/pages/public/BlogPage";
import BlogPostPage from "@/pages/public/BlogPostPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

// Admin pages
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

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return !isAuthenticated ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

      {/* Admin protected */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><AdminLayout><ProfilePage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/skills" element={<ProtectedRoute><AdminLayout><SkillsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/experience" element={<ProtectedRoute><AdminLayout><ExperiencePage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/education" element={<ProtectedRoute><AdminLayout><EducationPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/certifications" element={<ProtectedRoute><AdminLayout><CertificationsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/diplomas" element={<ProtectedRoute><AdminLayout><DiplomasPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedRoute><AdminLayout><TestimonialsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><ProjectsAdminPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminLayout><BlogAdminPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><AdminLayout><CategoriesPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/techs" element={<ProtectedRoute><AdminLayout><TechsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><AdminLayout><MessagesPage /></AdminLayout></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
