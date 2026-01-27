import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { FiBell } from "react-icons/fi";
import AppButton from "../common/AppButton";
import AppPopconfirm from "../common/AppPopconfirm";
import { useGetNotificationsQuery } from "../../RTK/notification/notificationApi";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { data: notifications = [] } = useGetNotificationsQuery();

  const notificationCount = notifications.filter(n => !n.read).length;

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-lg">
      <h2 className="text-sm! text-violet-600">Name Here</h2>
      <div className="flex justify-between items-center gap-2">
        <Badge
          className="cursor-pointer"
          count={notificationCount}
          offset={[-8, 8]}
          size="small"
        >
          <span
            onClick={() => navigate("/notifications")}
            className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors block"
          >
            <FiBell className="text-xl text-gray-600" />
          </span>
        </Badge>

        <AppPopconfirm
          placement="bottomRight"
          title="Are you sure you want logout?"
          okText="Confirm"
          cancelText="Cancel"
          onConfirm={handleLogoutClick}
        >
          <AppButton type="primary" className="bg-violet-500 text-white! rounded hover:bg-violet-600 cursor-pointer">
            Logout
          </AppButton>
        </AppPopconfirm>
      </div>
    </header>
  );
};

export default Header;
