import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
  Row,
  Col,
  Tooltip,
  Tag,
  Empty,
} from "antd";
import { FiPlus, FiEdit2, FiTrash2, FiShield } from "react-icons/fi";
import type { TableProps } from "antd";
import type { Admin } from "../../types";
import {
  fetchAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/adminService";

const { Title, Text } = Typography;
const { Option } = Select;

const roleColor = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "red";
    case "Admin":
      return "blue";
    case "Editor":
      return "gold";
    default:
      return "default";
  }
};

const AdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setTableLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch {
      message.error("Failed to load administrators");
    } finally {
      setTableLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAdmin(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Admin) => {
    setEditingAdmin(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setTableLoading(true);
    try {
      await deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      message.success("Administrator deleted successfully");
    } catch {
      message.error("Failed to delete administrator");
    } finally {
      setTableLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setFormLoading(true);
      const values = await form.validateFields();

      if (editingAdmin) {
        const updated = await updateAdmin({
          ...editingAdmin,
          ...values,
        });
        setAdmins((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a)),
        );
        message.success("Administrator updated successfully");
      } else {
        const created = await addAdmin(values);
        setAdmins((prev) => [...prev, created]);
        message.success("Administrator added successfully");
      }

      setModalOpen(false);
      setEditingAdmin(null);
      form.resetFields();
    } catch {
      message.error("Failed to save administrator");
    } finally {
      setFormLoading(false);
    }
  };

  const columns: TableProps<Admin>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <Tag color={roleColor(role)}>
          <span className="flex justify-center items-center gap-1">
            {<FiShield />}
            {role}
          </span>
        </Tag>
      ),
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Admin">
            <Button icon={<FiEdit2 />} onClick={() => openEditModal(record)}>
              Edit
            </Button>
          </Tooltip>

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
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="rounded-2xl">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={3} className="mb-0">
              Admin Management
            </Title>
            <Text type="secondary">Control dashboard access & permissions</Text>
          </Col>

          <Col>
            <Button type="primary" icon={<FiPlus />} onClick={openAddModal}>
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

      {/* Add / Edit Modal */}
      <Modal
        title={editingAdmin ? "Edit Administrator" : "Add New Administrator"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={editingAdmin ? "Update Admin" : "Add Admin"}
        confirmLoading={formLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Admin full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input placeholder="admin@email.com" />
          </Form.Item>

          {!editingAdmin && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <Input.Password placeholder="******" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              <Option value="Super Admin">Super Admin</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Editor">Editor</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
