import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", login);

// (Optional) register route
router.post("/register", (req, res) => {
  res.send("Register endpoint");
});

export default router;
