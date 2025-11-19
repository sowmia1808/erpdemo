// Show MR + Items + 3 Supplier Quotes
"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../../utils/api";
import { useParams } from "next/navigation";

export default function MRDetails() {
  const { id } = useParams();
  const [mr, setMr] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token) {
      apiGet(`/mr/details/${id}`, token).then((data) => setMr(data));
    }
  }, [token, id]);

  if (!mr) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        MR #{mr.id} – {mr.items[0].boqItem.project.name}
      </h1>

      <p><b>Requested By:</b> {mr.requestedByUser.name}</p>
      <p><b>Status:</b> {mr.status}</p>

      <h2 className="text-xl font-bold mt-6 mb-3">Items & Supplier Quotes</h2>

      {mr.items.map((item) => (
        <div key={item.id} className="border p-4 rounded mb-6 bg-white">
          <h3 className="text-lg font-bold mb-1">
            {item.boqItem.category} – {item.boqItem.description}
          </h3>

          <p className="mb-3">Qty: {item.quantity}</p>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Price</th>
              </tr>
            </thead>

            <tbody>
              {item.supplierQuotes.length === 0 ? (
                <tr>
                  <td className="p-2 border" colSpan="2">No Quotes Added</td>
                </tr>
              ) : (
                item.supplierQuotes.map((q, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{q.supplier}</td>
                    <td className="p-2 border">{q.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
