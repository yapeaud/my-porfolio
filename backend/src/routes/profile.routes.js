import { Router } from "express";
import { getProfile, updateProfile, uploadCv } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage, uploadDocument } from "../middleware/upload.js";

const router = Router();

router.get("/", getProfile);
router.put("/", requireAuth, uploadImage, updateProfile);
router.put("/cv", requireAuth, uploadDocument, uploadCv);

export default router;
