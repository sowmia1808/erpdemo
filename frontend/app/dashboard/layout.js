"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-900 text-white p-5 space-y-6">
          <h1 className="text-xl font-bold">Ray Fitout</h1>
<nav className="space-y-3">

  <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">
    Dashboard Home
  </Link>

  {/* Projects — NOT visible to USER */}
  {(role === "MANAGER" || role === "PROCUREMENT") && (
    <Link href="/dashboard/projects" className="block px-3 py-2 rounded hover:bg-gray-700">
      Projects
    </Link>
  )}

  {/* BOQ visible ONLY for manager + procurement */}
  {(role === "MANAGER" || role === "PROCUREMENT") && (
    <Link href="/dashboard/showallboq" className="block px-3 py-2 rounded hover:bg-gray-700">
      BOQ Items
    </Link>
  )}

  {/* EMPLOYEE (USER) — create MR & view own MR */}
  {role === "USER" && (
    <>
      <Link href="/dashboard/mr/create" className="block px-3 py-2 rounded hover:bg-gray-700">
        Create MR
      </Link>

      <Link href="/dashboard/mr/my" className="block px-3 py-2 rounded hover:bg-gray-700">
        My MR Status
      </Link>
    </>
  )}

  {/* PROCUREMENT — view all MR & procurement tasks */}
  {role === "PROCUREMENT" && (
    <>
      <Link href="/dashboard/mr" className="block px-3 py-2 rounded hover:bg-gray-700">
        Material Requisitions
      </Link>

      <Link href="/dashboard/procurement" className="block px-3 py-2 rounded hover:bg-gray-700">
        Procurement
      </Link>
       <Link
    href="/dashboard/procurement/quotes"
    className="block px-3 py-2 rounded hover:bg-gray-700"
  >
    All Supplier Quotes
  </Link>
    </>
  )}

  {/* MANAGER — approve MRs */}
  {role === "MANAGER" && (
    <Link href="/dashboard/mr" className="block px-3 py-2 rounded hover:bg-gray-700">
      MR Approvals
    </Link>
  )}

</nav>



          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
