import React, { useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom"; // Import NavLink
import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [notificationCount] = useState(5);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "block py-2 px-4 rounded bg-gray-700 text-white"
      : "block py-2 px-4 rounded hover:bg-gray-700";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          ShowCase Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2">
              <NavLink to="/dashboard/overview" className={linkClass}>
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/add-products" className={linkClass}>
                Add Product
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/products" className={linkClass}>
                Products
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/orders" className={linkClass}>
                Orders
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/admins" className={linkClass}>
                Admins
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/categories" className={linkClass}>
                Categories
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white">
          <h1 className="text-xl font-semibold">Welcome to your Dashboard!</h1>
          {/* User Profile/Actions can go here */}
          <div className="flex justify-between items-center gap-2">
            <Badge 
            className="cursor-pointer"
            count={notificationCount} offset={[-20, 5]}>
              <BellOutlined style={{ fontSize: "24px", marginRight: "20px" }} />
            </Badge>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <Outlet /> {/* This is where nested routes will be rendered */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
