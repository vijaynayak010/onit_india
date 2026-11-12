import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Mock login logic as requested for production demo
    if (email === "admin@onit.com" && password === "Admin@2026") {
      const adminData = { role: "ADMIN", email: "admin@onit.com" };
      localStorage.setItem("onit_admin", "true");
      localStorage.setItem("onit_user", JSON.stringify(adminData));
      localStorage.setItem("onit_token", "mock_admin_token");
      localStorage.setItem("admin_token", "mock_admin_token"); // Ensure consistency for specialized API
      localStorage.setItem("userRole", "ADMIN");
      localStorage.setItem("onit_dev_access_2026", "granted");
      
      alert("✅ Welcome back, Admin!");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid credentials. Try admin@onit.com / Admin@2026");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e3eafc] to-[#D9EEE3] px-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-sm transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium mb-2">
            <span className="text-black">On</span>
            <span className="text-green-500">IT</span>
          </h1>
          <p className="text-gray-600 text-sm">Admin Login Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-black transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Only authorized admin can access this portal.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
