import React, { useState, useEffect } from "react";
import {
  Form,
  Typography,
  Space,
  Upload,
  Switch,
  Divider,
  Row,
  Col,
  DatePicker,
} from "antd";
import AppSelect from "../../components/common/AppSelect";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../../types";
import {
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} from "../../RTK/product/productApi";
import { useGetCategoriesQuery } from "../../RTK/category/categoryApi";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import CustomJoditEditor from "../../components/common/JoditEditor";
import toast from "../../utils/toast";
import dayjs from "dayjs";
import AppButton from "../../components/common/AppButton";
import AppCard from "../../components/common/AppCard";
import AppInput from "../../components/common/AppInput";
import AppSpin from "../../components/common/AppSpin";
import AppModal from "../../components/common/AppModal";
import { BASE_URL } from "@/RTK/api";

const { Title, Text } = Typography;
const { Option } = AppSelect;
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

  // RTK Query hooks
  const { data: productData, isLoading: isFetching } = useGetProductByIdQuery(
    productId || "",
    { skip: !isEditMode }
  );
  const { data: categories = [] } = useGetCategoriesQuery({});
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const loading = isFetching || isAdding || isUpdating;

  useEffect(() => {
    if (isEditMode && productData) {
      const formValues: Partial<Product> & { discountRange?: [dayjs.Dayjs, dayjs.Dayjs] } = { ...productData };

      // Map productName to title for form if needed, though form uses 'title'
      if (productData.productName) {
        form.setFieldsValue({ title: productData.productName });
      }

      // Explicitly set isPublished to ensure switch reflects state
      if (productData.isPublished !== undefined) {
        form.setFieldsValue({ isPublished: productData.isPublished });
      }

      if (formValues.discountStartDate && formValues.discountEndDate) {
        formValues.discountRange = [
          dayjs(formValues.discountStartDate),
          dayjs(formValues.discountEndDate),
        ];
      }
      form.setFieldsValue(formValues);

      if (productData.imageUrls && productData.imageUrls.length > 0) {
        setFileList(
          productData.imageUrls.map((url, index) => ({
            uid: String(index),
            name: `image-${index}.png`,
            status: "done",
            url: url.startsWith('/') ? `${BASE_URL}${url}` : url,
          }))
        );
      } else if (productData.imageUrl) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: productData.imageUrl.startsWith('/') ? `${BASE_URL}${productData.imageUrl}` : productData.imageUrl,
          },
        ]);
      }
    }
  }, [productData, isEditMode, form]);

  const [uploadImage] = useUploadImageMutation();

  const onFinish = async (values: Omit<Product, "id" | "key"> & { discountRange?: [dayjs.Dayjs, dayjs.Dayjs] }) => {
    if (!fileList.length) {
      toast.error("Please upload at least one product image.");
      return;
    }

    if (fileList.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    try {
      // Prepare base payload from form values
      const { discountRange, ...restValues } = values;
      const productPayload: any = { ...restValues };

      // Transform title -> productName
      if ((values as any).title) {
        productPayload.productName = (values as any).title;
      }

      // Handle Discount Fields
      if (productPayload.hasDiscount && discountRange) {
        productPayload.discountStartDate = discountRange[0].toISOString();
        productPayload.discountEndDate = discountRange[1].toISOString();
      } else if (!productPayload.hasDiscount) {
        productPayload.hasDiscount = false;
        productPayload.discountType = undefined;
        productPayload.discountValue = undefined;
        productPayload.discountStartDate = undefined;
        productPayload.discountEndDate = undefined;
      }

      let targetId: string;
      let isNewProduct = false;

      // STEP 1: Determine ID (Create if new, use existing if edit)
      if (isEditMode && productId) {
        targetId = productId;
        // For Edit Mode, we need to update basic info *now* if we want to be safe, 
        // or just accumulate it for the final update. 
        // We'll accumulate for final update to keep logic unified.
      } else {
        // [NEW] Create initial product record to Generating ID
        // Pass empty imageUrls initially
        const res = await addProduct({
          ...productPayload,
          imageUrl: "",
          imageUrls: [],
          status: "In Stock" // Default status
        }).unwrap();
        targetId = res.id;
        isNewProduct = true;
      }

      // STEP 2: Upload Images using Valid ID
      const uploadedUrls: string[] = [];
      for (const file of fileList) {
        if (file.url) {
          // Existing image - Strip domain if present to keep relative path
          const cleanUrl = file.url.replace(BASE_URL, "");
          uploadedUrls.push(cleanUrl);
        } else if (file.originFileObj) {
          // New file -> Upload with targetId
          const formData = new FormData();
          formData.append("image", file.originFileObj);

          const res = await uploadImage({
            formData,
            productId: targetId
          }).unwrap();
          uploadedUrls.push(res.filePath);
        }
      }

      // STEP 3: Final Update (Link images to product)
      // This works for both New (updates the placeholder) and Edit (updates existing)
      const finalPayload = {
        id: targetId,
        ...productPayload,
        imageUrl: uploadedUrls[0],
        imageUrls: uploadedUrls
      };

      await updateProduct(finalPayload).unwrap();

      toast.success(isNewProduct ? "Product added successfully✅" : "Product updated successfully✅");
      navigate("/products");

    } catch (err) {
      console.error(err);
      toast.error("❌ Operation failed");
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
                      <AppSelect placeholder="Select category">
                        {categories.map((cat: any) => (
                          <Option key={cat.id} value={cat.name}>{cat.name}</Option>
                        ))}
                      </AppSelect>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <Form.Item name="tags" label="Tags">
                      <AppSelect mode="tags" placeholder="Enter tags (e.g. summer, new)" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name={["specifications", "shortDescription"]} label="Short Description">
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
                      <AppInput
                        placeholder="1200"
                        min={0}
                        type="number"
                        className="w-1/3!"
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
                                  <AppSelect
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
                                  <AppInput
                                    className="w-1/3!"
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
                                      message: "Discount start/end date is required",
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
                      <AppInput
                        className="w-1/3!"
                        placeholder="15"
                        min={0}
                        type="number"
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
                      <AppSelect mode="tags">
                        {["M", "L", "XL", "30", "31", "32"].map((s) => (
                          <Option key={s}>{s}</Option>
                        ))}
                      </AppSelect>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={["specifications", "availableColors"]}
                      label="Available Colors"
                    >
                      <AppSelect mode="tags">
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
                      </AppSelect>
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
                  name={["productDetails", "longDescription"]}
                  rules={[{ required: true }]}
                >
                  <CustomJoditEditor
                    initialContent={form.getFieldValue([
                      "productDetails",
                      "longDescription",
                    ])}
                    onChange={(content: string) =>
                      form.setFieldsValue({
                        productDetails: { longDescription: content },
                      })
                    }
                  />
                </Form.Item>

                <Form.Item name={["productDetails", "features"]} label="Key Features">
                  <AppSelect mode="tags" placeholder="Enter key features (e.g. Waterproof, 1 Year Warranty)" />
                </Form.Item>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name={["productDetails", "deliveryInfo"]} label="Delivery Information">
                      <AppInput.TextArea rows={2} placeholder="Delivery within 2-3 days..." />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name={["productDetails", "returnPolicy"]} label="Return Policy">
                      <AppInput.TextArea rows={2} placeholder="7 days return policy..." />
                    </Form.Item>
                  </Col>
                </Row>
              </AppCard>

              {/* ================= IMAGES ================= */}
              <AppCard className="mb-6!" bordered={false}>
                <Title level={4}>Product Images</Title>

                <Upload
                  accept="image/*"
                  listType="picture-card"
                  beforeUpload={() => false}
                  multiple
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  onPreview={async (file) => {
                    if (!file.url && !file.preview && file.originFileObj) {
                      file.preview = await getBase64(
                        file.originFileObj as RcFile,
                      );
                    }
                    const url = file.url || (file.preview as string);
                    setPreviewImage(url?.startsWith('/') ? `${BASE_URL}${url}` : url || "");
                    setPreviewOpen(true);
                  }}
                >
                  {fileList.length < 6 && <PlusOutlined />}
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

                <Form.Item name="status" label="Availability Status" initialValue="In Stock" className="mb-4">
                  <AppSelect
                    placeholder="Select Status"
                    options={[
                      { value: 'In Stock', label: 'In Stock' },
                      { value: 'Out of Stock', label: 'Out of Stock' },
                      { value: 'Discontinued', label: 'Discontinued' }
                    ]}
                  />
                </Form.Item>

                <Space>
                  <Text>Draft</Text>
                  <Form.Item
                    name="isPublished"
                    valuePropName="checked"
                    initialValue={false}
                    noStyle
                  >
                    <Switch className="bg-violet-500!" />
                  </Form.Item>
                  <Text>Publish</Text>
                </Space>
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
    </div >
  );
};

export default AddProductPage;
