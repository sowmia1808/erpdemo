import { prisma } from "../utils/prisma.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, client, location } = req.body;

    // Create project in database
    const project = await prisma.project.create({
      data: {
        name,
        description,
        client,
        location
      },
    });

    return res.json({
      message: "Project created",
      project,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: { boqItems: true },
    });

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
