import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, FileText, LogOut } from "react-feather";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("onit_admin") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("onit_admin");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#d8f7e3] via-[#ffffff] to-[#e3eafc] font-['Neue Montreal']">
      
      {/* 🌀 Animated Floating Lights */}


      {/* 🧊 Dashboard Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className="relative z-10 w-[90%] max-w-5xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_0_80px_-20px_rgba(0,0,0,0.2)] rounded-3xl p-10 md:p-16 text-center"
      >
        {/* 🧠 Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight mb-12"
        >
          Admin <span className="text-green-500">Control Panel</span>
        </motion.h1>

        {/* 🔘 Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 justify-center items-center">
          {/* Add Post */}
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/add-post")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                       px-8 py-4 rounded-2xl text-lg font-semibold shadow-md hover:shadow-lg hover:from-black hover:to-gray-800 
                       transition-all duration-300"
          >
            <PlusCircle size={22} />
            New Blog Post
          </motion.button>

          {/* View Blog */}
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/blog")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                       px-8 py-4 rounded-2xl text-lg font-semibold shadow-md hover:shadow-lg hover:from-black hover:to-gray-800 
                       transition-all duration-300"
          >
            <FileText size={22} />
            View Blogs
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white 
                       px-8 py-4 rounded-2xl text-lg font-semibold shadow-md hover:shadow-lg hover:from-black hover:to-gray-800 
                       transition-all duration-300"
          >
            <LogOut size={22} />
            Logout
          </motion.button>
        </div>

        {/* 📦 Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mt-12 text-sm sm:text-base"
        >
          ⚙️ Logged in as <span className="font-semibold text-black">OnIT Admin</span>.  
          Manage your content, control visibility, and analyze engagement effortlessly.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
