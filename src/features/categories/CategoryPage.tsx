import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Card, Typography, Modal, Form, Input, message, Spin } from 'antd';
import type { TableProps } from 'antd';
import type { Category } from '../../types'; // Import Category interface
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryService'; // Import service functions

const { Title } = Typography;

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      setTableLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        message.error('Failed to fetch categories.');
      } finally {
        setTableLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCategory = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = async (id: string) => {
    setTableLoading(true);
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      message.success(`Category with ID: ${id} deleted successfully.`);
    } catch (error) {
      message.error('Failed to delete category.');
    } finally {
      setTableLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      setFormLoading(true);
      const values = await form.validateFields();
      if (editingCategory) {
        // Edit existing category
        const updated = await updateCategory({ ...editingCategory, ...values });
        setCategories(categories.map(cat => cat.id === updated.id ? updated : cat));
        message.success('Category updated successfully!');
      } else {
        // Add new category
        const newCategory = await addCategory({ ...values });
        setCategories([...categories, newCategory]);
        message.success('Category added successfully!');
      }
      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
    } catch (errorInfo) {
      message.error('Failed to save category.');
      console.log('Failed:', errorInfo);
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const columns: TableProps<Category>['columns'] = [
    {
      title: 'Category ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditCategory(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card
        title={<Title level={2} className="text-gray-800 m-0">Category Management</Title>}
        extra={
          <Button type="primary" onClick={handleAddCategory}>
            Add New Category
          </Button>
        }
      >
        <Spin spinning={tableLoading}>
          <Table dataSource={categories} columns={columns} pagination={{ pageSize: 5 }} />
        </Spin>
      </Card>

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingCategory ? 'Update Category' : 'Add Category'}
        confirmLoading={formLoading}
      >
        <Form form={form} layout="vertical" name="category_form">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
