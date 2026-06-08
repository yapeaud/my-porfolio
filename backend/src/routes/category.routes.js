import { Router } from "express";
import * as ctrl from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", ctrl.getAll);
router.post("/", requireAuth, ctrl.create);
router.put("/:id", requireAuth, ctrl.update);
router.delete("/:id", requireAuth, ctrl.remove);
export default router;
