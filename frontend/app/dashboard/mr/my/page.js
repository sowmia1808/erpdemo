"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../../utils/api";

export default function MyMRPage() {
  const [mrs, setMrs] = useState([]);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token + role
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Fetch MR list
  useEffect(() => {
    if (token) {
      apiGet("/mr/my", token).then((data) => {
        setMrs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    }
  }, [token]);

  if (loading || !role) {
    return <p className="p-6">Loading...</p>;
  }

  // Only Employees allowed
  if (role !== "USER") {
    return (
      <p className="p-6 text-red-600 font-bold">
        Only employees can view this page.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Material Requisitions</h1>

      {mrs.length === 0 ? (
        <p>You have not created any MR yet.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">MR ID</th>
              <th className="p-2 border">Project</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Manager Remarks</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>

          <tbody>
  {mrs.map((mr) => (
    <tr key={mr.id}>

      {/* MR ID */}
      <td className="p-2 border">{mr.id}</td>

      {/* Project */}
      <td className="p-2 border">
        {mr.items?.length > 0
          ? mr.items[0].boqItem?.project?.name
          : "—"}
      </td>

      {/* Items */}
      <td className="p-2 border">
        {mr.items?.map((item, idx) => (
          <div key={idx} className="mb-2">
            <b>{item.boqItem?.category}</b> → {item.boqItem?.description}
            <br />
            Qty: {item.quantity}
            <hr />
          </div>
        ))}
      </td>

      {/* Status */}
      <td className="p-2 border font-bold">
        {mr.status === "PENDING" && (
          <span className="text-yellow-600">PENDING</span>
        )}
        {mr.status === "APPROVED" && (
          <span className="text-green-600">APPROVED</span>
        )}
        {mr.status === "REJECTED" && (
          <span className="text-red-600">REJECTED</span>
        )}
      </td>

      {/* Remarks */}
      <td className="p-2 border">{mr.managerRemarks || "—"}</td>

      {/* Created Date */}
      <td className="p-2 border">
        {new Date(mr.createdAt).toLocaleString()}
      </td>

    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}
