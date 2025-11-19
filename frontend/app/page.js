"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If not logged in → send to login
    if (!token || !role) {
      router.push("/login");
      return;
    }

    // ROLE BASED REDIRECTS
    switch (role) {
      case "EMPLOYEE":
        router.push("/dashboard/mr");
        break;

      case "MANAGER":
        router.push("/dashboard/manager");
        break;

      case "PROCUREMENT":
        router.push("/dashboard/procurement");
        break;

      default:
        router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500 text-lg">Redirecting...</p>
    </div>
  );
}
