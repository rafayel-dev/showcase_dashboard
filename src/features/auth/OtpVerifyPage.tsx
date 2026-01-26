import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Typography, Alert, ConfigProvider } from "antd";
import { SafetyCertificateOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import toast from "../../utils/toast";
import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "../../RTK/auth/authApi";

const { Title, Text } = Typography;

const OtpVerifyPage: React.FC = () => {
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const onFinish = async (values: any) => {
        setError("");
        try {
            const { otp } = values;
            await verifyOtp({ email, otp }).unwrap();

            toast.success("Email verified successfully!");
            // Navigate to reset password page, passing email and otp/token if needed
            navigate("/reset-password", { state: { email, otp } });
        } catch (err: any) {
            console.error("Verification failed:", err);
            const message = err?.data?.message || err?.error || "Invalid code. Please try again.";
            setError(message);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        try {
            await forgotPassword({ email }).unwrap();
            toast.success("Code resent successfully!");
        } catch (err) {
            toast.error("Failed to resend code.");
        }
    };

    // Redirect if no email in state
    if (!email) {
        navigate("/forgot-password");
        return null;
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
                                <SafetyCertificateOutlined className="text-3xl" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Security Verification</h2>
                            <p className="text-violet-100 opacity-90 max-w-xs mx-auto">
                                We've sent a 6-digit verification code to <strong>{email}</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8 text-center md:text-left">
                            <Link to="/forgot-password" className="inline-flex items-center text-sm text-gray-400 hover:text-violet-600 mb-6 transition-colors">
                                <ArrowLeftOutlined className="mr-2" /> Back
                            </Link>
                            <Title level={2} className="m-0! mb-2!">Enter OTP</Title>
                            <Text type="secondary">Please check your inbox and enter the code below.</Text>
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
                            name="otp-verify"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                label="Verification Code"
                                name="otp"
                                rules={[
                                    { required: true, message: "Please input the verification code!" },
                                    { len: 6, message: "Code must be 6 digits" }
                                ]}
                                className="mb-6"
                            >
                                <AppInput
                                    maxLength={6}
                                    prefix={<SafetyCertificateOutlined className="text-gray-400 pr-2" />}
                                    placeholder="Ex: 123456"
                                />
                            </Form.Item>

                            <Form.Item>
                                <AppButton
                                    type="primary"
                                    htmlType="submit"
                                    loading={isVerifying}
                                    block
                                >
                                    Verify Code
                                </AppButton>
                            </Form.Item>

                            <div className="text-center mt-4">
                                <Text type="secondary" className="text-sm">
                                    Didn't receive the email?{" "}
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isResending}
                                        className="text-violet-600 font-semibold hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending ? "Resending..." : "Click to resend"}
                                    </button>
                                </Text>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default OtpVerifyPage;
