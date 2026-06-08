import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import skillRoutes from "./skill.routes.js";
import educationRoutes from "./education.routes.js";
import certificationRoutes from "./certification.routes.js";
import diplomaRoutes from "./diploma.routes.js";
import experienceRoutes from "./experience.routes.js";
import testimonialRoutes from "./testimonial.routes.js";
import projectRoutes from "./project.routes.js";
import blogRoutes from "./blog.routes.js";
import contactRoutes from "./contact.routes.js";
import categoryRoutes from "./category.routes.js";
import techRoutes from "./tech.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/education", educationRoutes);
router.use("/certifications", certificationRoutes);
router.use("/diplomas", diplomaRoutes);
router.use("/experience", experienceRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/projects", projectRoutes);
router.use("/blog", blogRoutes);
router.use("/contact", contactRoutes);
router.use("/categories", categoryRoutes);
router.use("/techs", techRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
