// src/routes/project.routes.js

import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
} from "../controllers/project.controller.js";

import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Create project
router.post("/", authMiddleware, createProject);

// Get all projects
router.get("/", authMiddleware, getProjects);

// Get project by ID
router.get("/:projectId", authMiddleware, getProjectById);

export default router;
