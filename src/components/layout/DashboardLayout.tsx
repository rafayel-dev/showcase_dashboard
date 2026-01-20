import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [notificationCount] = useState(5);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onLogout={onLogout} notificationCount={notificationCount} />

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4 rounded-lg shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
