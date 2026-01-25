import React, { useState } from "react";
import { List, Typography, Tabs, Space, Tag, Empty } from "antd";
import { FiBell, FiCheckCircle, FiInfo, FiBox, FiTruck } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import toast from "../../utils/toast";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "new_product" | "order_update" | "system_alert";
}

const dummyNotifications: Notification[] = [
    {
    id: "1",
    title: "New Order #ABC457 Received",
    description: "New order #ABC457 has been received and is being processed.",
    timestamp: dayjs().subtract(2, "minutes").toISOString(),
    read: false,
    type: "order_update",
  },
  {
    id: "2",
    title: "New Product Added!",
    description: "A new product 'Wireless Earbuds Pro' has been added to the electronics category.",
    timestamp: dayjs().subtract(1, "hour").toISOString(),
    read: false,
    type: "new_product",
  },
  {
    id: "3",
    title: "Order #XYZ123 Status Update",
    description: "Your order #XYZ123 has been shipped and is on its way!",
    timestamp: dayjs().subtract(3, "hours").toISOString(),
    read: false,
    type: "order_update",
  },
  {
    id: "4",
    title: "System Maintenance Alert",
    description: "Scheduled system maintenance will occur on Friday at 2:00 AM UTC.",
    timestamp: dayjs().subtract(1, "day").toISOString(),
    read: true,
    type: "system_alert",
  },
  {
    id: "5",
    title: "Order #ABC456 Payment Confirmed",
    description: "Payment for order #ABC456 has been successfully processed.",
    timestamp: dayjs().subtract(2, "days").toISOString(),
    read: false,
    type: "order_update",
  },

];

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read!");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_product":
        return <FiBox className="text-blue-500 text-xl" />;
      case "order_update":
        return <FiTruck className="text-green-500 text-xl" />;
      case "system_alert":
        return <FiInfo className="text-red-500 text-xl" />;
      default:
        return <FiBell className="text-gray-500 text-xl" />;
    }
  };

  const filteredData =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <AppCard className="rounded-2xl" bodyStyle={{ padding: "0" }}>
          {/* Header Section */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <Title level={3} className="m-0! flex items-center gap-3">
                <span className="bg-violet-100 p-2 rounded-lg text-violet-600">
                  <FiBell />
                </span>
                Notifications
              </Title>
              <Text type="secondary">
                You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
              </Text>
            </div>

            <div className="flex items-center gap-3">
              <Tabs
                activeKey={filter}
                onChange={(k) => setFilter(k as "all" | "unread")}
                items={[
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" },
                ]}
                className="mb-[-16px]!" // Visual alignment hack for AntD tabs
              />
              <AppButton
                type="text"
                disabled={unreadCount === 0}
                onClick={markAllAsRead}
                icon={<FiCheckCircle />}
                className="text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 border-none"
              >
                Mark all read
              </AppButton>
            </div>
          </div>

          {/* List Section */}
          <div className="p-2">
            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              locale={{
                emptyText: <Empty description="No notifications found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }}
              renderItem={(item) => (
                <List.Item
                  className={`transition-colors duration-200 hover:bg-gray-50 px-4 py-4 rounded-xl mb-1 ${!item.read ? "bg-violet-50/40" : ""
                    }`}
                  actions={[
                    !item.read && (
                      <AppButton
                        type="link"
                        size="small"
                        onClick={() => markAsRead(item.id)}
                        className="text-xs"
                      >
                        Mark as read
                      </AppButton>
                    ),
                    <Text type="secondary" className="text-xs min-w-[60px] text-right block">
                      {dayjs(item.timestamp).fromNow()}
                    </Text>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className={`p-3 rounded-full ${!item.read ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                        {getIcon(item.type)}
                      </div>
                    }
                    title={
                      <Space>
                        <Text strong={!item.read} className="text-gray-800">
                          {item.title}
                        </Text>
                        {!item.read && <Tag color="red" className="rounded-full px-2 scale-75">NEW</Tag>}
                      </Space>
                    }
                    description={
                      <Text className="text-gray-500 block mt-1 line-clamp-2">
                        {item.description}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </AppCard>
      </div>
    </div>
  );
};

export default NotificationPage;
