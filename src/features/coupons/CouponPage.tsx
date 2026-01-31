import React, { useState } from "react";
import {
    Table,
    Space,
    Card,
    Typography,
    Modal,
    Tag,
    Form,
    DatePicker,
    Row,
    Col,
} from "antd";
import AppSelect from "../../components/common/AppSelect";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import type { Coupon } from "../../types";

import {
    useGetCouponsQuery,
    useAddCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} from "../../RTK/coupon/couponApi";

import AppButton from "../../components/common/AppButton";
import toast from "../../utils/toast";
import AppInput from "@/components/common/AppInput";
import AppPopconfirm from "@/components/common/AppPopconfirm";
import AppSpin from "@/components/common/AppSpin";

const { Title, Text } = Typography;
const { Option } = AppSelect;
const { RangePicker } = DatePicker;

const CouponPage: React.FC = () => {
    const { data: coupons = [], isLoading: tableLoading } = useGetCouponsQuery({});
    const [addCoupon, { isLoading: isAdding }] = useAddCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [form] = Form.useForm();

    const formLoading = isAdding || isUpdating;

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
            await deleteCoupon(id).unwrap();
            toast.success("Coupon deleted successfully!");
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
                discountValue: Number(values.discountValue),
                minOrderValue: Number(values.minOrderValue || 0),
                usageLimit: Number(values.usageLimit),
                status: values.status,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
            };

            if (editingCoupon) {
                await updateCoupon({ id: editingCoupon.id, ...payload }).unwrap();
                toast.success("Coupon updated successfully!");
            } else {
                await addCoupon(payload).unwrap();
                toast.success("Coupon added successfully!");
            }
            setIsModalOpen(false);
        } catch (err) {
            // Form validation failed or API error
            console.error(err);
        }
    };

    const columns: TableProps<Coupon>["columns"] = [
        {
            title: "Code",
            dataIndex: "code",
            render: (code) => <Text strong copyable>{code}</Text>,
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
            render: (v) => v ? `৳ ${v}` : "-",
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
                const color = status === "Active" ? "success" : status === "Expired" ? "error" : "default";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Actions",
            align: "right",
            render: (_, r) => (
                <Space>
                    <AppButton icon={<FiEdit />} onClick={() => handleEdit(r)} />
                    <AppPopconfirm title="You want to delete this coupon?" onConfirm={() => handleDelete(r.id)}>
                        <AppButton danger title="Delete" icon={<FiTrash2 />} loading={isDeleting} />
                    </AppPopconfirm>
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
                        <AppButton
                            type="primary"
                            icon={<FiPlus />}
                            onClick={handleAdd}
                        >
                            Add Coupon
                        </AppButton>
                    </Col>
                </Row>
                <AppSpin spinning={tableLoading}>
                    <Table
                        loading={tableLoading}
                        columns={columns}
                        dataSource={coupons}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </AppSpin>
            </Card>

            <Modal
                title={editingCoupon ? "Edit Coupon" : "New Coupon"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                okText={editingCoupon ? "Update" : "Save"}
                confirmLoading={formLoading}
                okButtonProps={{ className: "bg-violet-500!" }}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
                                <AppInput placeholder="e.g. SALE2024" style={{ textTransform: "uppercase" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Status" initialValue="Active">
                                <AppSelect>
                                    <Option value="Active">Active</Option>
                                    <Option value="Inactive">Inactive</Option>
                                </AppSelect>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="discountType" label="Type" initialValue="flat">
                                <AppSelect>
                                    <Option value="flat">Flat Amount (৳)</Option>
                                    <Option value="percentage">Percentage (%)</Option>
                                </AppSelect>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="discountValue" label="Value" rules={[{ required: true }]}>
                                <AppInput className="w-full" min={0} type="number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="validity" label="Validity Period" rules={[{ required: true }]}>
                        <RangePicker className="w-full" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="minOrderValue" label="Min Order Value">
                                <AppInput className="w-full" min={0} type="number" placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="usageLimit" label="Usage Limit">
                                <AppInput className="w-full" min={0} type="number" placeholder="100" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CouponPage;
