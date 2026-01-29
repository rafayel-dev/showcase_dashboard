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
import { useGetDashboardStatsQuery } from "../../RTK/dashboard/dashboardApi";

const { Title, Text } = Typography;

const DashboardOverview: React.FC = () => {
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();

  const salesData = statsData?.salesData || [];
  const orderStatusData = statsData?.orderStatusData || [];
  const PIE_COLORS = [
    "#8B5CF6",
    "#ef23d3",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#9ca3af",
    

  ];

  const stats = [
    {
      title: "Total Revenue",
      value: statsData?.totalRevenue || 0,
      suffix: "৳",
      icon: <DollarOutlined className="text-2xl!" />,
      color: "bg-green-100 text-green-600",
      note: "Lifetime",
    },
    {
      title: "Total Orders",
      value: statsData?.totalOrders || 0,
      icon: <ShoppingCartOutlined className="text-2xl!" />,
      color: "bg-blue-100 text-blue-600",
      note: "Lifetime",
    },
    {
      title: "Total Delivered",
      value: statsData?.totalDelivered || 0,
      icon: <UserOutlined className="text-2xl!" />,
      color: "bg-purple-100 text-purple-600",
      note: "Successful Orders",
    },
    {
      title: "Avg Order Value",
      value: statsData?.totalOrders ? Math.round(statsData.totalRevenue / statsData.totalOrders) : 0,
      suffix: "৳",
      icon: <RiseOutlined className="text-2xl!" />,
      color: "bg-emerald-100 text-emerald-600",
      note: "Revenue / Orders",
    },
  ];

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <Title level={3} className="mb-1!">📊 ShowCase Dashboard</Title>
        <Text type="secondary">Real-time overview of your store’s performance</Text>
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
              <Title level={5} className="mb-0!">Monthly Sales</Title>
              <Text type="secondary" className="text-xs">Revenue trend in Bangladeshi Taka</Text>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} barSize={40}>
                <XAxis dataKey="name" tickLine={true} axisLine={true} />
                <YAxis tickLine={true} axisLine={true} />
                <Tooltip formatter={(v: any) => `৳ ${v}`} cursor={{ fill: 'transparent' }} />
                <Legend iconType="circle" />
                <Bar dataKey="sales" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card className="rounded-2xl shadow-sm" bordered={false}>
            <div className="mb-6">
              <Title level={5} className="mb-0!">Order Status</Title>
              <Text type="secondary" className="text-xs">Distribution of order lifecycle</Text>
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
                  {orderStatusData.map((_: any, index: number) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
