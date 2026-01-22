import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Popconfirm } from "antd";
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
    <header className="flex justify-between items-center p-4 bg-white shadow-lg">
       <h2 className="text-sm! text-violet-600">Name Here</h2>
      <div className="flex justify-between items-center gap-2">
        <Badge
          className="cursor-pointer"
          count={notificationCount}
          offset={[-20, 5]}
        >
          <span onClick={() => navigate("/notifications")}>
            <BellOutlined style={{ fontSize: "24px", marginRight: "20px" }} />
          </span>
        </Badge>
       
        <Popconfirm
          placement="bottomRight"
          title="Are you sure you want logout?"
          okText="Confirm"
          cancelText="Cancel"
          onConfirm={handleLogoutClick}
        >
          <button className="px-4 py-2 bg-violet-500 text-white! rounded hover:bg-violet-600 cursor-pointer">
            Logout
          </button>
        </Popconfirm>
      </div>
    </header>
  );
};

export default Header;
