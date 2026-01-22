import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Tag,
  Typography,
  Modal,
  Descriptions,
  Spin,
  Row,
  Col,
  Statistic,
  Tabs,
  Select,
} from "antd";
import type { TableProps } from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  HistoryOutlined,
  FieldTimeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { FiEdit } from "react-icons/fi";
import type { Order } from "../../types";
import { fetchOrders, updateOrder } from "../../services/orderService";
import toast from "../../../utils/toast";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Inline editing states
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<Order["status"] | null>(null);
  const [editingCourierId, setEditingCourierId] = useState<string | null>(null);
  const [editCourier, setEditCourier] = useState<Order["courier"] | null>(null);
  const [editingPaymentStatusId, setEditingPaymentStatusId] = useState<
    string | null
  >(null);
  const [editPaymentStatus, setEditPaymentStatus] = useState<
    Order["paymentStatus"] | null
  >(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for status inline editing
  const startInlineEditStatus = (record: Order) => {
    setEditingStatusId(record.id);
    setEditStatus(record.status);
  };

  const cancelInlineEditStatus = () => {
    setEditingStatusId(null);
  };

  const saveInlineEditStatus = async (id: string) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === id);
      if (orderToUpdate && editStatus) {
        await updateOrder({ ...orderToUpdate, status: editStatus });
        toast.success("Order status updated!");
        setEditingStatusId(null);
        loadOrders();
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  // Handlers for courier inline editing
  const startInlineEditCourier = (record: Order) => {
    setEditingCourierId(record.id);
    setEditCourier(record.courier);
  };

  const cancelInlineEditCourier = () => {
    setEditingCourierId(null);
  };

  const saveInlineEditCourier = async (id: string) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === id);
      if (orderToUpdate && editCourier) {
        await updateOrder({ ...orderToUpdate, courier: editCourier });
        toast.success("Courier updated!");
        setEditingCourierId(null);
        loadOrders();
      }
    } catch (error) {
      toast.error("Failed to update courier.");
    }
  };

  // Handlers for payment status inline editing
  const startInlineEditPaymentStatus = (record: Order) => {
    setEditingPaymentStatusId(record.id);
    setEditPaymentStatus(record.paymentStatus);
  };

  const cancelInlineEditPaymentStatus = () => {
    setEditingPaymentStatusId(null);
  };

  const saveInlineEditPaymentStatus = async (id: string) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === id);
      if (orderToUpdate && editPaymentStatus) {
        await updateOrder({
          ...orderToUpdate,
          paymentStatus: editPaymentStatus,
        });
        toast.success("Payment status updated!");
        setEditingPaymentStatusId(null);
        loadOrders();
      }
    } catch (error) {
      toast.error("Failed to update payment status.");
    }
  };

  const statusColor = (status: Order["status"]) =>
    ({
      Pending: "orange",
      Processing: "processing",
      Shipped: "geekblue",
      Delivered: "success",
      Cancelled: "error",
    })[status] || "default";

  const paymentStatusColor = (status: Order["paymentStatus"]) =>
    ({
      Paid: "success",
      Unpaid: "error",
    })[status] || "default";

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const isSLABreached = (orderDate: string) => {
    const hours = (Date.now() - new Date(orderDate).getTime()) / 36e5;
    return hours > 24;
  };

  const columns: TableProps<Order>["columns"] = [
    { title: "Order ID", dataIndex: "id", width: 110 },
    { title: "Customer", dataIndex: "customerName" },
    {
      title: "Mobile",
      dataIndex: "customerMobile",
      render: (m) => <Text>{m}</Text>,
    },
    {
      title: "Product Name",
      dataIndex: "items",
      render: (items) => (
        <Text>
          {items?.[0]?.productName}
          {items?.length > 1 && ` +${items.length - 1} more`}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) =>
        editingStatusId === record.id ? (
          <Space>
            <Select
              value={editStatus}
              onChange={(value) => setEditStatus(value)}
              style={{ width: 100 }}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
            <Button
              className="bg-violet-500!"
              size="small"
              type="primary"
              onClick={() => saveInlineEditStatus(record.id)}
            >
              Save
            </Button>
            <Button danger size="small" onClick={cancelInlineEditStatus}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Tag color={statusColor(status)}>{status}</Tag>
            <Button
              size="small"
              type="text"
              icon={<FiEdit />}
              onClick={() => startInlineEditStatus(record)}
            />
          </Space>
        ),
    },
    {
      title: "Courier",
      dataIndex: "courier",
      render: (courier, record) =>
        editingCourierId === record.id ? (
          <Space>
            <Select
              value={editCourier}
              onChange={(value) => setEditCourier(value)}
              style={{ width: 90 }}
            >
              <Option value="Pathao">Pathao</Option>
              <Option value="Steadfast">Steadfast</Option>
              <Option value="RedX">RedX</Option>
            </Select>
            <Button
              className="bg-violet-500!"
              size="small"
              type="primary"
              onClick={() => saveInlineEditCourier(record.id)}
            >
              Save
            </Button>
            <Button danger size="small" onClick={cancelInlineEditCourier}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            {courier}
            <Button
              size="small"
              type="text"
              icon={<FiEdit />}
              onClick={() => startInlineEditCourier(record)}
            />
          </Space>
        ),
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (paymentStatus, record) =>
        editingPaymentStatusId === record.id ? (
          <Space>
            <Select
              value={editPaymentStatus}
              onChange={(value) => setEditPaymentStatus(value)}
              style={{ width: 80 }}
            >
              <Option value="Paid">Paid</Option>
              <Option value="Unpaid">Unpaid</Option>
            </Select>
            <Button
              className="bg-violet-500!"
              size="small"
              type="primary"
              onClick={() => saveInlineEditPaymentStatus(record.id)}
            >
              Save
            </Button>
            <Button danger size="small" onClick={cancelInlineEditPaymentStatus}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Tag color={paymentStatusColor(paymentStatus)}>{paymentStatus}</Tag>
            <Button
              size="small"
              type="text"
              icon={<FiEdit />}
              onClick={() => startInlineEditPaymentStatus(record)}
            />
          </Space>
        ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (v) => (
        <Space direction="vertical" size={0}>
          <Text strong>৳ {v.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: "Action",
      align: "right",
      render: (_, record) => (
        <Button
          type="link"
          className="font-semibold! text-violet-500!"
          icon={<EyeOutlined />}
          onClick={() => setViewOrder(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const orderItemColumns: TableProps<any>["columns"] = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      render: (v) => <Text type="secondary">{v || "—"}</Text>,
    },
    {
      title: "Size",
      dataIndex: "size",
      align: "center",
      render: (v) =>
        v ? <Tag color="purple">{v}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: "Color",
      dataIndex: "color",
      align: "center",
      render: (v) =>
        v ? <Tag color="violet">{v}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: "Price",
      dataIndex: "price",
      align: "right",
      render: (v) => `৳ ${v}`,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      align: "center",
    },
    {
      title: "Subtotal",
      align: "right",
      render: (_, r) => `৳ ${r.price * r.quantity}`,
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title level={3}>📦 Order Management</Title>

      <Row gutter={16} className="mt-4">
        <Col md={4}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orders.length}
              prefix={
                <ShoppingCartOutlined className="text-violet-500! mr-2!" />
              }
            />
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Statistic
              title="Pending"
              value={orders.filter((o) => o.status === "Pending").length}
              prefix={<HistoryOutlined className="text-[#f59e0b]! mr-2!" />}
            />
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Statistic
              title="Processing"
              value={orders.filter((o) => o.status === "Processing").length}
              prefix={<FieldTimeOutlined className="text-[#3b82f6]! mr-2!" />}
            />
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Statistic
              title="Shipped"
              value={orders.filter((o) => o.status === "Shipped").length}
              prefix={<TruckOutlined className="text-[#6366f1]! mr-2!" />}
            />
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Statistic
              title="Delivered"
              value={orders.filter((o) => o.status === "Delivered").length}
              prefix={<CheckCircleOutlined className="text-[#22c55e]! mr-2!" />}
            />
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Statistic
              title="Cancelled"
              value={orders.filter((o) => o.status === "Cancelled").length}
              prefix={<CloseCircleOutlined className="text-[#ef4444]! mr-2!" />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-6! rounded-2xl">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            "All",
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((k) => ({
            key: k,
            label: `${k} (${k === "All" ? orders.length : orders.filter((o) => o.status === k).length})`,
          }))}
        />

        <Spin spinning={loading}>
          <Table
            rowKey="id"
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            rowClassName={(r) =>
              r.status === "Pending" && isSLABreached(r.orderDate)
                ? "bg-red-50"
                : ""
            }
            columns={columns}
            dataSource={filteredOrders}
            pagination={{ pageSize: 8 }}
          />
        </Spin>
      </Card>

      <Modal
        open={!!viewOrder}
        onCancel={() => setViewOrder(null)}
        footer={null}
        width={900}
      >
        {viewOrder && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Customer & Delivery">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      {viewOrder.customerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mobile">
                      {viewOrder.customerMobile}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                      {viewOrder.shippingAddress}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Order & Payment">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Order ID">
                      {viewOrder.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Status">
                      <Tag color={statusColor(viewOrder.status)}>
                        {viewOrder.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Method">
                      {viewOrder.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Status">
                      {viewOrder.paymentStatus}
                    </Descriptions.Item>
                    <Descriptions.Item label="Courier">
                      {viewOrder.courier}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total">
                      ৳ {viewOrder.totalAmount}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col span={24}>
                <Card title="🛒 Ordered Products">
                  <Table
                    size="small"
                    pagination={false}
                    columns={orderItemColumns}
                    dataSource={viewOrder.items}
                    rowKey={(r) => r.productId}
                  />
                </Card>
              </Col>
            </Row>

            <Row justify="end" className="mt-4">
              <Col span={10}>
                <Card>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Subtotal">
                      ৳{" "}
                      {viewOrder.items.reduce(
                        (s, i) => s + i.price * i.quantity,
                        0,
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Delivery Charge">
                      ৳ {viewOrder.deliveryCharge || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Payable">
                      <Text strong>৳ {viewOrder.totalAmount}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;
