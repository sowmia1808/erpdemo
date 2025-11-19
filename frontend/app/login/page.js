"use client";
import { useAuth } from "../utils/auth";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <input
  className="border w-full mb-3 p-2 rounded"
  placeholder="Email"
  type="email"
  required
  onChange={(e) => setEmail(e.target.value)}
/>
       <input
  className="border w-full mb-4 p-2 rounded"
  type="password"
  placeholder="Password"
  required
  onChange={(e) => setPassword(e.target.value)}
/>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
}
