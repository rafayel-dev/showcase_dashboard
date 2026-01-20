import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  message,
  Spin,
} from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import ProductCard from "../../components/common/ProductCard";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const { Title } = Typography;
const { Option } = Select;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [form] = Form.useForm();

  // Fetch products on component mount
  useEffect(() => {
    const getProducts = async () => {
      setTableLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        message.error("Failed to fetch products.");
      } finally {
        setTableLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/dashboard/add-products");
  };

  const handleEditProduct = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      title: record.title,
      imageUrl:
        record.imageUrls && record.imageUrls.length > 0
          ? record.imageUrls[0]
          : "",
    });
    setIsEditModalVisible(true);
  };

  const handleViewDetails = (record: Product) => {
    setViewingProduct(record);
    setIsViewModalVisible(true);
  };

  const handleDeleteProduct = async (id: string) => {
    setTableLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      message.success(`Product with ID: ${id} deleted.`);
    } catch (error) {
      message.error("Failed to delete product.");
    } finally {
      setTableLoading(false);
    }
  };

  const handleEditModalOk = async () => {
    try {
      setFormLoading(true);
      const values = await form.validateFields();
      if (editingProduct) {
        const updated = await updateProduct({ ...editingProduct, ...values });
        setProducts(
          products.map((product) =>
            product.id === updated.id ? updated : product,
          ),
        );
        message.success("Product updated successfully!");
        setIsEditModalVisible(false);
        setEditingProduct(null);
        form.resetFields();
      }
    } catch (errorInfo) {
      message.error("Failed to update product.");
      console.log("Failed:", errorInfo);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setViewingProduct(null);
  };

  const getStatusTagColor = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Out of Stock":
        return "warning";
      case "Discontinued":
        return "error";
      default:
        return "default";
    }
  };

  const columns: TableProps<Product>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Product["status"]) => (
        <Tag color={getStatusTagColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetails(record)}>
            View
          </Button>
          <Button type="link" onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card
        title={
          <Title level={2} className="text-gray-800 m-0">
            Product Management
          </Title>
        }
        extra={
          <Space>
            <Button
              onClick={() =>
                setViewMode(viewMode === "table" ? "card" : "table")
              }
            >
              {viewMode === "table"
                ? "Switch to Card View"
                : "Switch to Table View"}
            </Button>
            <Button
              type="default"
              onClick={() => navigate("/dashboard/draft-products")}
            >
              Drafted Products
            </Button>
            <Button type="primary" onClick={handleAddProduct}>
              Add New Product
            </Button>
          </Space>
        }
      >
        <Spin spinning={tableLoading}>
          {viewMode === "table" ? (
            <Table
              dataSource={products}
              columns={columns}
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Spin>
      </Card>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Update Product"
        confirmLoading={formLoading}
      >
        <Form form={form} layout="vertical" name="edit_product_form">
          <Form.Item
            name="title"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select a category">
              <Option value="Apparel">Apparel</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Footwear">Footwear</Option>
              <Option value="Books">Books</Option>
              <Option value="Home Decor">Home Decor</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0.01} step={0.01} className="w-full" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: "Please input the stock quantity!" },
            ]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="In Stock">In Stock</Option>
              <Option value="Out of Stock">Out of Stock</Option>
              <Option value="Discontinued">Discontinued</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Product Details Modal */}
      <Modal
        title="Product Details"
        open={isViewModalVisible}
        onCancel={handleViewModalCancel}
        footer={[
          <Button key="back" onClick={handleViewModalCancel}>
            Close
          </Button>,
        ]}
      >
        {viewingProduct && (
          <div>
            <p>
              <b>ID:</b> {viewingProduct.id}
            </p>
            <p>
              <b>Title:</b> {viewingProduct.title}
            </p>
            <p>
              <b>Category:</b> {viewingProduct.category}
            </p>
            <p>
              <b>Price:</b> ${viewingProduct.price?.toFixed(2)}
            </p>
            <p>
              <b>Stock:</b> {viewingProduct.stock}
            </p>
            <p>
              <b>SKU:</b> {viewingProduct.sku || "N/A"}
            </p>
            <p>
              <b>Status:</b>{" "}
              <Tag color={getStatusTagColor(viewingProduct.status)}>
                {viewingProduct.status}
              </Tag>
            </p>
            <p>
              <b>Published:</b> {viewingProduct.isPublished ? "Yes" : "No"}
            </p>
            <p>
              <b>Short Description:</b> {viewingProduct.description || "N/A"}
            </p>
            <p>
              <b>Detailed Description:</b>{" "}
              {viewingProduct.productDetails?.description || "N/A"}
            </p>
            {viewingProduct.tags && viewingProduct.tags.length > 0 && (
              <p>
                <b>Tags:</b>{" "}
                {viewingProduct.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </p>
            )}
            {viewingProduct.specifications && (
              <>
                <p>
                  <b>Brand:</b> {viewingProduct.specifications.brand || "N/A"}
                </p>
                <p>
                  <b>Material:</b>{" "}
                  {viewingProduct.specifications.material || "N/A"}
                </p>
                {viewingProduct.specifications.availableSizes &&
                  viewingProduct.specifications.availableSizes.length > 0 && (
                    <p>
                      <b>Available Sizes:</b>{" "}
                      {viewingProduct.specifications.availableSizes.join(", ")}
                    </p>
                  )}
                {viewingProduct.specifications.availableColors &&
                  viewingProduct.specifications.availableColors.length > 0 && (
                    <p>
                      <b>Available Colors:</b>{" "}
                      {viewingProduct.specifications.availableColors.join(", ")}
                    </p>
                  )}
                <p>
                  <b>Country of Origin:</b>{" "}
                  {viewingProduct.specifications.countryOfOrigin || "N/A"}
                </p>
              </>
            )}
            {viewingProduct.imageUrls &&
              viewingProduct.imageUrls.length > 0 && (
                <p>
                  <b>Image:</b>{" "}
                  <img
                    src={viewingProduct.imageUrls[0]}
                    alt={viewingProduct.title}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </p>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;
