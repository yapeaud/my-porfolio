import { Router } from "express";
import * as ctrl from "../controllers/education.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", requireAuth, uploadImage, ctrl.create);
router.put("/:id", requireAuth, uploadImage, ctrl.update);
router.delete("/:id", requireAuth, ctrl.remove);
export default router;
