import { Router } from "express";
import { submit, getAll, getOne, toggleRead, remove } from "../controllers/contact.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/", submit);
router.get("/messages", requireAuth, getAll);
router.get("/messages/:id", requireAuth, getOne);
router.patch("/messages/:id/read", requireAuth, toggleRead);
router.delete("/messages/:id", requireAuth, remove);
export default router;
