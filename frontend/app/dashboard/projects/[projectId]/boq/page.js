"use client";

import { use, useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../../../../utils/api";

export default function BOQPage({ params }) {
  const { projectId } = use(params);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [items, setItems] = useState([]);

  // BOQ Form State
  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    description: "",
    quantity: "",
    unit: "",
  });

  // CATEGORY OPTIONS
  const categories = [
    "Wood",
    "Electrical",
    "Plumbing",
    "Paint",
    "Aluminium",
    "Steel",
    "Flooring",
    "Ceiling",
    "Glass",
  ];

  // SUBCATEGORY OPTIONS BY CATEGORY
  const subCategories = {
    Wood: ["Plywood", "MDF", "Timber", "Veneer"],
    Electrical: ["Switches", "Cables", "Lights", "Breakers"],
    Plumbing: ["Pipes", "Valves", "Fittings", "Taps"],
    Paint: ["Wall Paint", "Primer", "Putty"],
    Aluminium: ["Profiles", "Channels", "Cladding"],
    Steel: ["Beams", "Bars", "Sections"],
    Flooring: ["Tiles", "Carpet", "Vinyl", "Wooden Flooring"],
    Ceiling: ["Gypsum Board", "Ceiling Tile", "Grid"],
    Glass: ["Tempered", "Laminated", "Mirror"],
  };

  // Load BOQ items
  const loadItems = () => {
    apiGet(`/boq/${projectId}`, token).then((data) => {
      setItems(Array.isArray(data) ? data : []);
    });
  };

  useEffect(() => {
    if (token && projectId) loadItems();
  }, [token, projectId]);

  // Add BOQ Item
  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiPost(`/boq/${projectId}`, form, token);
    setForm({ category: "", subCategory: "", description: "", quantity: "", unit: "" });
    loadItems();
  };

  // Delete BOQ Item
  const deleteItem = async (id) => {
    await apiDelete(`/boq/item/${id}`, token);
    loadItems();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">BOQ Items</h1>

      {/* ADD BOQ FORM */}
      <div className="bg-white shadow p-5 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Add BOQ Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CATEGORY DROPDOWN */}
          <select
            className="border p-2 w-full rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: "" })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* SUBCATEGORY DROPDOWN */}
          <select
            className="border p-2 w-full rounded"
            value={form.subCategory}
            onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
            required
          >
            <option value="">Select Subcategory</option>
            {form.category &&
              subCategories[form.category]?.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
          </select>

          {/* DESCRIPTION */}
          <input
            type="text"
            placeholder="Description"
            className="border p-2 w-full rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          {/* QUANTITY + UNIT */}
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Quantity"
              className="border p-2 w-full rounded"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Unit (pcs, sqm, etc.)"
              className="border p-2 w-full rounded"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
            />
          </div>

          {/* BUTTON */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Item
          </button>
        </form>
      </div>

      {/* BOQ ITEMS LIST */}
      <div>
        {items.length === 0 ? (
          <p>No BOQ items found.</p>
        ) : (
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="border p-4 rounded bg-gray-100">
                <p><b>Category:</b> {i.category}</p>
                <p><b>Subcategory:</b> {i.subCategory}</p>
                <p><b>Description:</b> {i.description}</p>
                <p><b>Quantity:</b> {i.quantity} {i.unit}</p>

                <button
                  onClick={() => deleteItem(i.id)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
