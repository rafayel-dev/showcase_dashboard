import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Typography, Alert, ConfigProvider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import toast from "../../utils/toast";
import { useLoginMutation } from "../../RTK/auth/authApi";
import AppInput from "@/components/common/AppInput";

const { Title, Text } = Typography;

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setError("");
    try {
      const { email, password } = values;
      const response = await login({ email, password }).unwrap();
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      onLogin(); // Update global auth state (if any)
      navigate("/");
      toast.success("Welcome back! 👋");
    } catch (err: any) {
      console.error("Login failed:", err);
      // Try to extract error message from API response
      const message = err?.data?.message || err?.error || "Invalid credentials. Please try again.";
      setError(message);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7c3aed", // Violet-600
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

        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-125">
          {/* Left Side - Brand/Image */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-linear-to-br from-violet-600 to-indigo-700 text-white p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Showcase Admin</h2>
              <p className="text-violet-100 opacity-90">Manage your products and orders efficiently.</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8 text-center md:text-left">
              <Title level={2} className="m-0!">Welcome Back</Title>
              <Text type="secondary">Please enter your details to sign in.</Text>
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
              name="login"
              initialValues={{
                email: "rafayel.dev7@gmail.com",
                password: "12345678",
              }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[{ required: true, message: "Please input your Email!" }]}
              >
                <AppInput
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}
                className="mb-8"
              >
                <AppInput.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  className="bg-violet-600 hover:bg-violet-700 h-11 font-semibold text-lg shadow-lg shadow-violet-200"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-4">
              <Text type="secondary" className="text-sm">
                Forgot password? <Link to="/forgot-password" className="text-violet-600 font-semibold hover:underline">Reset it here</Link>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;
