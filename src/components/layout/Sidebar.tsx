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
  FiGift,
  FiArchive,
  FiInfo,
  FiShield,
} from "react-icons/fi";

const MENU_ITEMS = [
  { path: "/overview", label: "Dashboard", icon: FiHome },
  { path: "/orders", label: "Orders", icon: FiShoppingCart },
  { path: "/products", label: "Products", icon: FiBox },
  { path: "/add-product", label: "Add Product", icon: FiPlusSquare },
  { path: "/drafts-product", label: "Draft Products", icon: FiArchive },
  { path: "/categories", label: "Categories", icon: FiLayers },
  { path: "/coupons", label: "Coupons", icon: FiGift },
  { path: "/admins", label: "Admins", icon: FiUsers },
];

const SETTINGS_ITEMS = [
  { path: "/privacy", label: "Privacy Policy", icon: FiShield },
  { path: "/terms", label: "Terms & Conditions", icon: FiFileText },
  { path: "/about", label: "About Us", icon: FiInfo },
];

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-violet-500 text-white shadow-md shadow-violet-200"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside className="w-64 bg-white flex flex-col border-r border-gray-100 h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-wide text-gray-800">
          ShowCase
        </h1>
        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass}>
            <item.icon size={18} /> {item.label}
          </NavLink>
        ))}

        {/* Settings Section */}
        <div className="pt-6 mt-2 border-t border-gray-100">
          <h2 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Settings
          </h2>
          <div className="space-y-1">
            {SETTINGS_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                <item.icon size={18} /> {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 bg-gray-50">
        © {new Date().getFullYear()} ShowCase v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
