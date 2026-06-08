import { Router } from "express";
import * as ctrl from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImages } from "../middleware/upload.js";

const router = Router();
router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getOne);
router.post("/", requireAuth, uploadImages, ctrl.create);
router.put("/:id", requireAuth, uploadImages, ctrl.update);
router.delete("/:id", requireAuth, ctrl.remove);
router.delete("/:id/images/:imageId", requireAuth, ctrl.removeImage);
export default router;
