import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Select,
  Space,
  message,
  Spin,
  Upload,
  Modal,
  Switch,
  Divider,
  Row,
  Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import { addProduct } from "../../services/productService";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import CustomJoditEditor from '../../components/common/JoditEditor'; // Import the custom Jodit Editor wrapper

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
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const onFinish = async (values: Omit<Product, 'id' | 'key'>) => {
    if (!fileList.length) {
      message.error("কমপক্ষে ১টি পণ্যের ছবি দিন");
      return;
    }

    setLoading(true);
    try {
      const images = fileList.map((f) => f.url || (f.preview as string));

      await addProduct({
        ...values,
        title: values.title,
        imageUrls: images,
        status: "In Stock",
      });

      message.success("✅ Product added successfully");
      navigate("/dashboard/products");
    } catch {
      message.error("❌ Product add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Card className="shadow-lg" bordered={false}>
        <Title level={2} className="text-gray-800 m-0">➕ Add New Product</Title>
        <Text type="secondary">Product Management &gt; Add New</Text>

        <Divider className="my-6" />

        <Spin spinning={loading}>
          <Form layout="vertical" form={form} onFinish={onFinish} className="space-y-6">
            {/* ================= BASIC INFO ================= */}
            <Card className="mb-6 bg-gray-50" bordered={false}>
              <Title level={4}>🧾 Basic Information</Title>

              <Row gutter={24}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name="title"
                    label="Product Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={8}>
                  <Form.Item name="category" label="Category">
                    <Select>
                      <Option value="Apparel">Apparel</Option>
                      <Option value="Electronics">Electronics</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Short Description">
                <Input.TextArea rows={4} placeholder="A concise summary of the product..." />
              </Form.Item>
            </Card>

            {/* ================= PRICE ================= */}
            <Card className="mb-6 bg-gray-50" bordered={false}>
              <Title level={4}>💰 Pricing & Stock</Title>

              <Row gutter={24}>
                <Col xs={24} md={8} lg={6}>
                  <Form.Item
                    name="price"
                    label="Price (৳)"
                    rules={[{ required: true }]}
                  >
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8} lg={6}>
                  <Form.Item name="stock" label="Stock">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8} lg={6}>
                  <Form.Item name="sku" label="SKU">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* ================= SPECIFICATIONS ================= */}
            <Card className="mb-6 bg-gray-50" bordered={false}>
              <Title level={4}>📄 Specifications</Title>

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
                    <Select mode="multiple">
                      {["S", "M", "L", "XL"].map((s) => (
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
                    <Select mode="multiple">
                      {["Black", "Blue", "Red"].map((c) => (
                        <Option key={c}>{c}</Option>
                      ))}
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
            <Card bordered={false} className="mb-6 bg-gray-50">
              <Title level={4}>📄 Product Details</Title>

              {/* LONG DESCRIPTION */}
              <Form.Item
                name={["productDetails", "description"]}
                rules={[{ required: true }]}
              >
                <CustomJoditEditor
                  initialContent={form.getFieldValue(["productDetails", "description"])}
                  onChange={(newContent: string) => {
                    form.setFieldsValue({ productDetails: { description: newContent } });
                  }}
                />
              </Form.Item>
            </Card>

            {/* ================= IMAGES ================= */}
            <Card className="mb-6 bg-gray-50" bordered={false}>
              <Title level={4}>🖼 Product Images</Title>
               
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

            {/* ================= PUBLISH ================= */}
            <Card bordered={false} className="bg-gray-50">
              <Form.Item
                name="isPublished"
                valuePropName="checked"
                initialValue={true}
                label="Product Status"
              >
                <Space>
                  <Text>Draft</Text>
                  <Switch />
                  <Text>Publish</Text>
                </Space>
              </Form.Item>
            </Card>

            <Divider />

            <Space>
              
              <Button type="primary" htmlType="submit" size="large">
                Add Product
              </Button>
              <Button danger onClick={() => navigate("/dashboard/products")}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default AddProductPage;
