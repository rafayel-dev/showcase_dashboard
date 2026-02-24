import React, { useState } from "react";
import {
    Table,
    Space,
    Typography,
    Input,
    Image,
    Tag,
    Tooltip,
    Row,
    Col,
    Card,
    Avatar,
    Switch,
} from "antd";
import AppSelect from "../../../components/common/AppSelect";
import {
    FiEdit,
    FiEye,
    FiGrid,
    FiList,
    FiMoreVertical,
    FiPlus,
    FiTrash2
} from "react-icons/fi";
import type { TableProps } from "antd";
import AppButton from "../../../components/common/AppButton";
import AppModal from "../../../components/common/AppModal";
import toast from "../../../utils/toast";
import AppPopconfirm from "@/components/common/AppPopconfirm";

const { Title, Text, Paragraph } = Typography;
const { Option } = AppSelect;

// --- DUMMY DATA ---
const DUMMY_PRODUCTS = [
    {
        id: "LP-PROD-01",
        productName: "Premium Wireless Earbuds Pro",
        category: "Electronics",
        sku: "EAR-001",
        price: 2500,
        discountPrice: 1250,
        status: "Active",
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1632&auto=format&fit=crop",
        views: 1205,
        orders: 342,
    },
    {
        id: "LP-PROD-02",
        productName: "Smart Watch Series 7",
        category: "Wearables",
        sku: "WTC-007",
        price: 4500,
        discountPrice: 3200,
        status: "Active",
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1464&auto=format&fit=crop",
        views: 890,
        orders: 156,
    },
    {
        id: "LP-PROD-03",
        productName: "Running Shoes - Speed Pro",
        category: "Fashion",
        sku: "SH-SP-09",
        price: 3500,
        discountPrice: null,
        status: "Inactive",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop",
        views: 2300,
        orders: 89,
    },
];

const LandingProducts: React.FC = () => {
    const [viewMode, setViewMode] = useState<"table" | "card">("table");
    const [products, setProducts] = useState(DUMMY_PRODUCTS);
    const [searchText, setSearchText] = useState("");
    const [viewing, setViewing] = useState<any | null>(null);

    const handleDelete = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success("Product removed from landing list");
    };

    const statusColor = (status: string) => {
        return status === "Active" ? "success" : "error";
    };

    // Filter Logic
    const filteredProducts = products.filter(p =>
        p.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleStatusChange = (id: string, status: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const columns: TableProps<any>["columns"] = [
        {
            title: "Product",
            dataIndex: "productName",
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar shape="square" size={48} src={record.imageUrl} />
                    <div>
                        <Text strong className="block">{text}</Text>
                        <Text type="secondary" className="text-xs">{record.category}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (_, r) => (
                <div>
                    {r.discountPrice ? (
                        <div className="flex flex-col">
                            <Text strong>৳{r.discountPrice}</Text>
                            <Text delete type="secondary" className="text-xs">৳{r.price}</Text>
                        </div>
                    ) : (
                        <Text strong>৳{r.price}</Text>
                    )}
                </div>
            )
        },
        {
            title: "SKU",
            dataIndex: "sku",
        },
        {
            title: "Performance",
            render: (_, r) => (
                <div className="flex gap-4 text-xs">
                    <div>
                        <span className="block font-bold text-gray-700">{r.views}</span>
                        <span className="text-gray-400">Views</span>
                    </div>
                    <div>
                        <span className="block font-bold text-violet-600">{r.orders}</span>
                        <span className="text-gray-400">Orders</span>
                    </div>
                </div>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s, record) =>
                <>
                    <Switch
                        className="mr-2! bg-violet-500!"
                        checked={s === "Active"}
                        onChange={(checked) => {
                            if (checked) {
                                handleStatusChange(record.id, "Active");
                            } else {
                                handleStatusChange(record.id, "Inactive");
                            }
                        }}
                    />
                    <Tag color={statusColor(s)}>{s}</Tag>
                </>
        },
        {
            title: "Actions",
            align: "right",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit"><AppButton type="text" icon={<FiEdit size={20} className="text-violet-500!" />} /></Tooltip>
                    <AppPopconfirm
                        title="Remove Product"
                        description="Are you sure to remove this product?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <AppButton title="Remove" type="text" danger icon={<FiTrash2 size={20} />} />
                    </AppPopconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <Space>
                    <Input.Search
                        placeholder="Search products..."
                        allowClear
                        style={{ width: 280 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <AppSelect
                        placeholder="Category"
                        className="w-32"
                        options={[{ label: "Electronics", value: "Electronics" }, { label: "Fashion", value: "Fashion" }]}
                    />
                </Space>

                <Space>
                    <AppButton className="text-violet-500! border-violet-500!"
                        icon={viewMode === "table" ? <FiGrid /> : <FiList />}
                        onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
                    />
                    <AppButton type="primary" icon={<FiPlus />}>Add Product</AppButton>
                </Space>
            </div>

            {viewMode === "table" ? (
                <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden" bodyStyle={{ padding: 0 }}>
                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((p) => (
                        <Card key={p.id} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border-gray-100" bodyStyle={{ padding: 0 }}>
                            <div className="relative h-48 bg-gray-100">
                                <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3">
                                    <Tag color={statusColor(p.status)} className="m-0 bg-white/90 backdrop-blur border-none font-bold">{p.status}</Tag>
                                </div>
                            </div>
                            <div className="p-4">
                                <Text strong className="block text-lg mb-1 truncate">{p.productName}</Text>
                                <Text type="secondary" className="text-xs mb-3 block">{p.category}</Text>

                                <div className="flex justify-between items-end">
                                    <div>
                                        {p.discountPrice ? (
                                            <div className="flex items-baseline gap-2">
                                                <Text strong className="text-xl text-violet-600">৳{p.discountPrice}</Text>
                                                <Text delete type="secondary" className="text-sm">৳{p.price}</Text>
                                            </div>
                                        ) : (
                                            <Text strong className="text-xl text-violet-600">৳{p.price}</Text>
                                        )}
                                    </div>
                                    <AppButton className="border-none! shadow-none!" size="small" icon={<FiEdit size={20} className="text-violet-500!" />} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LandingProducts;
