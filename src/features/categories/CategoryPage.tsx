import React, { useState } from "react";
import {
  Table,
  Space,
  Typography,
  Form,
  Tooltip,
  Empty,
  Avatar,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
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
import { useUploadImageMutation } from "../../RTK/product/productApi";

import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppModal from "../../components/common/AppModal";
import AppPopconfirm from "../../components/common/AppPopconfirm";
import AppSpin from "../../components/common/AppSpin";
import PageHeader from "../../components/common/PageHeader";
import { BASE_URL } from "../../RTK/api";

const { Text } = Typography;

const CategoryPage: React.FC = () => {
  const { data: categories = [], isLoading: tableLoading } = useGetCategoriesQuery({});
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const formLoading = isAdding || isUpdating || isUploadingImage;

  const openAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const openEditModal = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue({ 
      name: record.name,
      imageUrl: record.imageUrl 
    });
    
    if (record.imageUrl) {
      const url = record.imageUrl.startsWith("http") 
        ? record.imageUrl 
        : `${BASE_URL}${record.imageUrl.startsWith('/') ? '' : '/'}${record.imageUrl}`;
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: url,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let finalImageUrl = editingCategory?.imageUrl || "";

      // Handle Image Upload
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("image", fileList[0].originFileObj);
        const res = await uploadImage({ formData }).unwrap();
        finalImageUrl = res.filePath;
      } else if (fileList.length === 0) {
        finalImageUrl = "";
      }

      const payload = { ...values, imageUrl: finalImageUrl };

      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          ...payload,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await addCategory(payload).unwrap();
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (url: string) => {
        const fullUrl = url 
          ? (url.startsWith("http") ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`)
          : "https://placehold.co/100x100?text=No+Image";
        
        return (
          <Avatar
            src={fullUrl}
            shape="square"
            size={50}
            className="border border-gray-200"
          />
        );
      },
    },
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
            <AppButton danger title="Delete" icon={<FiTrash2 />} loading={deletingId === record.id}>
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

          <Form.Item label="Category Image" rules={[{ required: !editingCategory, message: "Category image is required" }]}>
            <Upload
              listType="picture-card"
              accept="image/webp,image/jpeg,image/png,image/jpg"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 4 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </AppModal>
    </div>
  );
};

export default CategoryPage;
