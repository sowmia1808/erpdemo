"use client";

import { useState } from "react";
import { apiPost } from "../../../../../../../utils/api";
import { useRouter } from "next/navigation";

export default function CreateMR({ params }) {
  const { projectId, boqItemId } = params;
  const router = useRouter();

  const [quantity, setQuantity] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiPost(
      "/mr",
      {
        boqItemId: Number(boqItemId),
        quantity: Number(quantity),
      },
      token
    );

    if (res.message === "MR created") {
      router.push(`/dashboard/projects/${projectId}/boq`);
    } else {
      alert("MR creation failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Material Requisition</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Submit MR
        </button>
      </form>
    </div>
  );
}
