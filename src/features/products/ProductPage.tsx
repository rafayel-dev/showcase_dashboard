import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Typography,
  Input,
  Image,
  Select,
  Tag,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiGrid,
  FiList,
} from "react-icons/fi";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import ProductCard from "../../components/common/ProductCard";
import {
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../services/productService";
import toast from "../../utils/toast";

import InlineEditor from "../../components/common/InlineEditor";
import DiscountInlineEditor, { type DiscountData } from "../../components/common/DiscountInlineEditor";
import AppButton from "../../components/common/AppButton";
import dayjs from "dayjs";

import AppSpin from "../../components/common/AppSpin";
import AppCard from "../../components/common/AppCard";
import AppModal from "../../components/common/AppModal";
import AppPopconfirm from "../../components/common/AppPopconfirm";
const { Title, Text } = Typography;
const { Option } = Select;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [viewing, setViewing] = useState<Product | null>(null);

  // 📝 Inline Editing State
  const [editingId, setEditingId] = useState<{ id: string; field: "price" | "stock" | "discount" } | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // 🔍 Filters
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      setProducts(await fetchProducts());
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (record: Product, field: "price" | "stock" | "discount") => {
    setEditingId({ id: record.id, field });
    if (field === "price") setEditValue(record.price);
    else if (field === "stock") setEditValue(record.stock);
    // discount logic handled in render prop via initialValue
  };

  const cancelEdit = () => {
    setEditingId(null);
  };


  const saveDiscount = async (id: string, values: DiscountData) => {
    try {
      const product = products.find((p) => p.id === id);
      if (product) {
        const updated = { ...product };
        updated.hasDiscount = values.hasDiscount;

        if (values.hasDiscount) {
          updated.discountType = values.discountType;
          updated.discountValue = values.discountValue;
          if (values.discountRange) {
            updated.discountStartDate = values.discountRange[0].toISOString();
            updated.discountEndDate = values.discountRange[1].toISOString();
          }
        } else {
          updated.discountType = undefined;
          updated.discountValue = undefined;
          updated.discountStartDate = undefined;
          updated.discountEndDate = undefined;
        }

        await updateProduct(updated);
        toast.success("Discount updated!");
        setEditingId(null);
        loadProducts();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const product = products.find((p) => p.id === editingId.id);
      if (product) {
        let updated = { ...product };
        if (editingId.field === "price") {
          updated.price = editValue;
          toast.success("Price updated!");
        } else if (editingId.field === "stock") {
          updated.stock = editValue;
          // Status logic
          if (updated.stock === 0) updated.status = "Out of Stock";
          else if (product.status === "Out of Stock") updated.status = "In Stock";
          toast.success("Stock updated!");
        }

        await updateProduct(updated);
        setEditingId(null);
        loadProducts();
      }
    } catch {
      toast.error("Update failed.");
    }
  };

  const statusColor = (status: Product["status"]) => {
    const colors = { "In Stock": "success", "Out of Stock": "warning", "Discontinued": "error" };
    return colors[status] || "default";
  };

  // ✅ Filter logic
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.productName.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Product",
      dataIndex: "productName",
      render: (text, record) => (
        <Text strong className={record.stock < 5 ? "text-red-600" : ""}>{text}</Text>
      ),
    },
    { title: "Category", dataIndex: "category" },
    { title: "SKU", dataIndex: "sku" },
    {
      title: "Price",
      dataIndex: "price",
      align: "center",
      render: (_, record) =>
        editingId?.id === record.id && editingId.field === "price" ? (
          <InlineEditor
            value={editValue}
            onChange={(v) => setEditValue(Number(v))}
            onSave={saveEdit}
            onCancel={cancelEdit}
            widthClass="w-18"
          />
        ) : (
          <Space>
            <Text>৳ {record.price}</Text>
            <AppButton
              type="text"
              size="small"
              icon={<FiEdit />}
              onClick={() => startEdit(record, "price")}
            />
          </Space>
        ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      align: "center",
      render: (_, record) =>
        editingId?.id === record.id && editingId.field === "stock" ? (
          <InlineEditor
            value={editValue}
            onChange={(v) => setEditValue(Number(v))}
            onSave={saveEdit}
            onCancel={cancelEdit}
            widthClass="w-16"
          />
        ) : (
          <Space>
            <Text type={record.stock < 5 ? "danger" : undefined}>{record.stock}</Text>
            <AppButton
              type="text"
              size="small"
              icon={<FiEdit />}
              onClick={() => startEdit(record, "stock")}
            />
          </Space>
        ),
    },
    {
      title: "Discount",
      dataIndex: "discountValue",
      align: "center",
      render: (_, record) =>
        editingId?.id === record.id && editingId.field === "discount" ? (
          <div className="relative">
            <DiscountInlineEditor
              initialValue={{
                hasDiscount: !!record.hasDiscount,
                discountType: record.discountType || "percentage",
                discountValue: record.discountValue || 0,
                discountRange: (record.discountStartDate && record.discountEndDate)
                  ? [dayjs(record.discountStartDate), dayjs(record.discountEndDate)]
                  : undefined
              }}
              onSave={(val) => {
                // Immediate save trigger because the component passes full obj
                saveDiscount(record.id, val);
              }}
              onCancel={cancelEdit}
            />
          </div>
        ) : (
          <Space>
            <div className="flex flex-col items-center">
              <Text>
                {record.hasDiscount
                  ? `${record.discountValue}${record.discountType === "percentage" ? "%" : "৳"}`
                  : "-"}
              </Text>
              {record.hasDiscount && record.discountEndDate && (
                <Text type="secondary" className="text-[10px]!">
                  {dayjs(record.discountEndDate).format("DD MMM")}
                </Text>
              )}
            </div>
            <AppButton
              type="text"
              size="small"
              icon={<FiEdit />}
              onClick={() => startEdit(record, "discount")}
            />
          </Space>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor(s)}>{s}</Tag>,
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="View"><AppButton icon={<FiEye />} onClick={() => setViewing(record)} /></Tooltip>
          <Tooltip title="Edit"><AppButton icon={<FiEdit />} onClick={() => navigate(`/edit-product/${record.id}`)} /></Tooltip>
          <AppPopconfirm
            title="Delete?"
            okText="Yes"
            onConfirm={async () => {
              await deleteProduct(record.id);
              loadProducts();
            }}
          >
            <AppButton danger icon={<FiTrash2 />} />
          </AppPopconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AppCard className="rounded-2xl">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={3}>Product Management</Title>
            <Text type="secondary">Manage your ecommerce inventory</Text>
          </Col>
          <Col>
            <Space>
              <AppButton
                icon={viewMode === "table" ? <FiGrid /> : <FiList />}
                onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
              />
              <AppButton
                type="primary"
                icon={<FiPlus />}
                onClick={() => navigate("/add-product")}
              >
                Add Product
              </AppButton>
            </Space>
          </Col>
        </Row>

        {/* 🔍 Filters */}
        <Space className="mb-4">
          <Input.Search
            placeholder="Search product"
            allowClear
            style={{ width: 220 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Category"
            style={{ width: 180 }}
            onChange={(v) => setCategoryFilter(v)}
          >
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Space>

        {/* Content */}
        <AppSpin spinning={loading}>
          {viewMode === "table" ? (
            <Table
              columns={columns}
              dataSource={filteredProducts}
              rowKey="id"
              rowClassName={(record) => (record.stock < 5 ? "bg-red-50" : "")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </AppSpin>
      </AppCard>

      {/* View Modal */}
      <AppModal
        title="Product Details"
        width={700}
        open={!!viewing}
        footer={null}
        onCancel={() => setViewing(null)}
      >
        {viewing && (
          <>
            <Space direction="vertical" className="w-full">
              <Text><b>Name:</b> {viewing.productName}</Text>
              <Text><b>Category:</b> {viewing.category}</Text>
              <Text><b>Price:</b> ৳ {viewing.price}</Text>
              <Text><b>Stock:</b> {viewing.stock}</Text>
              <Text><b>Status:</b> <Tag color={statusColor(viewing.status)}>{viewing.status}</Tag></Text>
            </Space>
            <div className="mt-4">
              <Image.PreviewGroup>
                <Image src={viewing.imageUrl || ""} className="w-32! h-32!" />
              </Image.PreviewGroup>
            </div>
          </>
        )}
      </AppModal>
    </div>
  );
};

export default ProductPage;
