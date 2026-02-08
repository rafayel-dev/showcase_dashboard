import React from "react";
import AppCard from "../../../components/common/AppCard";
import { Form, Input, InputNumber, Divider, Row, Col, Button } from "antd";
import { FiSave, FiLayout } from "react-icons/fi";

import toast from "../../../utils/toast";

const LandingForm: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log("Success:", values);
        toast.success("Landing page settings saved successfully!");
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                announcementText: "অফারটি শেষ হতে আর অল্প কিছুক্ষণ বাকি! দ্রুত অর্ডার করুন।",
                phoneNumber: "+8801751876070",
                whatsappNumber: "+8801751876070",
                productName: "Premium Wireless Earbuds Pro - হাই-কোয়ালিটি সাউন্ড ও মেটাল বডি",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                regularPrice: 2500,
                discountPrice: 1250,
                discountText: "৫০% ছাড়",
            }}
        >
            <div className="flex justify-end mb-4">
                <Button type="primary" icon={<FiSave />} size="large" onClick={() => form.submit()} className="bg-violet-600">
                    Save Changes
                </Button>
            </div>

            <Row gutter={24}>
                <Col span={24} lg={16}>
                    {/* GENERAL SETTINGS */}
                    <AppCard className="mb-6 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">General Settings</h3>
                        <Form.Item label="Top Announcement Bar Text" name="announcementText" rules={[{ required: true }]}>
                            <Input placeholder="Enter announcement text" className="rounded-md" />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Contact Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                                    <Input placeholder="+8801..." className="rounded-md" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="WhatsApp Number" name="whatsappNumber" rules={[{ required: true }]}>
                                    <Input placeholder="+8801..." className="rounded-md" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </AppCard>

                    {/* HERO PRODUCT INFO */}
                    <AppCard className="mb-6 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Hero Product Information</h3>
                        <Form.Item label="Product Name / Headline" name="productName" rules={[{ required: true }]}>
                            <Input.TextArea rows={2} placeholder="Enter product name" className="rounded-md" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Regular Price (Old)" name="regularPrice" rules={[{ required: true }]}>
                                    <InputNumber className="w-full rounded-md" prefix="৳" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Discount Price (New)" name="discountPrice" rules={[{ required: true }]}>
                                    <InputNumber className="w-full rounded-md" prefix="৳" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Discount Badge Text" name="discountText">
                                    <Input placeholder="e.g. 50% Off" className="rounded-md" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </AppCard>

                    {/* Description */}
                    <AppCard className="mb-6 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Description</h3>
                        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} placeholder="Enter description" className="rounded-md" />
                        </Form.Item>
                    </AppCard>
                    {/* MEDIA SETTINGS */}
                    <AppCard className="mb-6 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Media Settings</h3>
                        <Form.Item label="YouTube Video Embed URL" name="videoUrl" rules={[{ required: true }]}>
                            <Input placeholder="https://www.youtube.com/embed/..." className="rounded-md" />
                        </Form.Item>
                        {/* Future: Image Uploaders */}
                        <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                            <div className="text-4xl mb-2">🖼️</div>
                            Image management coming soon...
                        </div>
                    </AppCard>
                </Col>

                <Col span={24} lg={8}>
                    {/* SIDEBAR / HELP / PREVIEW LINKS */}
                    <div className="sticky top-6">
                        <AppCard className="rounded-2xl border-l-4 border-l-violet-500">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Actions</h3>
                            <div className="space-y-3">
                                <div
                                    onClick={() => window.open("http://localhost:3000", "_blank")}
                                    className="p-3 bg-violet-50 text-violet-700 rounded-lg cursor-pointer hover:bg-violet-100 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <FiLayout /> Preview Live Site
                                </div>
                                <Divider className="my-3" />
                                <p className="text-xs text-gray-400 text-center">
                                    Status: <span className="text-green-500 font-bold">Active</span>
                                </p>
                            </div>
                        </AppCard>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default LandingForm;
