"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../../utils/api";
import { useParams, useRouter } from "next/navigation";

export default function MRQuoteEntryPage() {
  const { mrId } = useParams();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (token && mrId) {
      apiGet(`/procurement/quotes/${mrId}`, token).then((data) => {
        setItems(data);

        // initialize formData only for items (still needed for first-time entry)
        const init = {};
        data.forEach((item) => {
          init[item.id] = [
            { supplier: "", price: "" },
            { supplier: "", price: "" },
            { supplier: "", price: "" },
          ];
        });

        setFormData(init);
      });
    }
  }, [token, mrId]);

  const handleChange = (itemId, index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[itemId][index][field] = value;
      return updated;
    });
  };

  // Validate we filled all 3 suppliers + prices
  const validateQuotes = () => {
    for (const itemId in formData) {
      const quotes = formData[itemId];
      if (!quotes) continue;

      for (let i = 0; i < 3; i++) {
        const q = quotes[i];
        if (!q.supplier || !q.supplier.trim()) {
          alert(`Supplier ${i + 1} is required for item ${itemId}`);
          return false;
        }
        if (!q.price || Number(q.price) <= 0) {
          alert(`Price ${i + 1} is required for item ${itemId}`);
          return false;
        }
      }
    }
    return true;
  };

  // 🔥 SAVE ALL ITEMS AT ONCE — but only if not already quoted
  const saveAllQuotes = async () => {
    // 1️⃣ Check if this MR already has any supplier quotes
    const alreadyQuotedItems = items.filter(
      (item) => item.supplierQuotes && item.supplierQuotes.length > 0
    );

    if (alreadyQuotedItems.length > 0) {
      alert("Quotes are already added for this MR. You cannot save again.");
      return;
    }

    // 2️⃣ Validate the form inputs
    if (!validateQuotes()) return;

    setSaving(true);

    const payload = {
      mrId,
      items: Object.keys(formData).map((itemId) => ({
        itemId: Number(itemId),
        quotes: formData[itemId],
      })),
    };

    try {
      await apiPost("/procurement/quotes/all", payload, token);
      alert("All quotes saved!");
      // ✅ Redirect to Procurement Quotes list
      router.push("/dashboard/procurement/quotes");
    } catch (err) {
      console.error("Error saving quotes:", err);
      alert("Something went wrong while saving quotes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Supplier Quotes for MR #{mrId}
      </h1>

      {items.map((item) => {
        const hasQuotes =
          item.supplierQuotes && item.supplierQuotes.length > 0;

        return (
          <div key={item.id} className="border p-4 rounded mb-6">
            <h2 className="text-xl font-bold">
              {item.boqItem?.category} – {item.boqItem?.description}
            </h2>
            <p className="mb-2">
              <b>Project:</b> {item.boqItem?.project?.name}
            </p>
            <p className="mb-4">
              <b>Qty:</b> {item.quantity}
            </p>

            {hasQuotes && (
              <p className="text-sm text-red-600 font-semibold mb-2">
                Quotes already added for this item. (Read-only)
              </p>
            )}

            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Supplier</th>
                  <th className="border p-2">Price</th>
                </tr>
              </thead>

              <tbody>
                {[0, 1, 2].map((i) => (
                  <tr key={i}>
                    <td className="border p-2">
                      <input
                        className="border p-2 w-full bg-white disabled:bg-gray-200"
                        disabled={hasQuotes}
                        value={formData[item.id]?.[i]?.supplier || ""}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            i,
                            "supplier",
                            e.target.value
                          )
                        }
                        placeholder={`Supplier ${i + 1}`}
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        className="border p-2 w-full bg-white disabled:bg-gray-200"
                        type="number"
                        disabled={hasQuotes}
                        value={formData[item.id]?.[i]?.price || ""}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            i,
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="Price"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Existing quotes table (optional, to show what was saved earlier) */}
            {hasQuotes && (
              <div className="mt-2">
                <h3 className="font-semibold mb-1">Saved Quotes:</h3>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Supplier</th>
                      <th className="border p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.supplierQuotes.map((q) => (
                      <tr key={q.id}>
                        <td className="border p-2">{q.supplier}</td>
                        <td className="border p-2">{q.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      <button
        className={`px-5 py-3 rounded text-white ${
          saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={saving}
        onClick={saveAllQuotes}
      >
        {saving ? "Saving..." : "Save Quotes for ALL Items"}
      </button>
    </div>
  );
}
