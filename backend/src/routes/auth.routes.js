// backend/src/routes/auth.routes.js

import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";

const router = Router();

// LOGIN
router.post("/login", login);

// ⭐ TEMP ROUTE — CREATE DEFAULT USERS
router.get("/create-default-users", async (req, res) => {
  try {
    const defaultUsers = [
      {
        name: "Normal User",
        email: "user@gmail.com",
        role: "USER",
        password: "user123"
      },
      {
        name: "Procurement User",
        email: "procurement@gmail.com",
        role: "PROCUREMENT",
        password: "proc123"
      },
      {
        name: "Admin Manager",
        email: "admin@gmail.com",
        role: "MANAGER",
        password: "admin123"
      }
    ];

    const created = [];

    for (const u of defaultUsers) {
      const hashedPassword = await bcrypt.hash(u.password, 10);

      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          name: u.name,
          email: u.email,
          role: u.role,
          password: hashedPassword
        },
      });

      created.push({ email: user.email, role: user.role });
    }

    res.json({
      message: "Default users created/updated",
      created
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
