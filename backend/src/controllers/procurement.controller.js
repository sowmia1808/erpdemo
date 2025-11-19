import { prisma } from "../utils/prisma.js";

// 1️⃣ Fetch all approved MRs
export const getApprovedMRs = async (req, res) => {
  try {
    const mrs = await prisma.materialRequisition.findMany({
      where: { status: "APPROVED" },
      include: {
        items: {
          include: {
            boqItem: { include: { project: true } },
            supplierQuotes: true,   // 🔥 MUST ADD THIS LINE
          },
        },
        requestedByUser: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(mrs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2️⃣ Add quotes for a single item
export const addSupplierQuotes = async (req, res) => {
  try {
    const { mrId, itemId, quotes } = req.body;

    // Check if quotes already exist
    const existing = await prisma.supplierQuote.count({
      where: { mrId: Number(mrId), itemId: Number(itemId) }
    });

    if (existing > 0) {
      return res.status(400).json({
        message: "Quotes already added for this item"
      });
    }

    await prisma.supplierQuote.createMany({
      data: quotes.map(q => ({
        mrId: Number(mrId),
        itemId: Number(itemId),
        supplier: q.supplier,
        price: Number(q.price)
      }))
    });

    res.json({ message: "Supplier quotes added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 3️⃣ Add quotes for ALL items at once (missing earlier)
export const addAllSupplierQuotes = async (req, res) => {
  try {
    const { mrId, items } = req.body;

    for (const item of items) {

      // Check if quotes already exist for this item
      const existing = await prisma.supplierQuote.count({
        where: {
          mrId: Number(mrId),
          itemId: Number(item.itemId),
        }
      });

      if (existing > 0) {
        return res.status(400).json({
          message: `Quotes already added for item ID ${item.itemId}`,
        });
      }

      await prisma.supplierQuote.createMany({
        data: item.quotes.map((q) => ({
          mrId: Number(mrId),
          itemId: Number(item.itemId),
          supplier: q.supplier,
          price: Number(q.price),
        })),
      });
    }

    res.json({ message: "All quotes saved successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 4️⃣ Get quotes for all items of MR
export const getQuotesForMR = async (req, res) => {
  try {
    const { mrId } = req.params;

    const items = await prisma.mRItem.findMany({
      where: { mrId: Number(mrId) },
      include: {
        boqItem: true,
        supplierQuotes: true
      }
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
