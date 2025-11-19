"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      apiGet("/projects", token).then((data) => {
        setProjects(data);
      });
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <Link
        href="/dashboard/projects/create"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Project
      </Link>

      <div className="mt-6 space-y-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/projects/${p.id}`}
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
