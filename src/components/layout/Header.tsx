import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import AppButton from "../common/AppButton";
import AppPopconfirm from "../common/AppPopconfirm";
import { useGetNotificationsQuery } from "../../RTK/notification/notificationApi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useGetAllChatsQuery } from "../../RTK/chat/chatApi";
import { io } from "socket.io-client";
import { BASE_URL } from "../../RTK/api";
import { useMemo, useEffect } from "react";
import { LuBellRing } from "react-icons/lu";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });

  const { data: chats, refetch: refetchChats } = useGetAllChatsQuery(undefined, {
    pollingInterval: 30000,
  });

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("chat_list_updated", () => {
      refetchChats();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetchChats]);

  const unreadChatCount = useMemo(() => {
    if (!chats) return 0;
    return chats.filter((chat) =>
      chat.messages?.some((m) => m.sender === "user" && !m.isRead)
    ).length;
  }, [chats]);
  const name = localStorage.getItem("userName") || "Admin";

  const notificationCount = notifications.filter(n => !n.read).length;

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-lg">
      <h2 className="text-md! text-gray-700 font-serif italic">Welcome, <span className="text-violet-600 font-bold">{name}</span></h2>
      <div className="flex justify-between items-center gap-2">
        <Badge
          onClick={() => navigate("/chats")}
          className="cursor-pointer mr-2!"
          count={unreadChatCount}
          offset={[-10, 6]}
        >
          <span
            className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors block"
          >
            <IoChatboxEllipsesOutline
              size={22}
              className="text-violet-500! cursor-pointer"
            />
          </span>
        </Badge>
        <Badge
          onClick={() => navigate("/notifications")}
          className="cursor-pointer mr-2!"
          count={notificationCount}
          offset={[-10, 6]}
        >
          <span
            className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors block"
          >
            <LuBellRing size={22} className="text-violet-500" />
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
