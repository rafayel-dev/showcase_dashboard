import React, { useState } from "react";
import AppCard from "../../../components/common/AppCard";
import {
  Form,
  InputNumber,
  Divider,
  Row,
  Col,
  Upload,
  Switch,
  Space,
  DatePicker,
} from "antd";
import { FiSave, FiPlus, FiTrash, FiList } from "react-icons/fi";
import type { UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AppInput from "@/components/common/AppInput";
import AppButton from "@/components/common/AppButton";
import AppSelect from "@/components/common/AppSelect";
import { AiFillProduct } from "react-icons/ai";
import { Typography } from "antd";
import { FaFileMedicalAlt } from "react-icons/fa";
import { GoFileMedia } from "react-icons/go";
import { TbFileDescription } from "react-icons/tb";

const { Text } = Typography;

const LandingForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      images: fileList.map((f) => f.originFileObj || f.url),
    };

    console.log("FINAL PAYLOAD:", payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        productName: "Premium Wireless Earbuds Pro",
        regularPrice: 2500,
        discountPrice: 1250,
        isActive: true,
        stock: 50,
      }}
    >
      <div className="flex justify-end mb-4">
        <AppButton
          type="primary"
          icon={<FiSave />}
          size="large"
          onClick={() => form.submit()}
        >
          Save Product
        </AppButton>
      </div>

      <Row gutter={24}>
        <Col span={24} lg={16}>
          {/* PRODUCT INFO */}
          <AppCard className="mb-6!">
            <div className="p-1 px-4 mb-6 bg-purple-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
              <AiFillProduct className="text-purple-600" />
              <Text
                strong
                className="text-purple-900 uppercase tracking-wider text-xs"
              >
                Product Info
              </Text>
            </div>

            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true }]}
            >
              <AppInput placeholder="Product Name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Regular Price"
                  name="regularPrice"
                  rules={[{ required: true }]}
                >
                  <InputNumber className="w-full" placeholder="Regular Price" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Discount Price"
                  name="discountPrice"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Discount Price"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Stock"
                  name="stock"
                  rules={[{ required: true }]}
                >
                  <InputNumber className="w-full" placeholder="Stock" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Discount Text"
                  name="discountText"
                  rules={[{ required: true }]}
                >
                  <AppInput placeholder="50% OFF" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true }]}
                >
                  <AppSelect placeholder="Category" options={[]} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Sale End Time"
              name="saleEndTime"
              rules={[{ required: true }]}
            >
              <DatePicker
                className="w-full"
                placeholder="Sale End Time"
                showTime
              />
            </Form.Item>

            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </AppCard>

          {/* FEATURES */}
          <AppCard className="mb-6!">
            <div className="p-1 px-4 mb-6 bg-blue-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
              <FiList className="text-blue-600" />
              <Text
                strong
                className="text-blue-900 uppercase tracking-wider text-xs!"
              >
                Features
              </Text>
            </div>

            <Form.List name="features">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Space key={key} className="flex!" align="baseline">
                      <Form.Item
                        name={name}
                        rules={[{ required: true, message: "Missing feature" }]}
                      >
                        <AppInput placeholder="Feature" />
                      </Form.Item>
                      <FiTrash onClick={() => remove(name)} className="cursor-pointer! text-red-400! text-lg!"/>
                    </Space>
                  ))}

                  <AppButton onClick={() => add()} icon={<FiPlus />}>
                    Add Feature
                  </AppButton>
                </>
              )}
            </Form.List>
          </AppCard>

          {/* DESCRIPTION */}
          <AppCard className="mb-6!">
            <div className="p-1 px-4 mb-6 bg-indigo-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
              <TbFileDescription className="text-indigo-600" />
              <Text
                strong
                className="text-indigo-900 uppercase tracking-wider text-xs"
              >
                Description
              </Text>
            </div>
            <Form.Item name="description" rules={[{ required: true }]}>
              <AppInput.TextArea placeholder="Description" rows={4} />
            </Form.Item>
          </AppCard>

          {/* MEDIA */}
          <AppCard className="mb-6!">
            <div className="p-1 px-4 mb-6 bg-violet-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
              <GoFileMedia className="text-violet-600" />
              <Text
                strong
                className="text-violet-900 uppercase tracking-wider text-xs"
              >
                Media
              </Text>
            </div>

            <Form.Item
              label="Video URL"
              name="videoUrl"
              rules={[{ required: true }]}
            >
              <AppInput placeholder="Video URL" />
            </Form.Item>

            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
            >
              <div>
                <PlusOutlined />
                <div>Upload</div>
              </div>
            </Upload>
          </AppCard>
        </Col>

        <Col span={24} lg={8}>
          <div className="sticky top-6! space-y-4!">
            {/* QUICK ACTIONS */}
            <AppCard>
              <div className="p-1 px-4 mb-6 bg-green-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
                <AiFillProduct className="text-green-600" />
                <Text
                  strong
                  className="text-green-900 uppercase tracking-wider text-xs"
                >
                  Quick Actions
                </Text>
              </div>

              <div
                onClick={() => window.open("/", "_blank")}
                className="p-3 bg-gray-100 rounded cursor-pointer text-center hover:bg-gray-200"
              >
                Preview Full Page
              </div>

              <Divider />

              <p className="text-sm! text-center! text-gray-400! mb-2!">
                Product Link
              </p>

              <AppInput
                value={`https://example.com/product/${(Form.useWatch("productName", form) || "product").toLowerCase().replace(/\s+/g, "-")}`}
                readOnly
              />

              <AppButton
                className="mt-2!"
                onClick={() => {
                  const link = `https://example.com/product/${(Form.useWatch("productName", form) || "product").toLowerCase().replace(/\s+/g, "-")}`;
                  navigator.clipboard.writeText(link);
                }}
              >
                Copy Link
              </AppButton>
            </AppCard>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default LandingForm;
