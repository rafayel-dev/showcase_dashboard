import React from "react";
import { Card, Statistic, Col, Row } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
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

const DashboardOverview: React.FC = () => {
  // Placeholder data for charts
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4500 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 5500 },
  ];

  const orderStatusData = [
    { name: "Pending", value: 30 },
    { name: "Processing", value: 50 },
    { name: "Shipped", value: 80 },
    { name: "Delivered", value: 120 },
    { name: "Cancelled", value: 10 },
  ];

  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        {/* Sales Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Sales"
              value={12345}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="BDT"
            />
            <p className="text-sm text-gray-500 mt-2">Compared to last month</p>
          </Card>
        </Col>

        {/* Orders Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="New Orders"
              value={10}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
            />
            <p className="text-sm text-gray-500 mt-2">Today</p>
          </Card>
        </Col>

        {/* Customers Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="New Orders"
              value={15}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
            <p className="text-sm text-gray-500 mt-2">This week</p>
          </Card>
        </Col>

        {/* Sales Trends Bar Chart */}
        <Col xs={24} lg={12}>
          <Card title="Sales Trends (Last 6 Months)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Order Status Distribution Pie Chart */}
        <Col xs={24} lg={12}>
          <Card title="Order Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {orderStatusData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
