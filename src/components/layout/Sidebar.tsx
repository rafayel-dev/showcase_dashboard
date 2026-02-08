import React, { useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { io } from "socket.io-client";
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
  FiMessageSquare,
} from "react-icons/fi";
import { useGetAllChatsQuery } from "@/RTK/chat/chatApi";
import { useGetOrdersQuery } from "@/RTK/order/orderApi";
import { BASE_URL } from "@/RTK/api";
import { MdAdsClick } from "react-icons/md";

const MENU_ITEMS = [
  { path: "/overview", label: "Dashboard", icon: FiHome },
  { path: "/orders", label: "Orders", icon: FiShoppingCart, badgeType: "orders" },
  { path: "/products", label: "Products", icon: FiBox },
  { path: "/add-product", label: "Add Product", icon: FiPlusSquare },
  { path: "/drafts-product", label: "Draft Products", icon: FiArchive },
  { path: "/categories", label: "Categories", icon: FiLayers },
  { path: "/promotions", label: "Promotions", icon: MdAdsClick },
  { path: "/coupons", label: "Coupons", icon: FiGift },
  { path: "/chats", label: "Messages", icon: FiMessageSquare, badgeType: "chats" },
  { path: "/admins", label: "Admins", icon: FiUsers },
];

const SETTINGS_ITEMS = [
  { path: "/privacy", label: "Privacy Policy", icon: FiShield },
  { path: "/terms", label: "Terms & Conditions", icon: FiFileText },
  { path: "/about", label: "About Us", icon: FiInfo },
];

const Sidebar: React.FC = () => {
  const { data: chats, refetch: refetchChats } = useGetAllChatsQuery(undefined, {
    pollingInterval: 30000,
  });

  const { data: ordersData, refetch: refetchOrders } = useGetOrdersQuery(
    { page: 1, limit: 1 },
    { pollingInterval: 60000 }
  );

  React.useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("chat_list_updated", () => {
      refetchChats();
    });

    socket.on("order_updated", () => {
      refetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetchChats, refetchOrders]);

  const unreadChatCount = useMemo(() => {
    if (!chats) return 0;
    return chats.filter((chat) =>
      chat.messages?.some((m) => m.sender === "user" && !m.isRead)
    ).length;
  }, [chats]);

  const pendingOrderCount = ordersData?.pending || 0;

  const linkClass = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
        ? "bg-violet-500 text-white shadow-md shadow-violet-200"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`,
    []
  );

  return (
    <aside className="w-64 bg-white flex flex-col border-r border-gray-100 h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-wide text-gray-800">ShowCase</h1>
        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const badgeCount = item.badgeType === "chats" ? unreadChatCount
            : item.badgeType === "orders" ? pendingOrderCount
              : 0;
          const badgeColor = item.badgeType === "orders" ? "bg-amber-500" : "bg-violet-500";

          return (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badgeType && badgeCount > 0 && (
                <span className={`min-w-5 h-5 flex items-center justify-center text-xs font-bold text-white ${badgeColor} rounded-full px-1.5`}>
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}

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

