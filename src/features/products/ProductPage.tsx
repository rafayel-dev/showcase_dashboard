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
} from "antd";
import AppSelect from "../../components/common/AppSelect";
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
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../RTK/product/productApi";
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
const { Option } = AppSelect;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();

  // RTK Query Hooks
  const { data: products = [], isLoading: loading } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [viewing, setViewing] = useState<Product | null>(null);

  // 📝 Inline Editing State
  const [editingId, setEditingId] = useState<{ id: string; field: "price" | "stock" | "discount" } | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // 🔍 Filters
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

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
        // Prepare the payload (only fields that need updating)
        const discountPayload: any = {
          id: product.id,
          hasDiscount: values.hasDiscount,
        };

        if (values.hasDiscount) {
          discountPayload.discountType = values.discountType;
          discountPayload.discountValue = values.discountValue;
          if (values.discountRange) {
            discountPayload.discountStartDate = values.discountRange[0].toISOString();
            discountPayload.discountEndDate = values.discountRange[1].toISOString();
          }
        } else {
          // We need to explicitly clear these if untoggling discount
          // The backend update logic should handle clearing if we send some indicator or empty values
          // For this specific backend implementation, sending the fields to be cleared might vary.
          // Since backend uses Object.assign, explicit null/undefined might be needed if Mongoose schema allows it.
          // For now, let's send explicit updates.
          discountPayload.hasDiscount = false;
          discountPayload.discountType = undefined;
          discountPayload.discountValue = undefined;
          discountPayload.discountStartDate = undefined;
          discountPayload.discountEndDate = undefined;
        }

        await updateProduct(discountPayload).unwrap();
        toast.success("Discount updated successfully!");
        setEditingId(null);
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
        let updatedPayload: any = { id: product.id };

        if (editingId.field === "price") {
          updatedPayload.price = editValue;
          toast.success("Price updated!");
        } else if (editingId.field === "stock") {
          updatedPayload.stock = editValue;

          // Status logic recalculation
          // Note: Backend might not auto-calculate status unless we explicitly tell it or have pre-save hooks
          // Let's optimize it on client side for the payload
          if (editValue === 0) updatedPayload.status = "Out of Stock";
          else if (product.status === "Out of Stock" && editValue > 0) updatedPayload.status = "In Stock";

          toast.success("Stock updated!");
        }

        await updateProduct(updatedPayload).unwrap();
        setEditingId(null);
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
    const isPublished = p.isPublished !== false; // Show only published products
    const matchSearch = p.productName?.toLowerCase().includes(searchText.toLowerCase()); // Added optional chaining
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
    return isPublished && matchSearch && matchCategory;
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
            widthClass="w-10!"
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
            widthClass="w-10!"
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
            title="Delete this product?"
            okText="Yes"
            onConfirm={async () => {
              try {
                await deleteProduct(record.id).unwrap();
                toast.success("Product deleted successfully");
              } catch {
                toast.error("Failed to delete product");
              }
            }}
          >
            <AppButton danger title="Delete" icon={<FiTrash2 />} loading={isDeleting} />
          </AppPopconfirm>
        </Space>
      ),
    },
  ];

  // Derive simple unique categories for filter
  const uniqueCategories = products.length
    ? [...new Set(products.map((p) => p.category))].filter(Boolean)
    : [];

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
          <AppSelect
            allowClear
            placeholder="Category"
            className="w-[180px]"
            onChange={(v) => setCategoryFilter(v)}
          >
            {uniqueCategories.map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </AppSelect>
        </Space>

        {/* Content */}
        <AppSpin spinning={loading}>
          {viewMode === "table" ? (
            <Table
              columns={columns}
              dataSource={filteredProducts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              rowClassName={(record) => (record.stock < 5 ? "bg-red-50" : "")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onView={() => setViewing(p)} />
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
                <div className="flex flex-wrap gap-2">
                  {viewing.imageUrls && viewing.imageUrls.length > 0 ? (
                    viewing.imageUrls.map((url, idx) => (
                      <Image
                        key={`${idx}-${url}`}
                        src={url.startsWith('/') ? `http://localhost:5000${url}` : url}
                        className="w-22! h-22! object-cover rounded shadow-sm"
                      />
                    ))
                  ) : (
                    <Image
                      src={viewing.imageUrl?.startsWith('/') ? `http://localhost:5000${viewing.imageUrl}` : viewing.imageUrl || ""}
                      className="w-22! h-22! object-cover rounded shadow-sm"
                    />
                  )}
                </div>
              </Image.PreviewGroup>
            </div>
          </>
        )}
      </AppModal>
    </div>
  );
};

export default ProductPage;
