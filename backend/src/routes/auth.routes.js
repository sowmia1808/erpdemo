import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", login);

// (Optional) register route
router.post("/register", (req, res) => {
  res.send("Register endpoint");
});

// ✅ TEMPORARY — create admin user in Railway MySQL
router.post("/create-admin", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const newUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "MANAGER",
      },
    });

    res.json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
