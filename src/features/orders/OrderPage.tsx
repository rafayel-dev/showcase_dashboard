import React, { useMemo, useState } from "react";
import {
  Table,
  Space,
  Tag,
  Typography,
  Descriptions,
  Row,
  Col,
  Tabs,
  Tooltip,
  Switch,
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
  RollbackOutlined,
} from "@ant-design/icons";
import { FiEdit } from "react-icons/fi";
import AppButton from "../../components/common/AppButton";
import type { Order } from "../../types";
import { useGetOrdersQuery, useUpdateOrderMutation } from "../../RTK/order/orderApi";
import toast from "../../utils/toast";
import InlineEditor from "../../components/common/InlineEditor";
import StatsCard from "../../components/common/StatsCard";
import AppSpin from "@/components/common/AppSpin";
import { BASE_URL } from "@/RTK/api";

const { Title, Text } = Typography;

const OrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: ordersData, isLoading: loading } = useGetOrdersQuery({ page, limit: pageSize }, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });

  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;
  const pendingOrders = ordersData?.pending || 0;
  const processingOrders = ordersData?.processing || 0;
  const confirmedOrders = ordersData?.confirmed || 0;
  const shippedOrders = ordersData?.shipped || 0;
  const deliveredOrders = ordersData?.delivered || 0;
  const cancelledOrders = ordersData?.cancelled || 0;
  const returnedOrders = ordersData?.returned || 0;

  const [updateOrder] = useUpdateOrderMutation();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Bulk update states
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<Order["status"] | null>(null);
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
    if (!bulkUpdateStatus && !bulkUpdatePaymentStatus) {
      toast.error("Please select at least one field to update.");
      return;
    }

    try {
      const updates = selectedRowKeys.map((id) => {
        const payload: any = { id: id.toString() };
        if (bulkUpdateStatus) payload.status = bulkUpdateStatus;
        if (bulkUpdatePaymentStatus) payload.paymentStatus = bulkUpdatePaymentStatus;
        return updateOrder(payload).unwrap();
      });
      await Promise.all(updates);
      toast.success("Bulk update successful!");
      setSelectedRowKeys([]);
      setBulkUpdateStatus(null);
      setBulkUpdatePaymentStatus(null);
    } catch {
      toast.error("Bulk update failed.");
    }
  };

  const statusColor = (status: Order["status"]) =>
    ({
      Pending: "orange",
      Processing: "processing",
      Confirmed: "cyan",
      Shipped: "geekblue",
      Delivered: "success",
      Cancelled: "error",
      Returned: "purple",
    })[status] || "default";

  const paymentStatusColor = (status: Order["paymentStatus"]) =>
    ({ Paid: "success", Unpaid: "error", Refunded: "purple" })[status] || "default";

  // Note: Client-side filtering is limited to current page. 
  // For full support, backend filtering parameters should be added.
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
            options={["Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(v => ({ value: v, label: v }))}
            widthClass="w-26"
          />
        ) : (
          <Space>
            <Tag color={statusColor(status)}>{status}</Tag>
            <AppButton size="small" type="text" icon={<FiEdit />} onClick={() => startEdit(record, "status")} />
          </Space>
        ),
    },
    {
      title: "Confirmed",
      dataIndex: "status",
      align: "center",
      render: (status, record) => (
        <Switch
          className="bg-violet-500!"
          checked={["Confirmed", "Shipped", "Delivered", "Returned", "Processing", "Cancelled"].includes(status)}
          disabled={["Processing", "Shipped", "Delivered", "Returned", "Cancelled", "Confirmed"].includes(status)}
          onChange={(checked) => {
            if (checked) {
              updateOrder({ id: record.id, status: "Confirmed" }).unwrap()
                .then(() => toast.success("Order Confirmed!"))
                .catch(() => toast.error("Failed to confirm order"));
            } else {
              updateOrder({ id: record.id, status: "Pending" }).unwrap()
                .then(() => toast.success("Order Unconfirmed"))
                .catch(() => toast.error("Failed to unconfirm order"));
            }
          }}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
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
            options={["Paid", "Unpaid", "Refunded"].map(v => ({ value: v, label: v }))}
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
              const API_URL = import.meta.env.VITE_API_URL || BASE_URL;
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
      <Row
        gutter={10}
        className="mt-4 flex-wrap!"
        justify="space-between"
        style={{
          flexWrap: "wrap",
          overflowX: "auto",
        }}
      >
        {[
          { title: "Total Orders", value: totalOrders, icon: <ShoppingCartOutlined className="text-violet-500! mr-2!" /> },
          { title: "Pending", value: pendingOrders, icon: <HistoryOutlined className="text-amber-500! mr-2!" /> },
          { title: "Processing", value: processingOrders, icon: <FieldTimeOutlined className="text-blue-500! mr-2!" /> },
          { title: "Confirmed", value: confirmedOrders, icon: <CheckCircleOutlined className="text-cyan-500! mr-2!" /> },
          { title: "Shipped", value: shippedOrders, icon: <TruckOutlined className="text-indigo-500! mr-2!" /> },
          { title: "Delivered", value: deliveredOrders, icon: <CheckCircleOutlined className="text-green-500! mr-2!" /> },
          { title: "Cancelled", value: cancelledOrders, icon: <CloseCircleOutlined className="text-red-500! mr-2!" /> },
          { title: "Returned", value: returnedOrders, icon: <RollbackOutlined className="text-purple-500! mr-2!" /> },
        ].map((stat) => (
          <Col
            key={stat.title}
            flex="1"
            style={{
              minWidth: 120,
              maxWidth: 200,
            }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
            />
          </Col>
        ))}
      </Row>

      <AppCard className="mt-6!">
        <Tabs
          activeKey={activeTab}
          size="small"
          onChange={setActiveTab}
          items={["All", "Pending", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled", "Returned"].map((k) => ({
            key: k,
            label: k,
          }))}
        />

        <AppSpin spinning={loading}>
          {selectedRowKeys.length > 0 && (
            <div className="mb-4 flex items-center space-x-2!">
              <Text strong>Update:</Text>
              <AppSelect placeholder="Status" className="w-[120px]" onChange={setBulkUpdateStatus} value={bulkUpdateStatus} allowClear options={["Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(v => ({ value: v, label: v }))} />
              <AppSelect placeholder="Payment" className="w-[140px]" onChange={setBulkUpdatePaymentStatus} value={bulkUpdatePaymentStatus} allowClear options={["Paid", "Unpaid", "Refunded"].map(v => ({ value: v, label: v }))} />
              <AppButton type="primary" onClick={handleBulkUpdate}>Apply</AppButton>
            </div>
          )}
          <Table
            rowKey="id"
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            rowClassName={(r) => r.status === "Pending" && isSLABreached(r.orderDate) ? "bg-red-50!" : ""}
            columns={columns}
            dataSource={filteredOrders}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalOrders,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
              position: ["bottomRight"],
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              }
            }}
          />
        </AppSpin>
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
                    <Descriptions.Item label="Payment Method">{viewOrder.paymentMethod}</Descriptions.Item>
                    <Descriptions.Item label="Payment Status"><Tag color={paymentStatusColor(viewOrder.paymentStatus)}>{viewOrder.paymentStatus}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Delivery Charge">৳ {viewOrder.deliveryCharge?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Discount">
                      <Text type="success">
                        - ৳ {Math.max(0, ((viewOrder.itemsPrice || 0) + (viewOrder.deliveryCharge || 0)) - (viewOrder.totalAmount || 0)).toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Amount">৳ {viewOrder.totalAmount?.toLocaleString()}</Descriptions.Item>
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
                      { title: "SKU", dataIndex: "sku", render: v => <Text type="secondary">{v || "—"}</Text> },
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
          </>
        )}
      </AppModal>
    </div>
  );
};

export default OrderPage;
