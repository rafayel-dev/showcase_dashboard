import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Typography, Alert, ConfigProvider } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import toast from "../../utils/toast";
import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";

import { useForgotPasswordMutation } from "../../RTK/auth/authApi";

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
    const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setError("");
        try {
            const { email } = values;
            await forgotPassword({ email }).unwrap();

            toast.success("Verification code sent to your email!");
            // Navigate to OTP page, passing email in state if needed
            navigate("/otp-verify", { state: { email } });
        } catch (err: any) {
            console.error("Failed:", err);
            const message = err?.data?.message || err?.error || "Something went wrong. Please try again.";
            setError(message);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#7c3aed",
                    borderRadius: 8,
                },
            }}
        >
            <div className="min-h-screen flex items-center justify-center font-nunito p-4">
                {/* Decorative Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-violet-100 rounded-full blur-[120px] opacity-50 translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px] opacity-50 -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[500px]">
                    {/* Left Side - Brand/Image */}
                    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-linear-to-br from-violet-600 to-indigo-700 text-white p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <MailOutlined className="text-3xl" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Forgot Password?</h2>
                            <p className="text-violet-100 opacity-90 max-w-xs mx-auto">
                                No worries! Enter your email address and we'll send you a code to reset your password.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8 text-center md:text-left">
                            <Link to="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-violet-600 mb-6 transition-colors">
                                <ArrowLeftOutlined className="mr-2" /> Back to Login
                            </Link>
                            <Title level={2} className="m-0! mb-2!">Reset Password</Title>
                            <Text type="secondary">Enter your registered email address.</Text>
                        </div>

                        {error && (
                            <Alert
                                message={error}
                                type="error"
                                showIcon
                                className="mb-6 border-red-100 bg-red-50 text-red-600 rounded-lg"
                            />
                        )}

                        <Form
                            name="forgot-password"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: "Please input your Email!" },
                                    { type: "email", message: "Please enter a valid email!" }
                                ]}
                                className="mb-8"
                            >
                                <AppInput
                                    prefix={<MailOutlined className="text-gray-400 pr-2" />}
                                    placeholder="Enter your email"
                                />
                            </Form.Item>

                            <Form.Item>
                                <AppButton
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                >
                                    Send Verification Code
                                </AppButton>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ForgotPasswordPage;
