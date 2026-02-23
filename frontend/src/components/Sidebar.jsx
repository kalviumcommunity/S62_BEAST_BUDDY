/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: <FiHome />, route: "/home" },
    { name: "Dashboard", icon: <FiUser />, route: "/user-dashboard" },
    { name: "Settings", icon: <FiSettings />, route: "/settings" },
  ];

  const isActive = (route) => {
    return location.pathname === route;
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    const ok = window.confirm('Are you sure you want to log out?');
    if (!ok) return;
    logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 h-full w-64 bg-gray-800/70 backdrop-blur-xl border-r border-gray-700 shadow-lg flex flex-col p-6"
    >
      <h2 className="text-2xl font-bold text-purple-400 mb-8 text-center">
        Dashboard
      </h2>
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition ${
              isActive(item.route) ? "bg-orange-500 text-white" : "text-gray-200 hover:bg-gray-700"
            }`}
            onClick={() => {
              if (item.route) navigate(item.route);
            }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="my-2 mt-4 w-full py-2 rounded-2xl bg-orange-600 hover:bg-red-600 text-white font-semibold shadow-md transition" onClick={handleLogout}>
          Logout
        </button>
        <p className="mt-auto text-gray-400 text-sm text-center">
          &copy; 2024 Beast Buddy
        </p>
        <p className="mt-2 text-gray-400 text-sm text-center">
          Version 1.0.0
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
