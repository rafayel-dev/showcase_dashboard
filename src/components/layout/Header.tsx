import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";

interface HeaderProps {
  onLogout: () => void;
  notificationCount: number;
}

const Header: React.FC<HeaderProps> = ({ onLogout, notificationCount }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="flex justify-end items-center p-4 bg-white shadow-lg">
      <div className="flex justify-between items-center gap-2">
        <Badge className="cursor-pointer" count={notificationCount} offset={[-20, 5]}>
          <BellOutlined style={{ fontSize: "24px", marginRight: "20px" }} />
        </Badge>
        <button
          className="px-4 py-2 bg-violet-500 text-white! rounded hover:bg-violet-600 cursor-pointer"
          onClick={handleLogoutClick}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
