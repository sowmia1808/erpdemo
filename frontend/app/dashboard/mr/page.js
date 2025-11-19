"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/api";

export default function MRList() {
  const [mrs, setMrs] = useState([]);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (token && role !== "USER") {
      apiGet("/mr", token).then((data) => {
        setMrs(Array.isArray(data) ? data : []);
      });
    }
  }, [token, role]);

  const approveMR = async (id) => {
    const remarks = prompt("Optional: Enter approval remarks");
    const res = await apiPut(`/mr/approve/${id}`, { managerRemarks: remarks }, token);
    alert(res.message || "Approved");
    window.location.reload();
  };

  const rejectMR = async (id) => {
    const remarks = prompt("Enter rejection reason (required):");
    if (!remarks?.trim()) return alert("Remarks are required.");
    const res = await apiPut(`/mr/reject/${id}`, { managerRemarks: remarks }, token);
    alert(res.message || "Rejected");
    window.location.reload();
  };

  if (role === "USER") {
    return (
      <p className="p-6 text-red-600 font-bold">
        You are not allowed to view this page.
      </p>
    );
  }

  if (!role) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {role === "MANAGER" ? "MR Approvals" : "Material Requisitions"}
      </h1>

      {mrs.length === 0 ? (
        <p>No MR found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Project</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Requested By</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Manager Remarks</th>
              {role === "MANAGER" && <th className="p-2 border">Action</th>}
            </tr>
          </thead>

          <tbody>
  {mrs.map((mr) => (
    <tr key={mr.id}>
      {/* MR ID */}
      <td className="p-2 border">{mr.id}</td>

      {/* Project name from first MR item */}
      <td className="p-2 border">
        {mr.items?.length > 0
          ? mr.items[0].boqItem?.project?.name
          : "—"}
      </td>

      {/* Item list */}
      <td className="p-2 border">
        {mr.items?.map((item, idx) => (
          <div key={idx}>
            <b>{item.boqItem?.category}</b> → {item.boqItem?.description}
            <hr />
          </div>
        ))}
      </td>

      {/* Quantity list */}
      <td className="p-2 border">
        {mr.items?.map((item, idx) => (
          <div key={idx}>
            {item.quantity}
            <hr />
          </div>
        ))}
      </td>

      {/* Requested By */}
      <td className="p-2 border">{mr.requestedByUser?.name}</td>

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

      {/* Manager remarks */}
      <td className="p-2 border">{mr.managerRemarks || "—"}</td>

      {/* Manager actions */}
      {role === "MANAGER" && (
        <td className="p-2 border space-x-2">
          {mr.status === "PENDING" ? (
            <>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => approveMR(mr.id)}
              >
                Approve
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => rejectMR(mr.id)}
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-blue-700 font-bold">Done</span>
          )}
        </td>
      )}
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}
