import { Router } from "express";
import {
  createMR,
  listMR,
  approveMR,
  rejectMR,     
  listMyMR,
} from "../controllers/mr.controller.js";

import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = Router();

// Create MR – only USER & PROCUREMENT
router.post(
  "/",
  authMiddleware,
  authorizeRoles("USER", "PROCUREMENT"),
  createMR
);

// USER + PROCUREMENT → View only their own MRs
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("USER", "PROCUREMENT"),
  listMyMR
);

// List all MR – MANAGER or PROCUREMENT only
router.get(
  "/",
  authMiddleware,
  authorizeRoles("MANAGER", "PROCUREMENT"),
  listMR
);



// Manager approves MR
router.put(
  "/approve/:id",
  authMiddleware,
  authorizeRoles("MANAGER"),
  approveMR
);

// Manager rejects MR
router.put(
  "/reject/:id",
  authMiddleware,
  authorizeRoles("MANAGER"),
  rejectMR
);

export default router;
