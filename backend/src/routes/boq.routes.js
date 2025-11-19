import { Router } from "express";
import {
  addBOQItem,
  getBOQByProject,
  deleteBOQItem,
  getAllBOQs,
} from "../controllers/boq.controller.js";

import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Add BOQ Item to project
router.post("/:projectId", authMiddleware, addBOQItem);

// 🔥 IMPORTANT: GET ALL BOQs FIRST
router.get("/all", authMiddleware, getAllBOQs);

// Then: Get BOQ items for a project
router.get("/:projectId", authMiddleware, getBOQByProject);

// Delete BOQ item
router.delete("/item/:id", authMiddleware, deleteBOQItem);

export default router;
