import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Modal,
  Form,
  Row,
  Col,
  Tag,
  Empty,
} from "antd";
import { FiPlus, FiTrash2, FiShield } from "react-icons/fi";
import type { TableProps } from "antd";
import type { Admin } from "../../types";
import {
  useGetAdminsQuery,
  useAddAdminMutation,
  useDeleteAdminMutation,
} from "../../RTK/admin/adminApi";
import toast from "../../utils/toast";
import AppPopconfirm from "@/components/common/AppPopconfirm";
import AppInput from "@/components/common/AppInput";
import AppSpin from "@/components/common/AppSpin";

const { Title, Text } = Typography;

/* ================= ROLE COLOR ================= */
const roleColor = (role: string) => {
  switch (role) {
    case "super_admin":
      return "violet";
    case "admin":
      return "blue";
    default:
      return "default";
  }
};

const AdminPage: React.FC = () => {
  const { data: admins = [], isLoading: tableLoading } = useGetAdminsQuery();
  const [addAdmin, { isLoading: formLoading }] = useAddAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // LoadAdmins useEffect is no longer needed as useGetAdminsQuery handles fetching

  /* ================= ADD MODAL ================= */
  const openAddModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await deleteAdmin(id).unwrap();
      toast.success("Administrator deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || error.message || "Failed to delete administrator");
    }
  };

  /* ================= SAVE (ADD ONLY) ================= */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      await addAdmin(values).unwrap();

      toast.success("Administrator added successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      toast.error(error?.data?.message || error.message || "Failed to add administrator");
    }
  };

  /* ================= TABLE ================= */
  const columns: TableProps<Admin>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <Tag color={roleColor(role)}>
          <span className="flex items-center gap-1">
            <FiShield />
            {role}
          </span>
        </Tag>
      ),
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <AppPopconfirm
          placement="topRight"
          title="Delete this admin?"
          description="This action cannot be undone"
          okText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button title="Delete Admin" danger icon={<FiTrash2 />}>
            Delete
          </Button>
        </AppPopconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="rounded-2xl shadow-sm">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={3} className="mb-0">
              Admin Management
            </Title>
            <Text type="secondary">Control dashboard access & permissions</Text>
          </Col>

          <Col>
            <Button
              type="primary"
              className="bg-violet-500!"
              icon={<FiPlus />}
              onClick={openAddModal}
            >
              Add Admin
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <AppSpin spinning={tableLoading}>
          <Table
            rowKey="id"
            dataSource={admins}
            columns={columns}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No admins found" />,
            }}
          />
        </AppSpin>
      </Card>

      {/* ADD MODAL */}
      <Modal
        title="Add New Administrator"
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Add Admin"
        confirmLoading={formLoading}
        destroyOnClose
        okButtonProps={{ className: "bg-violet-500!" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <AppInput placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <AppInput placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6 }]}
          >
            <AppInput.Password placeholder="Enter password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
