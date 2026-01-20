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
  Spin,
  Row,
  Col,
  Tooltip,
  Empty,
} from "antd";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { TableProps } from "antd";
import type { Category } from "../../types";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import toast from "../../../utils/toast";

const { Title, Text } = Typography;

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setTableLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setTableLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setTableLoading(true);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setTableLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setFormLoading(true);
      const values = await form.validateFields();

      if (editingCategory) {
        const updated = await updateCategory({
          ...editingCategory,
          ...values,
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
        toast.success("Category updated successfully");
      } else {
        const created = await addCategory(values);
        setCategories((prev) => [...prev, created]);
        toast.success("Category added successfully");
      }

      setModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setFormLoading(false);
    }
  };

  const columns: TableProps<Category>["columns"] = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => text || <Text type="secondary">—</Text>,
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Category">
            <Button icon={<FiEdit2 />} onClick={() => openEditModal(record)}>
              Edit
            </Button>
          </Tooltip>

          <Popconfirm
          placement="topRight"
            title="Delete this category?"
            description="This action cannot be undone"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button title="Delete Category" danger icon={<FiTrash2 />}>
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
              Category Management
            </Title>
            <Text type="secondary">
              Organize your products with proper categories
            </Text>
          </Col>

          <Col>
            <Button type="primary" icon={<FiPlus />} onClick={openAddModal}>
              Add Category
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Spin spinning={tableLoading}>
          <Table
            rowKey="id"
            dataSource={categories}
            columns={columns}
            pagination={{ pageSize: 6 }}
            locale={{
              emptyText: <Empty description="No categories found" />,
            }}
          />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={formLoading}
        okText={editingCategory ? "Update Category" : "Add Category"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Category name is required" }]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
