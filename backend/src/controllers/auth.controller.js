// src/controllers/auth.controller.js

import { prisma } from "../utils/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/hash.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const valid = comparePassword(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Create JWT token
    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
