"use client";

import { useState } from "react";

export default function AuthForm({ onLogin }) {
  const [type, setType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned invalid response");
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.token);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("AuthForm error:", err);
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">{type === "login" ? "Login" : "Sign Up"}</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Please wait..." : type === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 font-medium hover:underline"
            onClick={() => setType(type === "login" ? "signup" : "login")}
          >
            {type === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
