import React, { useMemo, useState } from "react";
import {
  Table,
  Space,
  Tag,
  Typography,
  Descriptions,
  Spin,
  Row,
  Col,
  Tabs,
  Tooltip,
} from "antd";
import AppSelect from "../../components/common/AppSelect";
import AppModal from "../../components/common/AppModal";
import AppCard from "../../components/common/AppCard";
import type { TableProps } from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  HistoryOutlined,
  FieldTimeOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { FiEdit } from "react-icons/fi";
import AppButton from "../../components/common/AppButton";
import type { Order } from "../../types";
import { useGetOrdersQuery, useUpdateOrderMutation } from "../../RTK/order/orderApi";
import toast from "../../utils/toast";
import InlineEditor from "../../components/common/InlineEditor";
import StatsCard from "../../components/common/StatsCard";

const { Title, Text } = Typography;

const OrderPage: React.FC = () => {
  const { data: orders = [], isLoading: loading } = useGetOrdersQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });
  const [updateOrder] = useUpdateOrderMutation();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Bulk update states
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<Order["status"] | null>(null);
  const [bulkUpdateCourier, setBulkUpdateCourier] = useState<Order["courier"] | null>(null);
  const [bulkUpdatePaymentStatus, setBulkUpdatePaymentStatus] = useState<Order["paymentStatus"] | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<any>(null);

  /* === Inline Edit Handlers === */
  const startEdit = (order: Order, field: string) => {
    setEditingId({ id: order.id, field });
    setEditValue(order[field as keyof Order]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const order = orders.find(o => o.id === editingId.id);
      if (order) {
        await updateOrder({ id: order.id, [editingId.field]: editValue }).unwrap();
        toast.success(`${editingId.field} updated!`);
        setEditingId(null);
      }
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkUpdateStatus && !bulkUpdateCourier && !bulkUpdatePaymentStatus) {
      toast.error("Please select at least one field to update.");
      return;
    }

    try {
      const updates = selectedRowKeys.map((id) => {
        const payload: any = { id: id.toString() };
        if (bulkUpdateStatus) payload.status = bulkUpdateStatus;
        if (bulkUpdateCourier) payload.courier = bulkUpdateCourier;
        if (bulkUpdatePaymentStatus) payload.paymentStatus = bulkUpdatePaymentStatus;
        return updateOrder(payload).unwrap();
      });
      await Promise.all(updates);
      toast.success("Bulk update successful!");
      setSelectedRowKeys([]);
      setBulkUpdateStatus(null);
      setBulkUpdateCourier(null);
      setBulkUpdatePaymentStatus(null);
    } catch {
      toast.error("Bulk update failed.");
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
    ({ Paid: "success", Unpaid: "error" })[status] || "default";

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const isSLABreached = (orderDate: string) => {
    const hours = (Date.now() - new Date(orderDate).getTime()) / 36e5;
    return hours > 24;
  };

  const columns: TableProps<Order>["columns"] = [
    { title: "Order ID", dataIndex: "orderId", width: 120, render: (v, r) => v || r.id },
    { title: "Customer", dataIndex: "customerName" },
    { title: "Mobile", dataIndex: "customerMobile", render: (m) => <Text>{m}</Text> },
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
        editingId?.id === record.id && editingId.field === "status" ? (
          <InlineEditor
            type="select"
            value={editValue}
            onChange={setEditValue}
            onSave={saveEdit}
            onCancel={cancelEdit}
            options={["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(v => ({ value: v, label: v }))}
            widthClass="w-28"
          />
        ) : (
          <Space>
            <Tag color={statusColor(status)}>{status}</Tag>
            <AppButton size="small" type="text" icon={<FiEdit />} onClick={() => startEdit(record, "status")} />
          </Space>
        ),
    },
    {
      title: "Courier",
      dataIndex: "courier",
      render: (courier, record) =>
        editingId?.id === record.id && editingId.field === "courier" ? (
          <InlineEditor
            type="select"
            value={editValue}
            onChange={setEditValue}
            onSave={saveEdit}
            onCancel={cancelEdit}
            options={["Pathao", "Steadfast", "RedX"].map(v => ({ value: v, label: v }))}
            widthClass="w-24"
          />
        ) : (
          <Space>
            {courier}
            <AppButton size="small" type="text" icon={<FiEdit />} onClick={() => startEdit(record, "courier")} />
          </Space>
        ),
    },
    { title: "Payment", dataIndex: "paymentMethod" },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (pStatus, record) =>
        editingId?.id === record.id && editingId.field === "paymentStatus" ? (
          <InlineEditor
            type="select"
            value={editValue}
            onChange={setEditValue}
            onSave={saveEdit}
            onCancel={cancelEdit}
            options={["Paid", "Unpaid"].map(v => ({ value: v, label: v }))}
            widthClass="w-20"
          />
        ) : (
          <Space>
            <Tag color={paymentStatusColor(pStatus)}>{pStatus}</Tag>
            <AppButton size="small" type="text" icon={<FiEdit />} onClick={() => startEdit(record, "paymentStatus")} />
          </Space>
        ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (v) => <Text strong>৳ {v.toLocaleString()}</Text>,
    },
    {
      title: "Action",
      align: "right",
      render: (_, record) => (
        <div className="flex gap-0!">
          <AppButton type="link" className="font-semibold! text-violet-500! pr-1!" icon={<EyeOutlined />} onClick={() => setViewOrder(record)}>View</AppButton>
          <Tooltip title="Download Invoice">
            <AppButton type="link" icon={<DownloadOutlined className="text-xl!" />} className="text-gray-500! hover:text-violet-500!" onClick={() => {
              const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              window.open(`${API_URL}/orders/${record.id}/invoice`, "_blank");
            }} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title level={3}>📦 Order Management</Title>
      <Row gutter={16} className="mt-4">
        {[
          { title: "Total Orders", value: orders.length, icon: <ShoppingCartOutlined className="text-violet-500! mr-2!" /> },
          { title: "Pending", value: orders.filter(o => o.status === "Pending").length, icon: <HistoryOutlined className="text-[#f59e0b]! mr-2!" /> },
          { title: "Processing", value: orders.filter(o => o.status === "Processing").length, icon: <FieldTimeOutlined className="text-[#3b82f6]! mr-2!" /> },
          { title: "Shipped", value: orders.filter(o => o.status === "Shipped").length, icon: <TruckOutlined className="text-[#6366f1]! mr-2!" /> },
          { title: "Delivered", value: orders.filter(o => o.status === "Delivered").length, icon: <CheckCircleOutlined className="text-[#22c55e]! mr-2!" /> },
          { title: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length, icon: <CloseCircleOutlined className="text-[#ef4444]! mr-2!" /> }
        ].map((stat, i) => (
          <Col md={4} key={i}>
            <StatsCard title={stat.title} value={stat.value} prefix={stat.icon} />
          </Col>
        ))}
      </Row>

      <AppCard className="mt-6!">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((k) => ({
            key: k,
            label: `${k} (${k === "All" ? orders.length : orders.filter((o) => o.status === k).length})`,
          }))}
        />

        <Spin spinning={loading}>
          {selectedRowKeys.length > 0 && (
            <div className="mb-4 flex items-center space-x-2!">
              <Text strong>Update:</Text>
              <AppSelect placeholder="Status" className="w-[120px]" onChange={setBulkUpdateStatus} value={bulkUpdateStatus} allowClear options={["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(v => ({ value: v, label: v }))} />
              <AppSelect placeholder="Courier" className="w-[120px]" onChange={setBulkUpdateCourier} value={bulkUpdateCourier} allowClear options={["Pathao", "Steadfast", "RedX"].map(v => ({ value: v, label: v }))} />
              <AppSelect placeholder="Payment" className="w-[140px]" onChange={setBulkUpdatePaymentStatus} value={bulkUpdatePaymentStatus} allowClear options={["Paid", "Unpaid"].map(v => ({ value: v, label: v }))} />
              <AppButton type="primary" onClick={handleBulkUpdate}>Apply</AppButton>
            </div>
          )}
          <Table
            rowKey="id"
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            rowClassName={(r) => r.status === "Pending" && isSLABreached(r.orderDate) ? "bg-red-50" : ""}
            columns={columns}
            dataSource={filteredOrders}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </AppCard>

      <AppModal open={!!viewOrder} footer={null} onCancel={() => setViewOrder(null)} width={900} title="Order Details">
        {viewOrder && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <AppCard title="Customer & Delivery">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">{viewOrder.customerName}</Descriptions.Item>
                    <Descriptions.Item label="Mobile">{viewOrder.customerMobile}</Descriptions.Item>
                    <Descriptions.Item label="Email">{viewOrder.customerEmail}</Descriptions.Item>
                    <Descriptions.Item label="District">{viewOrder.customerDistrict}</Descriptions.Item>
                    <Descriptions.Item label="Address">{viewOrder.shippingAddress}</Descriptions.Item>
                  </Descriptions>
                </AppCard>
              </Col>
              <Col span={12}>
                <AppCard title="Order & Payment">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Order ID">{viewOrder.orderId}</Descriptions.Item>
                    <Descriptions.Item label="Order Status"><Tag color={statusColor(viewOrder.status)}>{viewOrder.status}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Payment Method">{viewOrder.paymentMethod.toUpperCase()}</Descriptions.Item>
                    <Descriptions.Item label="Payment Status"><Tag color={paymentStatusColor(viewOrder.paymentStatus)}>{viewOrder.paymentStatus}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Courier">{viewOrder.courier}</Descriptions.Item>
                  </Descriptions>
                </AppCard>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={24}>
                <AppCard title="🛒 Ordered Products">
                  <Table
                    size="small"
                    pagination={false}
                    columns={[
                      { title: "Product Name", dataIndex: "productName", render: v => <Text strong>{v}</Text> },
                      { title: "SKU", dataIndex: "sku", render: v => <Text>{v || "—"}</Text> },
                      { title: "Size", dataIndex: "size", align: "center", render: s => s?.length ? s.join(", ") : "—" },
                      { title: "Color", dataIndex: "color", align: "center", render: c => c?.length ? c.join(", ") : "—" },
                      { title: "Price", dataIndex: "price", align: "right", render: v => `৳ ${v}` },
                      { title: "Qty", dataIndex: "quantity", align: "center" },
                      { title: "Subtotal", align: "right", render: (_, r) => `৳ ${r.price * r.quantity}` },
                    ]}
                    dataSource={viewOrder.items}
                    rowKey={(r) => r.productId}
                  />
                </AppCard>
              </Col>
            </Row>
            <Row className="mt-4" justify="end">
              <Col span={6}>
                <AppCard>
                  <Space>
                    <Text>Delivery Charge: ৳ {viewOrder.deliveryCharge}</Text>
                  </Space>
                  <Space>
                    <Text strong style={{ fontSize: "16px" }}>Grand Total: ৳ {viewOrder.totalAmount}</Text>
                  </Space>
                </AppCard>
              </Col>
            </Row>
          </>
        )}
      </AppModal>
    </div>
  );
};

export default OrderPage;
