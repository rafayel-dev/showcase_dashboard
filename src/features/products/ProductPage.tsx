import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Modal,
  Input,
  Image,
  Select,
  Tag,
  Spin,
  Tooltip,
  Row,
  Col,
  Popconfirm,
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
  fetchProducts,
  deleteProduct,
} from "../../services/productService";
import toast from "../../../utils/toast";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [viewing, setViewing] = useState<Product | null>(null);

  // 🔍 Filters
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();



  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: Product["status"]) => {
    if (status === "In Stock") return "success";
    if (status === "Out of Stock") return "warning";
    if (status === "Discontinued") return "error";
    return "default";
  };

  // ✅ Filter logic
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.productName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchCategory = categoryFilter ? p.category === categoryFilter : true;

    return matchSearch && matchCategory;
  });

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Product",
      dataIndex: "productName",
      render: (text, record) => (
        <Text strong className={record.stock < 5 ? "text-red-600" : ""}>
          {text}
        </Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "SKU",
      dataIndex: "sku",
    },
    {
      title: "Price",
      dataIndex: "price",
      align: "center",
      render: (p) => `৳ ${p}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      align: "center",
      render: (stock) => (
        <Text type={stock < 5 ? "danger" : undefined}>{stock}</Text>
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
      render: (_, r) => (
        <Space>
          <Tooltip title="View">
            <Button icon={<FiEye />} onClick={() => setViewing(r)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<FiEdit />}
              onClick={() => navigate(`/edit-product/${r.id}`)}
            />
          </Tooltip>
          <Popconfirm
            placement="topRight"
            title="Delete this Product?"
            description="This action cannot be undone"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={async () => {
              await deleteProduct(r.id);
              loadProducts();
            }}
          >
            <Button title="Delete Product" danger icon={<FiTrash2 />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="rounded-2xl">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={3}>Product Management</Title>
            <Text type="secondary">Manage your ecommerce inventory</Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={viewMode === "table" ? <FiGrid /> : <FiList />}
                onClick={() =>
                  setViewMode(viewMode === "table" ? "card" : "table")
                }
              />
              <Button
                type="primary"
                className="bg-violet-500!"
                icon={<FiPlus />}
                onClick={() => navigate("/add-product")}
              >
                Add Product
              </Button>
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
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Space>

        {/* Content */}
        <Spin spinning={loading}>
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
        </Spin>
      </Card>



      {/* View Modal */}
      <Modal
        title="Product Details"
        width={700}
        open={!!viewing}
        footer={null}
        onCancel={() => setViewing(null)}
      >
        {viewing && (
          <>
            <Space direction="vertical">
              <Text>
                <b>Name:</b> {viewing.productName}
              </Text>
              <Text>
                <b>Category:</b> {viewing.category}
              </Text>
              <Text>
                <b>Price:</b> ৳ {viewing.price}
              </Text>
              <Text>
                <b>Stock:</b> {viewing.stock}
              </Text>
              <Text>
                <b>Status:</b>{" "}
                <Tag color={statusColor(viewing.status)}>{viewing.status}</Tag>
              </Text>
            </Space>
            <div className="mt-4">
              <div className="flex gap-2">
                <Image.PreviewGroup>
                  <Image
                    src={viewing.imageUrl || ""}
                    alt=""
                    className="w-32! h-32!"
                  />
                </Image.PreviewGroup>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;
