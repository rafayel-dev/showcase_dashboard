import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Tag,
  Typography,
  Modal,
  Select,
  Descriptions,
  Spin,
  Row,
  Col,
  Statistic,
  Tabs,
} from "antd";
import type { TableProps } from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import type { Order } from "../../types";
import { fetchOrders, updateOrder } from "../../services/orderService";
import toast from "../../../utils/toast"

const { Title, Text } = Typography;
const { Option } = Select;

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

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

  const statusColor = (status: Order["status"]) => ({
    Pending: "default",
    Processing: "processing",
    Shipped: "geekblue",
    Delivered: "success",
    Cancelled: "error",
  }[status] || "default");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const isSLABreached = (orderDate: string) => {
    const hours = (Date.now() - new Date(orderDate).getTime()) / 36e5;
    return hours > 24;
  };

  const bulkUpdateStatus = async (status: Order["status"]) => {
    try {
      const updated = await Promise.all(
        orders
          .filter((o) => selectedRowKeys.includes(o.id))
          .map((o) => updateOrder({ ...o, status }))
      );
      setOrders((prev) =>
        prev.map((o) => updated.find((u) => u.id === o.id) || o)
      );
      setSelectedRowKeys([]);
      toast.success("Bulk update successful");
    } catch {
      toast.error("Bulk update failed");
    }
  };

  const exportCSV = () => {
    const header = ["Order ID","Customer","Mobile","Product","Status","Amount","Courier"];
    const rows = orders.map(o => [
      o.id,
      o.customerName,
      o.customerMobile,
      o.items?.map(i=>i.productName).join(" | "),
      o.status,
      o.totalAmount,
      o.courier || ""
    ]);
    const csv = [header, ...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  const columns: TableProps<Order>["columns"] = [
    { title: "Order ID", dataIndex: "id", width: 110 },
    { title: "Customer", dataIndex: "customerName" },
    { title: "Mobile", dataIndex: "customerMobile", render: (m) => <Text strong>{m}</Text> },
    {
      title: "Product",
      dataIndex: "items",
      render: (items) => (
        <Text>{items?.[0]?.productName}{items?.length > 1 && ` +${items.length - 1} more`}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, _record) => (
        <Select size="small" value={status}>
          <Option value="Pending">Pending</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Courier",
      dataIndex: "courier",
      render: (_, record) => (
        <Select size="small" placeholder="Assign" defaultValue={record.courier}>
          <Option value="Pathao">Pathao</Option>
          <Option value="Steadfast">Steadfast</Option>
          <Option value="SundarBan">SundarBan</Option>
          <Option value="RedX">RedX</Option>
        </Select>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (v, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>৳ {v.toLocaleString()}</Text>
          {record.paymentMethod === "COD" && <Tag color="orange">COD</Tag>}
        </Space>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => setViewOrder(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title level={3}>📦 Order Management</Title>

      <Row gutter={16} className="mt-4">
        <Col md={6}><Card><Statistic title="Total Orders" value={orders.length} prefix={<ShoppingCartOutlined />} /></Card></Col>
        <Col md={6}><Card><Statistic title="Pending" value={orders.filter(o=>o.status==='Pending').length} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col md={6}><Card><Statistic title="Delivered" value={orders.filter(o=>o.status==='Delivered').length} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col md={6}><Card><Statistic title="Shipped" value={orders.filter(o=>o.status==='Shipped').length} prefix={<TruckOutlined />} /></Card></Col>
      </Row>

      <Card className="mt-6! rounded-2xl">
        <Row justify="space-between" className="mb-3">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={["All","Pending","Processing","Shipped","Delivered","Cancelled"].map(k=>({key:k,label:`${k} (${k==='All'?orders.length:orders.filter(o=>o.status===k).length})`}))}
          />
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>Export CSV</Button>
        </Row>

        {selectedRowKeys.length > 0 && (
          <Space className="mb-3">
            <Text strong>{selectedRowKeys.length} selected</Text>
            <Button onClick={() => bulkUpdateStatus("Shipped")}>Mark Shipped</Button>
            <Button onClick={() => bulkUpdateStatus("Delivered")}>Mark Delivered</Button>
          </Space>
        )}

        <Spin spinning={loading}>
          <Table
            rowKey="id"
            rowClassName={(record) => record.status === 'Pending' && isSLABreached(record.orderDate) ? 'bg-red-50' : ''}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={filteredOrders}
            pagination={{ pageSize: 8 }}
          />
        </Spin>
      </Card>

      <Modal open={!!viewOrder} onCancel={() => setViewOrder(null)} footer={null} width={820}>
        {viewOrder && (
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Customer & Delivery">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">{viewOrder.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Mobile">{viewOrder.customerMobile}</Descriptions.Item>
                  <Descriptions.Item label="Address">{viewOrder.shippingAddress}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Order & Payment">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Order ID">{viewOrder.id}</Descriptions.Item>
                  <Descriptions.Item label="Status"><Tag color={statusColor(viewOrder.status)}>{viewOrder.status}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Payment">{viewOrder.paymentMethod}</Descriptions.Item>
                  <Descriptions.Item label="Courier">{viewOrder.courier}</Descriptions.Item>
                  <Descriptions.Item label="Total">৳ {viewOrder.totalAmount}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;
