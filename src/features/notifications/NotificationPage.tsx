import React, { useState } from "react";
import { Card, Typography, List, Button, Space, Tag } from "antd";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import toast from "../../../utils/toast";

const { Title, Text } = Typography;

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
    title: "New Product Added!",
    description: "A new product 'Wireless Earbuds Pro' has been added to the electronics category.",
    timestamp: moment().subtract(1, "hour").toISOString(),
    read: false,
    type: "new_product",
  },
  {
    id: "2",
    title: "Order #XYZ123 Status Update",
    description: "Your order #XYZ123 has been shipped and is on its way!",
    timestamp: moment().subtract(3, "hours").toISOString(),
    read: false,
    type: "order_update",
  },
  {
    id: "3",
    title: "System Maintenance Alert",
    description: "Scheduled system maintenance will occur on Friday at 2:00 AM UTC.",
    timestamp: moment().subtract(1, "day").toISOString(),
    read: true,
    type: "system_alert",
  },
  {
    id: "4",
    title: "Order #ABC456 Payment Confirmed",
    description: "Payment for order #ABC456 has been successfully processed.",
    timestamp: moment().subtract(2, "days").toISOString(),
    read: false,
    type: "order_update",
  },
];

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true,
      }))
    );
    toast.success("All notifications marked as read!");
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const getTypeTag = (type: Notification["type"]) => {
    switch (type) {
      case "new_product":
        return <Tag color="blue">Product</Tag>;
      case "order_update":
        return <Tag color="green">Order</Tag>;
      case "system_alert":
        return <Tag color="red">System</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="rounded-2xl">
        <Space direction="horizontal" align="center" className="w-full justify-between mb-4">
          <Title level={3} className="m-0!">
            <BellOutlined className="mr-2!" />
            Notifications
          </Title>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.read)}
            className="bg-violet-500!"
          >
            Mark All as Read
          </Button>
        </Space>

        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              actions={[
                !item.read ? (
                  <Button type="link" onClick={() => markAsRead(item.id)}>
                    Mark as Read
                  </Button>
                ) : (
                  <Text type="secondary">Read</Text>
                ),
              ]}
              className={!item.read ? "bg-blue-50" : ""}
            >
              <List.Item.Meta
              className="ml-3!"
                title={
                  <Space>
                    <Text strong={!item.read}>{item.title}</Text>
                    {getTypeTag(item.type)}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text>{item.description}</Text>
                    <Text type="secondary" style={{ fontSize: "0.8em" }}>
                      {moment(item.timestamp).fromNow()}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default NotificationPage;
