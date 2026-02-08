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
  Form,
  InputNumber,
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
import { BASE_URL } from "../../RTK/api";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import ProductCard from "../../components/common/ProductCard";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../RTK/product/productApi";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "../../RTK/setting/settingApi";
import toast from "../../utils/toast";

import InlineEditor from "../../components/common/InlineEditor";
import DiscountInlineEditor, { type DiscountData } from "../../components/common/DiscountInlineEditor";
import AppButton from "../../components/common/AppButton";
import dayjs from "dayjs";

import AppSpin from "../../components/common/AppSpin";
import AppCard from "../../components/common/AppCard";
import AppModal from "../../components/common/AppModal";
import AppPopconfirm from "../../components/common/AppPopconfirm";
const { Title, Text, Paragraph } = Typography;
const { Option } = AppSelect;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // RTK Query Hooks
  const { data: productsData, isLoading: loading } = useGetProductsQuery({ page, limit: pageSize }, {
    refetchOnMountOrArgChange: true
  });

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [viewing, setViewing] = useState<Product | null>(null);

  // � Delivery Charge Modal State
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryForm] = Form.useForm();

  // Settings Queries
  const { data: deliverySetting } = useGetSettingQuery("delivery_charge");
  const [updateSetting, { isLoading: isUpdatingSettings }] = useUpdateSettingMutation();

  // �📝 Inline Editing State
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

  // ✅ Filter logic (Client-side, on current page only)
  const filteredProducts = products.filter((p) => {
    const isPublished = p.isPublished !== false; // Show only published products
    const lowerSearch = searchText.toLowerCase();
    const matchSearch =
      p.productName?.toLowerCase().includes(lowerSearch) ||
      p.sku?.toLowerCase().includes(lowerSearch);
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
    return isPublished && matchSearch && matchCategory;
  });

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (url) => (
        <img
          src={
            url?.startsWith("http")
              ? url
              : url ? `${BASE_URL}${url}` : "https://placehold.co/40x40"
          }
          alt="Product"
          className="w-10 h-10 object-cover rounded border border-gray-200"
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      render: (text, record) => (
        <Text strong className={record.stock < 5 ? "text-red-600" : ""}>
          {text}
        </Text>
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
            widthClass="w-16!"
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
            widthClass="w-16!"
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
      render: (_, record) => (
        <DiscountInlineEditor
          initialValue={{
            hasDiscount: Boolean(record.hasDiscount),
            discountType: record.discountType ?? "percentage",
            discountValue: record.discountValue ?? 0,
            discountRange:
              record.discountStartDate && record.discountEndDate
                ? [
                  dayjs(record.discountStartDate),
                  dayjs(record.discountEndDate),
                ]
                : undefined,
          }}
          onSave={(val) => saveDiscount(record.id, val)}
          price={record.price}
        >
          <Space align="center" className="w-full justify-center">
            <div className="flex flex-col items-center leading-tight">
              <Text>
                {record.hasDiscount
                  ? `${record.discountValue}${record.discountType === "percentage" ? "%" : "৳"
                  }`
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
        </DiscountInlineEditor>
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

  // Derive simple unique categories for filter (CURRENT PAGE ONLY)
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
                onClick={() => {
                  if (deliverySetting?.value) {
                    deliveryForm.setFieldsValue(deliverySetting.value);
                  }
                  setIsDeliveryModalOpen(true);
                }}
              >
                Delivery Charge
              </AppButton>
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
            placeholder="Search product (this page)"
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
              pagination={{
                current: page,
                pageSize: pageSize,
                total: totalProducts,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
                onChange: (p, ps) => {
                  setPage(p);
                  setPageSize(ps);
                },
                position: ["bottomRight"]
              }}
              rowClassName={(record) => (record.stock < 5 ? "bg-red-50" : "")}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onView={() => setViewing(p)}
                    onEdit={() => navigate(`/edit-product/${p.id}`)}
                  />
                ))}
              </div>
              <Row justify="center" className="mt-6">
                <Table
                  // Hidden table just for pagination controls when in card view - or we can use AntD Pagination directly
                  // Using AntD Pagination component is cleaner for Grid view
                  className="hidden"
                />
                <div className="flex justify-center w-full mt-4">
                  {/* Simplified Pagination for Card View */}
                  <Space>
                    <AppButton disabled={page === 1} onClick={() => setPage(p => p - 1)}>&lt; Prev</AppButton>
                    <Text>Page {page} of {Math.ceil(totalProducts / pageSize)}</Text>
                    <AppButton disabled={page >= Math.ceil(totalProducts / pageSize)} onClick={() => setPage(p => p + 1)}>Next &gt;</AppButton>
                  </Space>
                </div>
              </Row>
            </>
          )}
        </AppSpin>
      </AppCard>

      {/* View Modal */}
      <AppModal
        title="Product Details"
        width={900}
        open={!!viewing}
        footer={null}
        onCancel={() => setViewing(null)}
      >
        {viewing && (
          <Row gutter={24}>
            {/* Left Col: Images */}
            <Col xs={24} md={10}>
              <div className="mb-4">
                <Image.PreviewGroup
                  items={viewing.imageUrls?.map((url) => ({
                    src: url.startsWith("http") ? url : `${BASE_URL}${url}`,
                  }))}
                >
                  <Image
                    src={viewing.imageUrl?.startsWith("http") ? viewing.imageUrl : viewing.imageUrl ? `${BASE_URL}${viewing.imageUrl}` : "https://placehold.co/600x600?text=No+Image"}
                    className="rounded-lg shadow-sm w-full! h-auto object-cover border border-gray-100"
                  />
                </Image.PreviewGroup>
              </div>
              <Image.PreviewGroup>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {viewing.imageUrls?.map((url, idx) => (
                    <Image
                      preview={false}
                      key={idx}
                      src={url.startsWith('/') ? `${BASE_URL}${url}` : url}
                      className="w-11! h-11! object-cover rounded shadow-xs"
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </Col>

            {/* Right Col: Details */}
            <Col xs={24} md={14}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Title level={4} className="mb-1!">{viewing.productName}</Title>
                  <Space>
                    <Tag color="blue">{viewing.category}</Tag>
                    <Tag color={viewing.isPublished ? "green" : "default"}>{viewing.isPublished ? "Published" : "Draft"}</Tag>
                  </Space>
                </div>
                <div className="text-right">
                  <Title level={3} className="mb-0! text-violet-600!">৳ {viewing.price}</Title>
                  {viewing.hasDiscount && (
                    <Text delete type="secondary">৳ {Math.round(viewing.price + (viewing.discountType === 'flat' ? viewing.discountValue || 0 : (viewing.price * (viewing.discountValue || 0) / 100)))}</Text>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 flow-root">
                <Space size="large" className="w-full justify-between">
                  <div className="text-center">
                    <Text type="secondary" className="block text-xs uppercase">Stock</Text>
                    <Text strong className={viewing.stock < 5 ? "text-red-500" : ""}>{viewing.stock}</Text>
                  </div>
                  <div className="text-center">
                    <Text type="secondary" className="block text-xs uppercase">SKU</Text>
                    <Text strong>{viewing.sku || "N/A"}</Text>
                  </div>
                  <div className="text-center">
                    <Text type="secondary" className="block text-xs uppercase">Status</Text>
                    <Tag color={statusColor(viewing.status)} className="mr-0!">{viewing.status}</Tag>
                  </div>
                </Space>
              </div>

              {/* Descriptions */}
              <div className="mb-4">
                <Text strong className="block mb-1">Description</Text>
                <Paragraph type="secondary" ellipsis={{ rows: 3, expandable: true, symbol: 'more' }} className="text-sm">
                  {viewing.description || viewing.productDetails?.description?.replace(/<[^>]*>/g, '') || "No description available."}
                </Paragraph>
              </div>

              {/* Specifications Grid */}
              {(viewing.specifications || viewing.productDetails?.features) && (
                <div className="mb-4">
                  <Text strong className="block mb-2">Specifications</Text>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {viewing.specifications?.brand && (
                      <>
                        <Text type="secondary">Brand:</Text>
                        <Text>{viewing.specifications.brand}</Text>
                      </>
                    )}
                    {viewing.specifications?.material && (
                      <>
                        <Text type="secondary">Material:</Text>
                        <Text>{viewing.specifications.material}</Text>
                      </>
                    )}
                    {viewing.specifications?.countryOfOrigin && (
                      <>
                        <Text type="secondary">Origin:</Text>
                        <Text>{viewing.specifications.countryOfOrigin}</Text>
                      </>
                    )}
                    {viewing.specifications?.availableColors?.length ? (
                      <>
                        <Text type="secondary">Colors:</Text>
                        <Space size={4}>
                          {viewing.specifications.availableColors.map(c => <Tag key={c} color="default" className="text-xs!">{c}</Tag>)}
                        </Space>
                      </>
                    ) : null}
                    {viewing.specifications?.availableSizes?.length ? (
                      <>
                        <Text type="secondary">Sizes:</Text>
                        <Space size={4}>
                          {viewing.specifications.availableSizes.map(s => <Tag key={s} className="text-xs!">{s}</Tag>)}
                        </Space>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {viewing.tags && viewing.tags.length > 0 && (
                <div>
                  <Text strong className="block mb-2 text-xs uppercase text-gray-400">Tags</Text>
                  <div className="flex flex-wrap gap-1">
                    {viewing.tags.map(tag => <Tag key={tag} className="mr-0 rounded-full px-2 text-xs">{tag}</Tag>)}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        )}
      </AppModal>

      {/* 🚚 Delivery Charge Update Modal */}
      <AppModal
        title="Update Delivery Charges"
        open={isDeliveryModalOpen}
        onCancel={() => setIsDeliveryModalOpen(false)}
        confirmLoading={isUpdatingSettings}
        onOk={() => deliveryForm.submit()}
        okText="Update Charges"
      >
        <Form
          form={deliveryForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await updateSetting({
                key: "delivery_charge",
                value: values,
                type: "json"
              }).unwrap();
              toast.success("Delivery charges updated!");
              setIsDeliveryModalOpen(false);
            } catch (err) {
              toast.error("Failed to update delivery charges");
            }
          }}
          initialValues={{ dhaka: 80, outside: 150 }}
        >
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Form.Item
              label="Inside Dhaka (৳)"
              name="dhaka"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber className="w-full" min={0} placeholder="80" />
            </Form.Item>
            <Form.Item
              label="Outside Dhaka (৳)"
              name="outside"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber className="w-full" min={0} placeholder="150" />
            </Form.Item>
          </div>
          <Text type="secondary" className="text-xs">
            * These values will be used for calculation on the checkout page.
          </Text>
        </Form>
      </AppModal>
    </div>
  );
};

export default ProductPage;
