"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";
import Link from "next/link";

export default function ProcurementDashboard() {
  const [mrs, setMrs] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      apiGet("/procurement/approved", token).then((data) => {
        setMrs(Array.isArray(data) ? data : []);
      });
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Approved MRs for Procurement</h1>

      {mrs.length === 0 ? (
        <p>No approved MRs available.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">MR ID</th>
              <th className="p-2 border">Project</th>
              <th className="p-2 border">Requested By</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {mrs.map((mr) => (
              <tr key={mr.id}>
                <td className="p-2 border">{mr.id}</td>

                <td className="p-2 border">
                  {mr.items[0]?.boqItem?.project?.name}
                </td>

                <td className="p-2 border">{mr.requestedByUser?.name}</td>

                <td className="p-2 border">
                  {new Date(mr.createdAt).toLocaleString()}
                </td>

                <td className="p-2 border">
                  <Link
                    href={`/dashboard/procurement/${mr.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Add Supplier Quotes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
