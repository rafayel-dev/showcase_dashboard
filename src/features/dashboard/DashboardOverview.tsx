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
    "#9ca3af",
    "#3b82f6",
    "#f59e0b",
    "#8B5CF6",
    "#ef4444",
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
        {[
          {
            title: "Total Revenue",
            value: 3050000,
            suffix: "৳",
            icon: <DollarOutlined className="text-2xl!"/>,
            color: "bg-green-100 text-green-600",
            note: "↑ 18% from last month",
          },
          {
            title: "Total Orders",
            value: 940,
            icon: <ShoppingCartOutlined className="text-2xl!"/>,
            color: "bg-blue-100 text-blue-600",
            note: "This month",
          },
          {
            title: "Total Delivery",
            value: 20,
            icon: <UserOutlined className="text-2xl!"/>,
            color: "bg-purple-100 text-purple-600",
            note: "Last 7 days",
          },
          {
            title: "Conversion Rate",
            value: 3.6,
            suffix: "%",
            icon: <RiseOutlined className="text-2xl!"/>,
            color: "bg-emerald-100 text-emerald-600",
            note: "Industry avg 2.8%",
          },
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="rounded-2xl shadow-sm transition">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.color}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <Text type="secondary" className="text-sm!">
                    {item.title}
                  </Text>
                  <Statistic
                  className="font-semibold"
                    value={item.value}
                    suffix={item.suffix}
                    valueStyle={{ fontSize: 22 }}
                  />
                </div>
              </div>
              <Text className="text-xs text-gray-400!">
                {item.note}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== CHARTS ===== */}
      <Row gutter={[20, 20]} className="mt-8">
        <Col xs={24} lg={15}>
          <Card className="rounded-2xl shadow-sm">
            <div className="mb-4">
              <Title level={5} className="mb-0!">
                Monthly Sales
              </Title>
              <Text type="secondary" className="text-xs">
                Revenue trend in Bangladeshi Taka
              </Text>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} barSize={40}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => `৳ ${v}`} />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="#8B5CF6"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card className="rounded-2xl shadow-sm">
            <div className="mb-4">
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
                  innerRadius={70}
                  outerRadius={115}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={index}
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
