import React from "react";
import { Card, Statistic, Col, Row, Typography } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title, Text } = Typography;

const DashboardOverview: React.FC = () => {
  // Bangladeshi e-commerce focused demo data
  const salesData = [
    { name: "Jan", sales: 420000 },
    { name: "Feb", sales: 380000 },
    { name: "Mar", sales: 520000 },
    { name: "Apr", sales: 490000 },
    { name: "May", sales: 650000 },
    { name: "Jun", sales: 610000 },
  ];

  const orderStatusData = [
    { name: "Pending", value: 45 },
    { name: "Processing", value: 80 },
    { name: "Shipped", value: 120 },
    { name: "Delivered", value: 260 },
    { name: "Cancelled", value: 20 },
  ];

  const PIE_COLORS = [
    "#16a34a", // green
    "#2563eb", // blue
    "#f59e0b", // amber
    "#22c55e", // success
    "#ef4444", // red
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={3} className="mb-0!">📊 ShowCase Dashboard</Title>
          <Text type="secondary">
            Overview of your ShowCase online store performance
          </Text>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Revenue</Text>}
              value={3050000}
              suffix="৳"
              prefix={<DollarOutlined className="text-green-600" />}
              valueStyle={{ color: "#166534" }}
            />
            <Text className="text-xs">↑ 18% from last month</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Orders</Text>}
              value={1240}
              prefix={<ShoppingCartOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1d4ed8" }}
            />
            <Text className="text-xs">This month</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title={<Text type="secondary">New Customers</Text>}
              value={320}
              prefix={<UserOutlined className="text-purple-600" />}
              valueStyle={{ color: "#6d28d9" }}
            />
            <Text className="text-xs">Last 30 days</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title={<Text type="secondary">Conversion Rate</Text>}
              value={3.6}
              suffix="%"
              prefix={<RiseOutlined className="text-emerald-600" />}
              valueStyle={{ color: "#047857" }}
            />
            <Text className="text-xs">Industry avg 2.8%</Text>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={15}>
          <Card
            title="Monthly Sales (৳)"
            className="rounded-2xl shadow-sm"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} barSize={42}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `৳ ${value}`} />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="#16a34a"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Order Status Breakdown"
            className="rounded-2xl shadow-sm"
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;