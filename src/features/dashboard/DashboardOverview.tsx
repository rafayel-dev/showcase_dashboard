import React from "react";
import { Card, Row, Col, Typography } from "antd";
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
import StatsCard from "../../components/common/StatsCard";

const { Title, Text } = Typography;

const DashboardOverview: React.FC = () => {
  // Mock Data (Ideally comes from API)
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

  const PIE_COLORS = ["#9ca3af", "#3b82f6", "#f59e0b", "#8B5CF6", "#ef4444"];

  const stats = [
    {
      title: "Total Revenue",
      value: 3050000,
      suffix: "৳",
      icon: <DollarOutlined className="text-2xl!" />,
      color: "bg-green-100 text-green-600",
      note: "↑ 18% from last month",
    },
    {
      title: "Total Orders",
      value: 940,
      icon: <ShoppingCartOutlined className="text-2xl!" />,
      color: "bg-blue-100 text-blue-600",
      note: "This month",
    },
    {
      title: "Total Delivery",
      value: 20,
      icon: <UserOutlined className="text-2xl!" />,
      color: "bg-purple-100 text-purple-600",
      note: "Last 7 days",
    },
    {
      title: "Conversion Rate",
      value: 3.6,
      suffix: "%",
      icon: <RiseOutlined className="text-2xl!" />,
      color: "bg-emerald-100 text-emerald-600",
      note: "Industry avg 2.8%",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <Title level={3} className="mb-1!">
          📊 ShowCase Dashboard
        </Title>
        <Text type="secondary">
          Real-time overview of your store’s performance
        </Text>
      </div>

      {/* ===== KPI CARDS ===== */}
      <Row gutter={[20, 20]}>
        {stats.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <StatsCard {...s} />
          </Col>
        ))}
      </Row>

      {/* ===== CHARTS ===== */}
      <Row gutter={[20, 20]} className="mt-8">
        <Col xs={24} lg={15}>
          <Card className="rounded-2xl shadow-sm" bordered={false}>
            <div className="mb-6">
              <Title level={5} className="mb-0!">
                Monthly Sales
              </Title>
              <Text type="secondary" className="text-xs">
                Revenue trend in Bangladeshi Taka
              </Text>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} barSize={40}>
                <XAxis dataKey="name" tickLine={true} axisLine={true} />
                <YAxis tickLine={true} axisLine={true} />
                <Tooltip
                  formatter={(v) => `৳ ${v}`}
                  cursor={{ fill: "transparent" }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="sales" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card className="rounded-2xl shadow-sm" bordered={false}>
            <div className="mb-6">
              <Title level={5} className="mb-0!">
                Order Status
              </Title>
              <Text type="secondary" className="text-xs">
                Distribution of order lifecycle
              </Text>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
