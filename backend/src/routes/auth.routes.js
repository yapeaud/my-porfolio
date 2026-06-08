import { Router } from "express";
import { login, refresh, logout, me, changePassword } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.put("/change-password", requireAuth, changePassword);

export default router;
