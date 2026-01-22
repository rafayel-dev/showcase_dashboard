import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiBox,
  FiPlusSquare,
  FiLayers,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all \
     ${
       isActive
         ? "bg-violet-500 text-white shadow"
         : "text-black hover:bg-gray-300 hover:text-gray-600"
     }`;

  return (
    <aside className="w-64 bg-white flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-400">
        <h1 className="text-xl font-bold tracking-wide">ShowCase</h1>
        <p className="text-xs text-gray-700">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/overview" className={linkClass}>
          <FiHome size={18} /> Dashboard
        </NavLink>

        <NavLink to="/orders" className={linkClass}>
          <FiShoppingCart size={18} /> Orders
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          <FiBox size={18} /> Products
        </NavLink>

        <NavLink to="/add-product" className={linkClass}>
          <FiPlusSquare size={18} /> Add Product
        </NavLink>

        <NavLink to="/drafts-product" className={linkClass}>
          <FiFileText size={18} /> Draft Products
        </NavLink>

        <NavLink to="/categories" className={linkClass}>
          <FiLayers size={18} /> Categories
        </NavLink>

        <NavLink to="/admins" className={linkClass}>
          <FiUsers size={18} /> Admins
        </NavLink>

        {/* Settings Section */}
        <div className="pt-4">
          <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settings
          </h2>
          <div className="mt-2 space-y-2">
            <NavLink to="/privacy" className={linkClass}>
              <FiFileText size={18} /> Privacy Policy
            </NavLink>
            <NavLink to="/terms" className={linkClass}>
              <FiFileText size={18} /> Terms & Conditions
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              <FiFileText size={18} /> About Us
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-400 text-xs text-gray-400">
        © {new Date().getFullYear()} ShowCase
      </div>
    </aside>
  );
};

export default Sidebar;
