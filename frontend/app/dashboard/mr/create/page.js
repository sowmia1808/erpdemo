"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../../utils/api";
import { useRouter } from "next/navigation";

export default function CreateMR() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [boqItems, setBoqItems] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // MULTIPLE ITEMS
  const [remarks, setRemarks] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  // 🚫 Manager cannot create MR
  if (typeof window !== "undefined" && userRole === "MANAGER") {
    return <p className="p-6 text-red-600 font-bold">Managers cannot create MR.</p>;
  }

  // Fetch projects
  useEffect(() => {
    if (token) {
      apiGet("/projects", token).then((data) => setProjects(data || []));
    }
  }, [token]);

  // Fetch BOQ items for selected project
  useEffect(() => {
    if (selectedProject && token) {
      apiGet(`/boq/${selectedProject}`, token).then((data) => {
        setBoqItems(data || []);
        setSelectedItems([]); // reset when project changes
      });
    }
  }, [selectedProject, token]);

  // ➕ Add BOQ item to MR list
  const addBOQItem = (boqItemId) => {
    if (!boqItemId) return;

    const existing = selectedItems.find((i) => i.boqItemId === Number(boqItemId));
    if (existing) {
      alert("Item already selected");
      return;
    }

    const boq = boqItems.find((i) => i.id === Number(boqItemId));

    setSelectedItems([
      ...selectedItems,
      {
        boqItemId: boq.id,
        boq,
        quantity: "",
      },
    ]);
  };

  // Update quantity with validation
  const updateQuantity = (index, qty) => {
    const updated = [...selectedItems];
    const max = updated[index].boq.quantity;

    if (Number(qty) > max) {
      alert(`Cannot request more than BOQ quantity (${max})`);
      updated[index].quantity = max;
    } else {
      updated[index].quantity = qty;
    }

    setSelectedItems(updated);
  };

  // Remove an item
  const removeItem = (index) => {
    const updated = [...selectedItems];
    updated.splice(index, 1);
    setSelectedItems(updated);
  };

  // Submit MR (MULTIPLE ITEMS)
  const submitMR = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert("Add at least 1 BOQ item");
      return;
    }

    // Validate quantities
    for (let item of selectedItems) {
      if (!item.quantity || Number(item.quantity) <= 0) {
        alert("Enter valid quantity for all items");
        return;
      }
    }

    const res = await apiPost(
      "/mr",
      {
        items: selectedItems.map((i) => ({
          boqItemId: i.boqItemId,
          quantity: Number(i.quantity),
        })),
        remarks,
      },
      token
    );

    if (res.error) {
      alert(res.error);
    } else {
      alert("MR Created Successfully!");
      router.push("/dashboard/mr/my");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Material Requisition</h1>

      <form onSubmit={submitMR} className="space-y-6">

        {/* Project Selection */}
        <div>
          <label className="block mb-1 font-semibold">Select Project</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Choose Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* BOQ Select Menu */}
        {selectedProject && (
          <div>
            <label className="block mb-1 font-semibold">Add BOQ Item</label>
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => addBOQItem(e.target.value)}
            >
              <option value="">-- Select BOQ Item --</option>

              {Object.entries(
                boqItems.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {})
              ).map(([category, items]) => (
                <optgroup key={category} label={category.toUpperCase()}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subCategory} → {item.description} (Available: {item.quantity})
                    </option>
                  ))}
                </optgroup>
              ))}

            </select>
          </div>
        )}

        {/* Selected BOQ Items List */}
        <div className="space-y-3">
          {selectedItems.map((item, index) => (
            <div key={index} className="p-3 border rounded bg-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <b>{item.boq.category}</b> → {item.boq.description}
                  <div className="text-sm text-gray-600">
                    BOQ Available: {item.boq.quantity}
                  </div>
                </div>

                <button
                  type="button"
                  className="text-red-600 font-bold"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>

              <input
                type="number"
                className="border p-2 mt-2 w-40"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateQuantity(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Remarks */}
        <div>
          <label className="block mb-1 font-semibold">Remarks</label>
          <textarea
            className="w-full border p-2 rounded"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Submit MR
        </button>
      </form>
    </div>
  );
}
