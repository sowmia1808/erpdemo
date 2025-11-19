import { prisma } from "../utils/prisma.js";

export const addBOQItem = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { category, subCategory, description, quantity, unit } = req.body;

    const boq = await prisma.bOQItem.create({
      data: {
        category,
        subCategory,
        description,
        quantity: Number(quantity),
        unit,
        projectId: Number(projectId)
      },
    });

    return res.json({
      message: "BOQ item added",
      boq,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getBOQByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const boq = await prisma.bOQItem.findMany({
      where: { projectId: Number(projectId) },
      include: {
        project: {          // 🔥 NOW PROJECT NAME IS INCLUDED
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json(boq);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
  

export const deleteBOQItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bOQItem.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "BOQ item deleted" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllBOQs = async (req, res) => {
  try {
    const boq = await prisma.bOQItem.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        projectId: "asc",
      },
    });

    return res.json(boq);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

