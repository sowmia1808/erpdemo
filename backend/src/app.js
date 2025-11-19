// src/app.js

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import boqRoutes from "./routes/boq.routes.js";
import mrRoutes from "./routes/mr.routes.js";
import procurementRoutes from "./routes/procurement.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ⭐ DEBUG MIDDLEWARE — MUST COME BEFORE ROUTES
app.use((req, res, next) => {
  console.log("🔵 BODY RECEIVED:", req.body);
  next();
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Ray Fitout API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/boq", boqRoutes);
app.use("/api/mr", mrRoutes);
app.use("/api/procurement", procurementRoutes);

export default app;
