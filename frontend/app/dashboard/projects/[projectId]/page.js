"use client";

import { useEffect, useState, use } from "react";
import { apiGet } from "../../../utils/api";
import Link from "next/link";

export default function ProjectDetails({ params }) {
  const { projectId } = use(params);  // ← FIXED

  const [project, setProject] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token && projectId) {
      apiGet(`/projects/${projectId}`, token).then((data) => setProject(data));
    }
  }, [token, projectId]); // ← also include projectId

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>

      <div className="mt-6">
        <Link
          href={`/dashboard/projects/${projectId}/boq`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View BOQ Items
        </Link>
      </div>
    </div>
  );
}
