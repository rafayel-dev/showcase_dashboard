import React, { useState } from "react";
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
    Badge,
    Avatar,
    Card,
    Select
} from "antd";
import AppSelect from "../../../components/common/AppSelect";
import AppModal from "../../../components/common/AppModal";
import type { TableProps } from "antd";
import {
    EyeOutlined,
    DownloadOutlined,
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
import { FiEdit, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import AppButton from "../../../components/common/AppButton";
import toast from "../../../utils/toast";
import { BASE_URL } from "../../../RTK/api";
import { color } from "jodit/esm/plugins/color/color";

const { Text, Title } = Typography;

// --- DUMMY DATA FOR UI FLOW ---
const DUMMY_ORDERS = [
    {
        id: "1",
        orderId: "ORD-7829",
        customerName: "Rahim Ahmed",
        customerMobile: "01712345678",
        address: "House 12, Road 5, Dhanmondi, Dhaka",
        productName: "Premium Wireless Earbuds Pro",
        quantity: 1,
        price: 1250,
        totalAmount: 1310,
        sku: "SH-SP-09",
        status: "Pending",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Unpaid",
        orderDate: "2024-02-08T10:00:00Z",
    },
    {
        id: "2",
        orderId: "ORD-7830",
        customerName: "Karim Uddin",
        customerMobile: "01812345678",
        address: "Flat 4B, Uttara Sector 7, Dhaka",
        productName: "Smart Watch Ultra",
        quantity: 2,
        price: 3500,
        totalAmount: 7120,
        sku: "SH-SP-09",
        status: "Confirmed",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Unpaid",
        orderDate: "2024-02-07T14:30:00Z",
    },
    {
        id: "3",
        orderId: "ORD-7831",
        customerName: "Salma Begum",
        customerMobile: "01912345678",
        address: "Mirpur 10, Dhaka",
        productName: "Premium Wireless Earbuds Pro",
        quantity: 1,
        price: 1250,
        totalAmount: 1310,
        sku: "SH-SP-09",
        status: "Delivered",
        paymentMethod: "Bkash",
        paymentStatus: "Paid",
        orderDate: "2024-02-05T09:15:00Z",
    },
    {
        id: "4",
        orderId: "ORD-7832",
        customerName: "Tanvir Hasan",
        customerMobile: "01612345678",
        address: "Banani, Dhaka",
        productName: "Gaming Headset",
        quantity: 1,
        price: 2200,
        totalAmount: 2260,
        sku: "SH-SP-09",
        status: "Cancelled",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Unpaid",
        orderDate: "2024-02-06T11:00:00Z",
    },
];

const LandingOrders: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("All");
    const [orders, setOrders] = useState(DUMMY_ORDERS);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [viewOrder, setViewOrder] = useState<any | null>(null);
    const [searchText, setSearchText] = useState("");

    const statusColor = (status: string) =>
        ({
            Pending: "orange",
            Processing: "blue",
            Confirmed: "cyan",
            Shipped: "geekblue",
            Delivered: "green",
            Cancelled: "red",
            Returned: "purple",
        })[status] || "default";

    // Filter Logic
    const filteredOrders = orders.filter((order) => {
        const matchesTab = activeTab === "All" || order.status === activeTab;
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
            order.customerMobile.includes(searchText) ||
            order.orderId.toLowerCase().includes(searchText.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleStatusChange = (id: string, newStatus: string) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        toast.success(`Order status updated to ${newStatus}`);
    };

    const columns: TableProps<any>["columns"] = [
        {
            title: "Order Info",
            dataIndex: "orderId",
            render: (id, r) => (
                <div className="flex flex-col">
                    <Text strong className="text-violet-600">{id}</Text>
                    <Text type="secondary" className="text-xs">{new Date(r.orderDate).toLocaleDateString()}</Text>
                </div>
            ),
        },
        {
            title: "Customer",
            dataIndex: "customerName",
            render: (name, r) => (
                <div className="flex flex-col">
                    <Text strong>{name}</Text>
                    <Text type="secondary" className="text-xs flex items-center gap-1"><PhoneOutlined /> {r.customerMobile}</Text>
                </div>
            ),
        },
        {
            title: "Product",
            dataIndex: "productName",
            render: (name, r) => (
                <div>
                    <Badge count={r.quantity} style={{ backgroundColor: '#52c41a' }} offset={[10, 0]}>
                        <Text>{name}</Text>
                    </Badge>
                </div>
            ),
        },
        {
            title: "Total",
            dataIndex: "totalAmount",
            render: (amount) => <Text strong>৳{amount}</Text>,
        },
        {
            title: "SKU",
            dataIndex: "sku",
            render: (sku) => <Text>{sku}</Text>,
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            render: (status, r) => (
                <div>
                    <Tag color={statusColor(status)}>{status}</Tag>
                    <AppSelect
                        value={status}
                        onChange={(val) => handleStatusChange(r.id, val)}
                        options={["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => ({ label: s, value: s }))}
                        className="w-28"
                        bordered={false}
                        suffixIcon={<FiEdit size={14} className="text-gray-800" />}
                    >
                    </AppSelect>

                </div>


            ),
        },
        {
            title: "Actions",
            align: "right",
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <AppButton type="text" icon={<EyeOutlined className="text-violet-600! text-xl!" />} onClick={() => setViewOrder(record)} />
                    </Tooltip>
                    <Tooltip title="Download Invoice">
                        <AppButton type="text" icon={<DownloadOutlined className="text-violet-600! text-xl!" />} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="w-full md:w-auto"
                    items={["All", "Pending", "Confirmed", "Delivered", "Cancelled"].map((k) => ({
                        key: k,
                        label: (
                            <span className="flex items-center gap-2">
                                {k}
                                <Badge count={orders.filter(o => k === "All" || o.status === k).length} showZero style={{ backgroundColor: '#f3f4f6', color: '#9ca3af' }} />
                            </span>
                        ),
                    }))}
                />

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 transition-colors"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredOrders}
                    pagination={{ pageSize: 5 }}
                    className="landing-orders-table"
                />
            </Card>

            {/* View Modal */}
            <AppModal open={!!viewOrder} footer={null} onCancel={() => setViewOrder(null)} width={800} title="Order Details">
                {viewOrder && (
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className={`p-4 rounded-xl flex justify-between items-center ${viewOrder.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            <div>
                                <Text strong className="block text-lg">Order #{viewOrder.orderId}</Text>
                                <Text className="opacity-80">Placed on {new Date(viewOrder.orderDate).toLocaleString()}</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text strong>Payment Status</Text>
                                <Text>{viewOrder.paymentStatus}</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text strong>Payment Method</Text>
                                <Text>{viewOrder.paymentMethod}</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text strong>Order Status</Text>
                                <Tag color={statusColor(viewOrder.status)} className="text-sm px-3 py-1 rounded-full uppercase font-bold">{viewOrder.status}</Tag>

                            </div>

                        </div>

                        <Row gutter={24}>
                            <Col span={14}>
                                <Card title="Items" className="shadow-sm rounded-xl h-full">
                                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg"></div> {/* Placeholder Img */}
                                            <div>
                                                <Text strong className="block">{viewOrder.productName}</Text>
                                                <Text type="secondary">Unit Price: ৳{viewOrder.price}</Text>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Text strong>x{viewOrder.quantity}</Text>
                                            <Text strong className="block text-lg">৳{viewOrder.price * viewOrder.quantity}</Text>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>৳{viewOrder.price * viewOrder.quantity}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Delivery Fee</span>
                                            <span>৳{viewOrder.totalAmount - (viewOrder.price * viewOrder.quantity)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                            <span>Total</span>
                                            <span>৳{viewOrder.totalAmount}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col span={10}>
                                <Card title="Customer Details" className="shadow-sm rounded-xl h-full">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start gap-3">
                                            <UserOutlined className="mt-1 text-gray-400" />
                                            <div>
                                                <Text className="block text-gray-500 text-xs uppercase">Customer</Text>
                                                <Text strong>{viewOrder.customerName}</Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <PhoneOutlined className="mt-1 text-gray-400" />
                                            <div>
                                                <Text className="block text-gray-500 text-xs uppercase">Phone</Text>
                                                <Text strong>{viewOrder.customerMobile}</Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <EnvironmentOutlined className="mt-1 text-gray-400" />
                                            <div>
                                                <Text className="block text-gray-500 text-xs uppercase">Delivery Address</Text>
                                                <Text>{viewOrder.address}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </AppModal>
        </div>
    );
};

// Helper for Icon
const FilterButtonIcon = () => <FiFilter />;

export default LandingOrders;
