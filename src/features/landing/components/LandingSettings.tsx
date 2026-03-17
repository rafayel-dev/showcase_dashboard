import { useState } from "react";
import {
  Form,
  Space,
  Row,
  Col,
  Upload,
  InputNumber,
  Typography,
  List,
  Avatar,
  message,
} from "antd";
import {
  FiSave,
  FiTrash2,
  FiPhone,
  FiMessageCircle,
  FiBell,
  FiImage,
  FiGrid,
  FiPlus,
} from "react-icons/fi";
import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@/components/common/AppCard";
import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import AppPopconfirm from "@/components/common/AppPopconfirm";

const { Title, Text } = Typography;

const LandingSettings = () => {
  const [form] = Form.useForm();

  // Mock State for "Design Only" approach
  const [logoUrl, setLogoUrl] = useState<string>(
    "https://placehold.co/200x60?text=Your+Logo",
  );
  const [categories, setCategories] = useState([
    { id: "1", name: "Electronics" },
    { id: "2", name: "Fashion" },
    { id: "3", name: "Home & Garden" },
  ]);
  const [newCatName, setNewCatName] = useState("");

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat = {
      id: Date.now().toString(),
      name: newCatName.trim(),
    };
    setCategories([...categories, newCat]);
    setNewCatName("");
    message.success("Category added to mockup!");
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    message.success("Category removed from mockup!");
  };

  const onFinish = (values: any) => {
    console.log("Form Values:", { ...values, logoUrl, categories });
    message.success("Design saved (check console for values)!");
  };

  return (
    <div className="p-6! min-h-screen">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          phone: "+880 1700-000000",
          whatsapp: "+880 1800-000000",
          announcement:
            "🔥 Special Offer: Get 20% discount on your first order! Use code: WELCOME20",
          dhakaCharge: 80,
          outsideDhakaCharge: 150,
        }}
      >
        {/* Superior Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4! mb-8!">
          <div>
            <Title level={2} className="mb-1! text-slate-800">
              Store Settings
            </Title>
            <Text type="secondary" className="text-base">
              Customize your storefront's core information and appearance
            </Text>
          </div>
          <Space>
            <AppButton
              type="primary"
              icon={<FiSave />}
              size="large"
              onClick={() => form.submit()}
              className="bg-violet-600! h-12! px-8! text-base! font-semibold!"
            >
              Save Settings
            </AppButton>
          </Space>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <div className="space-y-6!">
              {/* BRANDING SECTION */}
              <AppCard className="overflow-hidden border-none shadow-md!">
                <div className="p-1 px-4 mb-6 bg-violet-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
                  <FiImage className="text-violet-600" />
                  <Text
                    strong
                    className="text-violet-900 uppercase tracking-wider text-xs"
                  >
                    Branding & Identity
                  </Text>
                </div>

                <Row gutter={32} align="middle">
                  <Col xs={24} md={8}>
                    <Form.Item label="Logo">
                      <Upload
                        name="logo"
                        listType="picture-card"
                        className="logo-uploader w-full"
                        showUploadList={false}
                        beforeUpload={() => false} // Just for design
                      >
                        {logoUrl ? (
                          <div className="relative group w-full h-full flex items-center justify-center p-2">
                            <img
                              src={logoUrl}
                              alt="logo"
                              className="max-w-full max-h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                              <Text className="text-white text-xs">
                                Change Logo
                              </Text>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload Logo</div>
                          </div>
                        )}
                      </Upload>
                      <Text type="secondary" className="text-[10px] block mt-2">
                        Recommended: 200x60px (PNG/SVG)
                      </Text>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={16}>
                    <Form.Item
                      label="Announcement Text"
                      name="announcement"
                      className="mb-0"
                    >
                      <AppInput.TextArea
                        rows={3}
                        placeholder="Type your scrolling announcement here..."
                        className="rounded-lg! border-gray-200! focus:border-violet-400!"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </AppCard>

              {/* CONTACT SECTION */}
              <AppCard className="overflow-hidden border-none shadow-md!">
                <div className="p-1 px-4 mb-6 bg-blue-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
                  <FiPhone className="text-blue-600" />
                  <Text
                    strong
                    className="text-blue-900 uppercase tracking-wider text-xs"
                  >
                    Contact & Social Support
                  </Text>
                </div>

                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Support Phone" name="phone">
                      <AppInput
                        prefix={<FiPhone className="text-gray-400 mr-1" />}
                        className="h-11! rounded-lg!"
                        placeholder="+880 1700-000000"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="WhatsApp Support Number" name="whatsapp">
                      <AppInput
                        prefix={
                          <FiMessageCircle className="text-emerald-500 mr-1" />
                        }
                        className="h-11! rounded-lg!"
                        placeholder="+880 1700-000000"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </AppCard>

              {/* LOGISTICS SECTION */}
              <AppCard className="overflow-hidden border-none shadow-md!">
                <div className="p-1 px-4 mb-6! bg-orange-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
                  <span className="text-orange-600 font-bold">৳</span>
                  <Text
                    strong
                    className="text-orange-900 uppercase tracking-wider text-xs"
                  >
                    Delivery & Logistics
                  </Text>
                </div>

                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Delivery Charge (Inside Dhaka)"
                      name="dhakaCharge"
                    >
                      <InputNumber
                        prefix="৳"
                        className="rounded-lg!"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Delivery Charge (Outside Dhaka)"
                      name="outsideDhakaCharge"
                    >
                      <InputNumber
                        prefix="৳"
                        className="rounded-lg!"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="mt-2 p-3 bg-gray-50! rounded-lg flex items-start gap-2">
                  <FiBell className="text-gray-400 mt-1" />
                  <Text type="secondary" className="text-xs">
                    These charges will be automatically applied based on the
                    customer's delivery area selected in the checkout form.
                  </Text>
                </div>
              </AppCard>
            </div>
          </Col>

          {/* SIDEBAR: CATEGORIES */}
          <Col xs={24} lg={8}>
            <AppCard className="overflow-hidden border-none shadow-md!">
              <div className="p-1 px-4 mb-6 bg-emerald-50 -mx-6 -mt-6 flex items-center gap-2 h-12">
                <FiGrid className="text-emerald-600" />
                <Text
                  strong
                  className="text-emerald-900 uppercase tracking-wider text-xs"
                >
                  Categories Management
                </Text>
              </div>

              <div className="space-y-4!">
                <div className="flex gap-2">
                  <AppInput
                    placeholder="New Category Name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onPressEnter={handleAddCategory}
                    className="h-10! rounded-lg!"
                  />
                  <AppButton
                    type="primary"
                    icon={<FiPlus />}
                    onClick={handleAddCategory}
                    className="bg-emerald-600! h-10!"
                  >
                    Add
                  </AppButton>
                </div>

                <List
                  dataSource={categories}
                  renderItem={(item) => (
                    <List.Item
                      className="px-0! group"
                      actions={[
                        <AppPopconfirm
                          key="del"
                          title="Permanently remove category?"
                          onConfirm={() => handleDeleteCategory(item.id)}
                        >
                          <FiTrash2 className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors opacity-0 group-hover:opacity-100" />
                        </AppPopconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="small"
                            className="bg-emerald-100! text-emerald-600! font-bold"
                          >
                            {item.name[0]}
                          </Avatar>
                        }
                        title={
                          <Text className="font-medium text-slate-700">
                            {item.name}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: "No categories added yet" }}
                  className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                />
              </div>
            </AppCard>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default LandingSettings;
