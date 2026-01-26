import React, { useState } from "react";
import {
  Table,
  Space,
  Typography,
  Form,
  Tooltip,
  Empty,
} from "antd";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { TableProps } from "antd";
import type { Category } from "../../types";
import toast from "../../utils/toast";

import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from "../../RTK/category/categoryApi";

import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppModal from "../../components/common/AppModal";
import AppPopconfirm from "../../components/common/AppPopconfirm";
import AppSpin from "../../components/common/AppSpin";
import PageHeader from "../../components/common/PageHeader";

const { Text } = Typography;

const CategoryPage: React.FC = () => {
  const { data: categories = [], isLoading: tableLoading } = useGetCategoriesQuery({});
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const formLoading = isAdding || isUpdating;

  const openAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          ...values,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await addCategory(values).unwrap();
        toast.success("Category added successfully");
      }

      setModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const columns: TableProps<Category>["columns"] = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Category">
            <AppButton icon={<FiEdit2 />} onClick={() => openEditModal(record)}>
              Edit
            </AppButton>
          </Tooltip>

          <AppPopconfirm
            title="Delete this category?"
            description="This action cannot be undone"
            okText="Delete"
            onConfirm={() => handleDelete(record.id)}
          >
            <AppButton danger icon={<FiTrash2 />} loading={isDeleting}>
              Delete
            </AppButton>
          </AppPopconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AppCard>
        <PageHeader
          title="Category Management"
          subtitle="Organize your products with proper categories"
          actionLabel="Add Category"
          actionIcon={<FiPlus />}
          onAction={openAddModal}
        />

        {/* Table */}
        <AppSpin spinning={tableLoading}>
          <Table
            rowKey="id"
            dataSource={categories}
            columns={columns}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No categories found" />,
            }}
          />
        </AppSpin>
      </AppCard>

      {/* Modal */}
      <AppModal
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
            <AppInput placeholder="e.g. Electronics" />
          </Form.Item>
        </Form>
      </AppModal>
    </div>
  );
};

export default CategoryPage;
