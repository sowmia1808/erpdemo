import { prisma } from "../utils/prisma.js";

// Create MR with MULTIPLE ITEMS
export const createMR = async (req, res) => {
  try {
    const { items, remarks } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "At least one item required" });
    }

    // Step 1: Create MR
    const mr = await prisma.materialRequisition.create({
      data: {
        requestedBy: req.user.id,
        remarks,
        status: "PENDING",
      },
    });

    // Step 2: Insert multiple MR items
    const mrItemsData = items.map((item) => ({
      mrId: mr.id,
      boqItemId: item.boqItemId,
      quantity: item.quantity,
    }));

    await prisma.mRItem.createMany({
      data: mrItemsData,
    });

    res.json({ message: "MR created successfully", mrId: mr.id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};



// List all MRs (MANAGER + PROCUREMENT)
export const listMR = async (req, res) => {
  try {
    const mrList = await prisma.materialRequisition.findMany({
      include: {
        requestedByUser: true,
        items: {   // ✅ FIXED
          include: {
            boqItem: {
              include: {
                project: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(mrList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// List MY MRs (USER)
export const listMyMR = async (req, res) => {
  try {
    const mrList = await prisma.materialRequisition.findMany({
      where: { requestedBy: req.user.id },
      include: {
        items: {   // ✅ FIXED
          include: {
            boqItem: {
              include: {
                project: true,
              },
            },
          },
        },
        requestedByUser: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(mrList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Manager APPROVE MR
export const approveMR = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerRemarks } = req.body;

    const mr = await prisma.materialRequisition.update({
      where: { id: Number(id) },
      data: {
        status: "APPROVED",
        managerRemarks: managerRemarks || null,
      },
    });

    res.json({ message: "MR approved", mr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Manager REJECT MR
export const rejectMR = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerRemarks } = req.body;

    if (!managerRemarks) {
      return res.status(400).json({ message: "Remarks are required for rejection" });
    }

    const mr = await prisma.materialRequisition.update({
      where: { id: Number(id) },
      data: {
        status: "REJECTED",
        managerRemarks,
      },
    });

    res.json({ message: "MR rejected", mr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMRWithQuotes = async (req, res) => {
  try {
    const { id } = req.params;

    const mr = await prisma.materialRequisition.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            boqItem: { include: { project: true } },
            supplierQuotes: true,   // 🔥 IMPORTANT
          },
        },
      },
    });

    res.json(mr);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

