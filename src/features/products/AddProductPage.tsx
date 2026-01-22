import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Select,
  Space,
  Spin,
  Upload,
  Modal,
  Switch,
  Divider,
  Row,
  Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../../types";
import {
  addProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import CustomJoditEditor from "../../components/common/JoditEditor";
import toast from "../../../utils/toast";

const { Title, Text } = Typography;
const { Option } = Select;

/* ================= IMAGE HELPER ================= */
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = !!productId;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isEditMode && productId) {
      setLoading(true);
      getProductById(productId)
        .then((product) => {
          if (product) {
            setEditingProduct(product);
            form.setFieldsValue(product);
            if (product.imageUrl) {
              setFileList([
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  url: product.imageUrl,
                },
              ]);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [productId, isEditMode, form]);

  const onFinish = async (values: Omit<Product, "id" | "key">) => {
    if (!fileList.length) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setLoading(true);
    try {
      const images = fileList.map((f) => f.url || (f.preview as string));

      if (isEditMode && editingProduct) {
        await updateProduct({
          ...editingProduct,
          ...values,
          imageUrl: images[0],
        });
        toast.success("Product updated successfully✅");
      } else {
        await addProduct({
          ...values,
          imageUrl: images[0],
          status: "In Stock",
        });
        toast.success("Product added successfully✅");
      }
      navigate("/products");
    } catch {
      toast.error("❌ Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Card bordered={false} className="rounded-2xl shadow-sm">
          {/* Header */}
          <Title level={3} className="mb-0">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </Title>

          <Divider className="my-5!" />

          <Spin spinning={loading}>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              requiredMark={false}
            >
              {/* ================= BASIC INFO ================= */}
              <Card className="mb-6!" bordered={false}>
                <Title level={4}>Basic Information</Title>

                <Row gutter={24}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name="title"
                      label="Product Name"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Product title" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select category">
                        <Option value="Apparel">Apparel</Option>
                        <Option value="Electronics">Electronics</Option>
                        <Option value="Home">Home</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="description" label="Short Description">
                  <Input.TextArea
                    rows={3}
                    placeholder="Short summary for product list"
                  />
                </Form.Item>
              </Card>

              {/* ================= PRICE & STOCK ================= */}
              <Card className="mb-6!" bordered={false}>
                <Title level={4}>Pricing & Inventory</Title>

                <Row gutter={24}>
                  <Col xs={24} md={8} lg={6}>
                    <Form.Item
                      name="price"
                      label="Price (৳)"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="1200"
                        min={0}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8} lg={6}>
                    <Form.Item
                      name="stock"
                      label="Stock Quantity"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="15"
                        min={0}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8} lg={6}>
                    <Form.Item name="sku" label="SKU">
                      <Input placeholder="Product SKU" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* ================= SPECIFICATIONS ================= */}
              <Card className="mb-6!" bordered={false}>
                <Title level={4}>Specifications</Title>

                <Row gutter={24}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item name={["specifications", "brand"]} label="Brand">
                      <Input placeholder="Escape" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={["specifications", "material"]}
                      label="Material"
                    >
                      <Input placeholder="Premium Fabric" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={["specifications", "availableSizes"]}
                      label="Available Sizes"
                    >
                      <Select mode="tags">
                        {["M", "L", "XL", "30", "31", "32"].map((s) => (
                          <Option key={s}>{s}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={["specifications", "availableColors"]}
                      label="Available Colors"
                    >
                      <Select mode="tags">
                        {["Ash", "Black", "Blue", "Red", "Navy Blue", "Sky Blue"].map(
                          (c) => (
                            <Option key={c}>{c}</Option>
                          ),
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name={["specifications", "countryOfOrigin"]}
                  label="Country of Origin"
                >
                  <Input placeholder="Bangladesh" />
                </Form.Item>
              </Card>

              {/* ================= PRODUCT DETAILS ================= */}
              <Card className="mb-6!" bordered={false}>
                <Title level={4}>Product Details</Title>

                <Form.Item
                  name={["productDetails", "description"]}
                  rules={[{ required: true }]}
                >
                  <CustomJoditEditor
                    initialContent={form.getFieldValue([
                      "productDetails",
                      "description",
                    ])}
                    onChange={(content: string) =>
                      form.setFieldsValue({
                        productDetails: { description: content },
                      })
                    }
                  />
                </Form.Item>
              </Card>

              {/* ================= IMAGES ================= */}
              <Card className="mb-6!" bordered={false}>
                <Title level={4}>Product Images</Title>

                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  onPreview={async (file) => {
                    if (!file.url && !file.preview && file.originFileObj) {
                      file.preview = await getBase64(
                        file.originFileObj as RcFile,
                      );
                    }
                    setPreviewImage(file.url || (file.preview as string));
                    setPreviewOpen(true);
                  }}
                >
                  {fileList.length < 8 && <PlusOutlined />}
                </Upload>

                <Modal
                  open={previewOpen}
                  footer={null}
                  onCancel={() => setPreviewOpen(false)}
                >
                  <img src={previewImage} className="w-full" />
                </Modal>
              </Card>

              {/* ================= STATUS ================= */}
              <Card className="mb-6 bg-gray-50" bordered={false}>
                <Title level={5}>Product Status</Title>
                <Form.Item
                  name="isPublished"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Space>
                    <Text>Draft</Text>
                    <Switch className="bg-violet-500!" />
                    <Text>Publish</Text>
                  </Space>
                </Form.Item>
              </Card>

              <Divider />

              {/* ================= ACTIONS ================= */}
              <Space>
                <Button
                  type="primary"
                  className="bg-violet-500!"
                  htmlType="submit"
                  size="large"
                >
                  {isEditMode ? "Save Changes" : "Save Product"}
                </Button>
                <Button
                  danger
                  size="large"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>
              </Space>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default AddProductPage;
