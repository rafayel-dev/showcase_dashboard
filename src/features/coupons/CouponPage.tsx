import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Modal,
  Tag,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import type { Coupon } from "../../types";
import {
  fetchCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../services/couponService";
import AppButton from "../../components/common/AppButton";
import toast from "../../utils/toast";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CouponPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      ...coupon,
      validity: [dayjs(coupon.startDate), dayjs(coupon.endDate)],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted!");
      loadCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.validity;

      const payload: any = {
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderValue: values.minOrderValue,
        usageLimit: values.usageLimit,
        status: values.status,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };

      if (editingCoupon) {
        await updateCoupon({ ...editingCoupon, ...payload });
        toast.success("Coupon updated!");
      } else {
        await addCoupon({
          ...payload,
          id: "", // Service will handle ID
          usedCount: 0,
        });
        toast.success("Coupon added!");
      }
      setIsModalOpen(false);
      loadCoupons();
    } catch {
      // Form validation failed
    }
  };

  const columns: TableProps<Coupon>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      render: (code) => (
        <Text strong copyable>
          {code}
        </Text>
      ),
    },
    {
      title: "Discount",
      render: (_, r) => (
        <Tag color="cyan">
          {r.discountValue}
          {r.discountType === "percentage" ? "%" : "৳"}
        </Tag>
      ),
    },
    {
      title: "Min Order",
      dataIndex: "minOrderValue",
      render: (v) => (v ? `৳ ${v}` : "-"),
    },
    {
      title: "Validity",
      render: (_, r) => (
        <div className="text-xs text-gray-500">
          <div>{dayjs(r.startDate).format("DD MMM YYYY")}</div>
          <div>to {dayjs(r.endDate).format("DD MMM YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Usage",
      render: (_, r) => (
        <Text>
          {r.usedCount} / {r.usageLimit || "∞"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const color =
          status === "Active"
            ? "success"
            : status === "Expired"
              ? "error"
              : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      align: "right",
      render: (_, r) => (
        <Space>
          <Button icon={<FiEdit />} onClick={() => handleEdit(r)} />
          <Popconfirm
            title="Delete coupon?"
            onConfirm={() => handleDelete(r.id)}
          >
            <Button danger icon={<FiTrash2 />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="rounded-2xl">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={3}>Coupon Management</Title>
            <Text type="secondary">Manage discount codes and promotions</Text>
          </Col>
          <Col>
            <AppButton type="primary" icon={<FiPlus />} onClick={handleAdd}>
              Add Coupon
            </AppButton>
          </Col>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={coupons}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingCoupon ? "Edit Coupon" : "New Coupon"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Save"
        okButtonProps={{ className: "bg-violet-500!" }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Coupon Code"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="e.g. SALE2024"
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Active">
                <Select>
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountType" label="Type" initialValue="flat">
                <Select>
                  <Option value="flat">Flat Amount (৳)</Option>
                  <Option value="percentage">Percentage (%)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discountValue"
                label="Value"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="validity"
            label="Validity Period"
            rules={[{ required: true }]}
          >
            <RangePicker className="w-full" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minOrderValue" label="Min Order Value">
                <InputNumber className="w-full" min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usageLimit" label="Usage Limit">
                <InputNumber className="w-full" min={0} placeholder="100" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponPage;
