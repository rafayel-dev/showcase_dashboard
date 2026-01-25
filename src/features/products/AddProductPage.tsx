import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Typography,
  Select,
  Space,
  Upload,
  Switch,
  Divider,
  Row,
  Col,
  DatePicker,
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
import toast from "../../utils/toast";
import dayjs from "dayjs";
import AppButton from "../../components/common/AppButton";
import AppCard from "../../components/common/AppCard";
import AppInput from "../../components/common/AppInput";
import AppSpin from "../../components/common/AppSpin";
import AppModal from "../../components/common/AppModal";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
            const formValues: Partial<Product> & { discountRange?: [dayjs.Dayjs, dayjs.Dayjs] } = { ...product };
            if (formValues.discountStartDate && formValues.discountEndDate) {
              formValues.discountRange = [
                dayjs(formValues.discountStartDate),
                dayjs(formValues.discountEndDate),
              ];
            }
            form.setFieldsValue(formValues);
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

  const onFinish = async (values: Omit<Product, "id" | "key"> & { discountRange?: [dayjs.Dayjs, dayjs.Dayjs] }) => {
    if (!fileList.length) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setLoading(true);
    try {
      const images = fileList.map((f) => f.url || (f.preview as string));

      const { discountRange, ...restValues } = values;
      const productData: Partial<Product> = { ...restValues, imageUrl: images[0] };

      if (productData.hasDiscount && discountRange) {
        productData.discountStartDate = discountRange[0].toISOString();
        productData.discountEndDate = discountRange[1].toISOString();
      } else if (!productData.hasDiscount) {
        delete productData.hasDiscount;
        delete productData.discountType;
        delete productData.discountValue;
        delete productData.discountStartDate;
        delete productData.discountEndDate;
      }

      if (isEditMode && editingProduct) {
        await updateProduct({
          ...editingProduct,
          ...(productData as Product),
        });
        toast.success("Product updated successfully✅");
      } else {
        await addProduct({
          ...(productData as Product),
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
        <AppCard bordered={false}>
          {/* Header */}
          <Title level={3} className="mb-0">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </Title>

          <Divider className="my-5!" />

          <AppSpin spinning={loading}>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              requiredMark={false}
            >
              {/* ================= BASIC INFO ================= */}
              <AppCard className="mb-6!" bordered={false}>
                <Title level={4}>Basic Information</Title>

                <Row gutter={24}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name="title"
                      label="Product Name"
                      rules={[{ required: true }]}
                    >
                      <AppInput placeholder="Product title" />
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
                  <AppInput.TextArea
                    rows={3}
                    placeholder="Short summary for product list"
                  />
                </Form.Item>
              </AppCard>

              {/* ================= PRICE & STOCK ================= */}
              <AppCard className="mb-6!" bordered={false}>
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
                    <Form.Item label="Discount">
                      {/* Switch */}
                      <Form.Item
                        name="hasDiscount"
                        valuePropName="checked"
                        initialValue={false}
                        noStyle
                      >
                        <Switch />
                      </Form.Item>

                      {/* Conditional Render */}
                      <Form.Item shouldUpdate>
                        {({ getFieldValue }) => {
                          const hasDiscount = getFieldValue("hasDiscount");
                          const discountType = getFieldValue("discountType");

                          return (
                            hasDiscount && (
                              <Space
                                direction="vertical"
                                className="w-full mt-2!"
                              >
                                {/* Discount Type */}
                                <Form.Item
                                  className="mt-0!"
                                  name="discountType"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Select discount type",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Discount Type"
                                    options={[
                                      { value: "flat", label: "Flat" },
                                      {
                                        value: "percentage",
                                        label: "Percentage",
                                      },
                                    ]}
                                  />
                                </Form.Item>

                                {/* Discount Value */}
                                <Form.Item
                                  className="mt-0!"
                                  name="discountValue"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Enter discount value",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    className="w-full!"
                                    placeholder="Discount Value"
                                    min={0}
                                    max={
                                      discountType === "percentage"
                                        ? 100
                                        : undefined
                                    }
                                  />
                                </Form.Item>

                                {/* Discount Start Date */}
                                <Form.Item
                                  className="mt-0!"
                                  name="discountRange"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Discount start date is required",
                                      type: "object",
                                    },
                                  ]}
                                >
                                  <RangePicker className="w-full!" />
                                </Form.Item>
                              </Space>
                            )
                          );
                        }}
                      </Form.Item>
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
                      <AppInput placeholder="Product SKU" />
                    </Form.Item>
                  </Col>
                </Row>
              </AppCard>

              {/* ================= SPECIFICATIONS ================= */}
              <AppCard className="mb-6!" bordered={false}>
                <Title level={4}>Specifications</Title>

                <Row gutter={24}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item name={["specifications", "brand"]} label="Brand">
                      <AppInput placeholder="Escape" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={["specifications", "material"]}
                      label="Material"
                    >
                      <AppInput placeholder="Premium Fabric" />
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
                        {[
                          "Ash",
                          "Black",
                          "Blue",
                          "Red",
                          "Navy Blue",
                          "Sky Blue",
                        ].map((c) => (
                          <Option key={c}>{c}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name={["specifications", "countryOfOrigin"]}
                    label="Country of Origin"
                  >
                    <AppInput placeholder="Bangladesh" />
                  </Form.Item>
                </Col>
              </AppCard>

              {/* ================= PRODUCT DETAILS ================= */}
              <AppCard className="mb-6!" bordered={false}>
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
              </AppCard>

              {/* ================= IMAGES ================= */}
              <AppCard className="mb-6!" bordered={false}>
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


                <AppModal
                  open={previewOpen}
                  onCancel={() => setPreviewOpen(false)}
                  title="Image Preview"
                  footer={null}
                >
                  <img src={previewImage} className="w-full" />
                </AppModal>
              </AppCard>

              {/* ================= STATUS ================= */}
              <AppCard className="mb-6 bg-gray-50" bordered={false}>
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
              </AppCard>

              <Divider />

              {/* ================= ACTIONS ================= */}
              <Space>
                <AppButton
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  {isEditMode ? "Save Changes" : "Add Product"}
                </AppButton>
                <AppButton
                  danger
                  size="large"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </AppButton>
              </Space>
            </Form>
          </AppSpin>
        </AppCard>
      </div>
    </div>
  );
};

export default AddProductPage;
