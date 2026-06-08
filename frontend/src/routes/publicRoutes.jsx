import { Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetailPage from "@/pages/public/ProjectDetailPage";
import BlogPage from "@/pages/public/BlogPage";
import BlogPostPage from "@/pages/public/BlogPostPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

export function publicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </>
  );
}
