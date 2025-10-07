"use client";

import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import AuthForm from "../components/AuthForm";

export default function Page() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vaultItems, setVaultItems] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

<button 
  onClick={() => setDarkMode(!darkMode)}
  className="px-3 py-1 h-16 w-32 bg-gray-300 dark:bg-gray-700 rounded"
>
  {darkMode ? "Light Mode" : "Dark Mode"}
</button>


  // ------------------ PASSWORD GENERATOR ------------------
  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+[]{}<>?/|~`-=";

    if (!chars.length) {
      setPassword("");
      return;
    }

    let newPass = "";
    for (let i = 0; i < length; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  // ------------------ COPY ------------------
  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // ------------------ VAULT CRUD ------------------
  const fetchVault = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/vault", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const items = await res.json();
        setVaultItems(items);
      }
    } catch (err) {
      console.error("Fetch vault error:", err);
    }
  };

  const saveToVault = async () => {
    if (!password || !token) return;
    setSaving(true);

    const vaultItem = {
      title: "My password",
      username: "user@example.com",
      password,
      url: "",
      notes: "",
    };

    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(vaultItem),
      });

      const text = await res.text();
      setSaving(false);

      if (res.ok) {
        fetchVault();
        alert("Password saved to vault!");
      } else {
        console.error("Vault save error:", text);
        alert("Failed to save vault: " + text);
      }
    } catch (err) {
      setSaving(false);
      console.error("Fetch error:", err);
      alert("Failed to save vault: " + err.message);
    }
  };

  const deleteVaultItem = async (id) => {
    if (!token) return;
    const res = await fetch("/api/vault", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ _id: id }),
    });
    if (res.ok) setVaultItems(vaultItems.filter((item) => item._id !== id));
  };

  const editVaultItem = async (id, updatedData) => {
    if (!token) return;
    const res = await fetch("/api/vault", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ _id: id, ...updatedData }),
    });
    if (res.ok) {
      const updatedItem = await res.json();
      setVaultItems(vaultItems.map((item) => (item._id === id ? updatedItem : item)));
    }
  };

  // ------------------ EFFECT ------------------
  useEffect(() => {
    if (token) fetchVault();
  }, [token]);

  // ------------------ RENDER ------------------
  if (!token) {
    return <AuthForm onLogin={(t) => setToken(t)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 space-y-6">
      <div className="w-full max-w-lg bg-blue-900 border-1 border-yellow-200 rounded-xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center ">🔐 Password Generator & Vault</h1>

        <div className="space-y-1">
          <label className="font-medium text-sm">Enter / Paste password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or generate a password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} />
            Uppercase
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
            Numbers
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
            Symbols
          </label>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Length: {length}</label>
          <input type="range" min={6} max={30} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
        </div>

        <button onClick={generatePassword} className="w-full bg-amber-400 text-white py-2 rounded-lg hover:bg-amber-500">
          Generate Password
        </button>

        {password && <div className="bg-blue-200 text-black p-3 rounded-md break-all text-center">{password}</div>}

        {password && (
          <div className="flex gap-4">
            <button onClick={copyToClipboard} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={saveToVault} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700" disabled={saving}>
              {saving ? "Saving..." : "Save to Vault"}
            </button>
          </div>
        )}
      </div>

      {/* ----------------- VAULT LIST ----------------- */}
      <div className="w-full max-w-lg bg-yellow-600 rounded-xl shadow-md p-4 space-y-2">
        <h2 className="text-xl font-bold text-white">Your Vault</h2>
        {vaultItems.length === 0 ? (
          <p className="text-white">No vault items yet.</p>
        ) : (
          vaultItems.map((item) => (
            <div key={item._id} className="border p-2 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">{item.username}</p>
                <p className="text-sm text-gray-600">{item.password}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  onClick={() => {
                    const newTitle = prompt("Edit title", item.title);
                    const newUsername = prompt("Edit username", item.username);
                    const newPassword = prompt("Edit password", item.password);
                    if (newTitle && newUsername && newPassword) {
                      editVaultItem(item._id, { title: newTitle, username: newUsername, password: newPassword });
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this item?")) {
                      deleteVaultItem(item._id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
