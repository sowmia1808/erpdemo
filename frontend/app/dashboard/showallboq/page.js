"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";

export default function ShowAllBOQ() {
  const [items, setItems] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      apiGet("/boq/all", token).then((data) => {
        setItems(Array.isArray(data) ? data : []);
      });
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All BOQ Items</h1>

      {items.length === 0 ? (
        <p>No BOQ items found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Project Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Subcategory</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit</th>
            </tr>
          </thead>

          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td className="border p-2">{i.project?.name}</td>
                <td className="border p-2">{i.category}</td>
                <td className="border p-2">{i.subCategory}</td>
                <td className="border p-2">{i.description}</td>
                <td className="border p-2 text-center">{i.quantity}</td>
                <td className="border p-2">{i.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
