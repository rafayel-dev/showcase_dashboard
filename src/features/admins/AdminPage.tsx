import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Spin,
  Row,
  Col,
  Tag,
  Empty,
} from "antd";
import { FiPlus, FiTrash2, FiShield } from "react-icons/fi";
import type { TableProps } from "antd";
import type { Admin } from "../../types";
import {
  fetchAdmins,
  addAdmin,
  deleteAdmin,
} from "../../services/adminService";
import toast from "../../../utils/toast";

const { Title, Text } = Typography;

/* ================= ROLE COLOR ================= */
const roleColor = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "violet";
    case "Admin":
      return "blue";
    default:
      return "default";
  }
};

const AdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAdmins();
  }, []);

  /* ================= LOAD ================= */
  const loadAdmins = async () => {
    setTableLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch {
      toast.error("Failed to load administrators");
    } finally {
      setTableLoading(false);
    }
  };

  /* ================= ADD MODAL ================= */
  const openAddModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    setTableLoading(true);
    try {
      await deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success("Administrator deleted successfully");
    } catch {
      toast.error("Failed to delete administrator");
    } finally {
      setTableLoading(false);
    }
  };

  /* ================= SAVE (ADD ONLY) ================= */
  const handleSave = async () => {
    try {
      setFormLoading(true);
      const values = await form.validateFields();

      const created = await addAdmin(values);
      setAdmins((prev) => [...prev, created]);

      toast.success("Administrator added successfully");
      setModalOpen(false);
      form.resetFields();
    } catch {
      toast.error("Failed to add administrator");
    } finally {
      setFormLoading(false);
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
        <Popconfirm
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
        </Popconfirm>
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
            <Text type="secondary">
              Control dashboard access & permissions
            </Text>
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
        <Spin spinning={tableLoading}>
          <Table
            rowKey="id"
            dataSource={admins}
            columns={columns}
            pagination={{ pageSize: 6 }}
            locale={{
              emptyText: <Empty description="No admins found" />,
            }}
          />
        </Spin>
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
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
