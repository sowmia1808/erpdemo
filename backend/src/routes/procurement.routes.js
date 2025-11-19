import { Router } from "express";
import {
  getApprovedMRs,
  addSupplierQuotes,
  addAllSupplierQuotes,
  getQuotesForMR
} from "../controllers/procurement.controller.js";

import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = Router();

// 1️⃣ Get all APPROVED MRs → Procurement Dashboard
router.get(
  "/approved",
  authMiddleware,
  authorizeRoles("PROCUREMENT"),
  getApprovedMRs
);

// 2️⃣ Add 3 supplier quotes for ONE ITEM
router.post(
  "/quotes",
  authMiddleware,
  authorizeRoles("PROCUREMENT"),
  addSupplierQuotes
);

// 3️⃣ Add 3 supplier quotes for ALL ITEMS of an MR
router.post(
  "/quotes/all",
  authMiddleware,
  authorizeRoles("PROCUREMENT"),
  addAllSupplierQuotes
);

// 4️⃣ Get all MR items + quotes for a specific MR
router.get(
  "/quotes/:mrId",
  authMiddleware,
  authorizeRoles("PROCUREMENT", "MANAGER"),
  getQuotesForMR
);

export default router;
