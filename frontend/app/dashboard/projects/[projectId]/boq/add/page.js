"use client";

import { use } from "react";
import { useState } from "react";
import { apiPost } from "../../../../../utils/api";
import { useRouter } from "next/navigation";

export default function AddBOQItem({ params }) {
  const { projectId } = use(params); // ✅ FIXED HERE
  const router = useRouter();

  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    description: "",
    quantity: "",
    unit: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiPost(
      `/boq/${projectId}`, // ✅ FIXED URL
      {
        ...form,
        quantity: Number(form.quantity),
      },
      token
    );

    if (res.boq) {
      router.push(`/dashboard/projects/${projectId}/boq`);
    } else {
      alert("Failed to add BOQ item");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add BOQ Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["category", "subCategory", "description", "unit"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        ))}

        <input
          type="number"
          placeholder="quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save BOQ Item
        </button>
      </form>
    </div>
  );
}
