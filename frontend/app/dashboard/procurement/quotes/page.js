"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../../utils/api";
import Link from "next/link";

export default function AllMRQuotesPage() {
  const [mrs, setMrs] = useState([]);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");

    setToken(t);
    setRole(r);

    if (t && r === "PROCUREMENT") {
      apiGet("/procurement/approved", t).then((data) => {
        setMrs(data);
      });
    }
  }, []);

  if (role !== "PROCUREMENT") {
    return (
      <p className="p-6 text-red-600 font-bold">
        You are not allowed to view this page.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        All Approved MRs with Supplier Quotes
      </h1>

      {mrs.length === 0 ? (
        <p>No approved MRs found.</p>
      ) : (
        mrs.map((mr) => (
          <div
            key={mr.id}
            className="p-5 mb-8 border rounded-lg shadow bg-white"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              MR #{mr.id}
            </h2>

            <p className="text-gray-700">
              Requested By: <b>{mr.requestedByUser?.name}</b>
            </p>

            <hr className="my-3" />

            {/* ITEMS */}
            {mr.items.map((item) => (
              <div key={item.id} className="mb-6">
                <h3 className="text-lg font-semibold">
                  Project: {item.boqItem?.project?.name}
                </h3>

                <p>
                  <b>Category:</b> {item.boqItem?.category}
                </p>
                <p>
                  <b>Description:</b> {item.boqItem?.description}
                </p>
                <p>
                  <b>Quantity:</b> {item.quantity}
                </p>

                {/* SUPPLIER QUOTES */}
                <table className="w-full border mt-3">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Supplier</th>
                      <th className="border p-2">Price</th>
                    </tr>
                  </thead>

                  <tbody>
  {item.supplierQuotes?.length > 0 ? (
    item.supplierQuotes.map((q, i) => (
      <tr key={i}>
        <td className="border p-2">{q.supplier}</td>
        <td className="border p-2">{q.price}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td className="border p-2 text-gray-500" colSpan="2">
        No supplier quotes added yet.
      </td>
    </tr>
  )}
                 </tbody>

                </table>
              </div>
            ))}

           
          </div>
        ))
      )}
    </div>
  );
}
