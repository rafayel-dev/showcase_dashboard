import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Typography, Alert, ConfigProvider } from "antd";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import toast from "../../utils/toast";
import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { useResetPasswordMutation } from "../../RTK/auth/authApi";

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
    const [resetPassword, { isLoading: loading }] = useResetPasswordMutation();
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};

    const onFinish = async (values: any) => {
        setError("");
        try {
            const { password, confirm } = values;
            await resetPassword({
                email,
                otp,
                newPassword: password,
                confirmPassword: confirm
            }).unwrap();

            toast.success("Password reset successfully! Login now.");
            navigate("/login");
        } catch (err: any) {
            console.error("Reset failed:", err);
            const message = err?.data?.message || err?.error || "Failed to reset password. Please try again.";
            setError(message);
        }
    };

    // Redirect if missing state
    if (!email || !otp) {
        // You might want to handle this gracefully or redirect back to start
        // navigate("/forgot-password"); 
        // For now, let's just return null or allow them to see the page but it will fail on submit
    }

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
                                <CheckCircleOutlined className="text-3xl" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Reset Password</h2>
                            <p className="text-violet-100 opacity-90 max-w-xs mx-auto">
                                Create a strong password to keep your account secure.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8 text-center md:text-left">
                            <Title level={2} className="m-0! mb-2!">Set New Password</Title>
                            <Text type="secondary">Enter your new password below.</Text>
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
                            name="reset-password"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                label="New Password"
                                name="password"
                                rules={[
                                    { required: true, message: "Please input your new password!" },
                                    { min: 6, message: "Password must be at least 6 characters" }
                                ]}
                            >
                                <AppInput.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder="Enter new password"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: "Please confirm your password!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                                className="mb-8"
                            >
                                <AppInput.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder="Confirm new password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <AppButton
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                >
                                    Reset Password
                                </AppButton>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ResetPasswordPage;
