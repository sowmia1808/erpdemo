"use client";

import { useState } from "react";
import { apiPost } from "../../../utils/api";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    client: "",
    location: ""
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiPost("/projects", form, token);

    if (res.project) {
      router.push("/dashboard/projects");
    } else {
      alert("Project creation failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "client", "location"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required={field === "name"}
          />
        ))}

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Save Project
        </button>
      </form>
    </div>
  );
}
