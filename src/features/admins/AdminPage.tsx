import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Card, Typography, Modal, Form, Input, Select, message, Spin } from 'antd';
import type { TableProps } from 'antd';
import type { Admin } from '../../types'; // Import Admin interface
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../services/adminService'; // Import service functions

const { Title } = Typography;
const { Option } = Select;

const AdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Fetch admins on component mount
  useEffect(() => {
    const getAdmins = async () => {
      setTableLoading(true);
      try {
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (error) {
        message.error('Failed to fetch administrators.');
      } finally {
        setTableLoading(false);
      }
    };
    getAdmins();
  }, []);

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    form.resetFields();
    setIsAddEditModalVisible(true);
  };

  const handleEditAdmin = (record: Admin) => {
    setEditingAdmin(record);
    form.setFieldsValue(record);
    setIsAddEditModalVisible(true);
  };

  const handleDeleteAdmin = async (id: string) => {
    setTableLoading(true);
    try {
      await deleteAdmin(id);
      setAdmins(admins.filter(admin => admin.id !== id));
      message.success(`Administrator with ID: ${id} deleted successfully.`);
    } catch (error) {
      message.error('Failed to delete administrator.');
    } finally {
      setTableLoading(false);
    }
  };

  const handleAddEditAdminOk = async () => {
    try {
      setFormLoading(true);
      const values = await form.validateFields();
      if (editingAdmin) {
        // Update existing admin
        const updated = await updateAdmin({ ...editingAdmin, ...values });
        setAdmins(admins.map(admin =>
          admin.id === updated.id ? updated : admin
        ));
        message.success('Administrator updated successfully!');
      } else {
        // Add new admin
        const newAdmin = await addAdmin({ ...values, role: values.role || 'Editor' }); // Default role if not selected
        setAdmins([...admins, newAdmin]);
        message.success('Administrator added successfully!');
      }
      setIsAddEditModalVisible(false);
      setEditingAdmin(null);
      form.resetFields();
    } catch (errorInfo) {
      message.error('Failed to save administrator.');
      console.log('Failed:', errorInfo);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddEditAdminCancel = () => {
    setIsAddEditModalVisible(false);
    setEditingAdmin(null);
    form.resetFields();
  };

  const columns: TableProps<Admin>['columns'] = [
    {
      title: 'Admin ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditAdmin(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this administrator?"
            onConfirm={() => handleDeleteAdmin(record.id)}
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
        title={<Title level={2} className="text-gray-800 m-0">Administrator Management</Title>}
        extra={
          <Button type="primary" onClick={handleAddAdmin}>
            Add New Admin
          </Button>
        }
      >
        <Spin spinning={tableLoading}>
          <Table dataSource={admins} columns={columns} pagination={{ pageSize: 5 }} />
        </Spin>
      </Card>

      <Modal
        title={editingAdmin ? 'Edit Administrator' : 'Add New Administrator'}
        open={isAddEditModalVisible}
        onOk={handleAddEditAdminOk}
        onCancel={handleAddEditAdminCancel}
        okText={editingAdmin ? 'Update Administrator' : 'Add Administrator'}
        confirmLoading={formLoading}
      >
        <Form form={form} layout="vertical" name="add_edit_admin_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the administrator\'s name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the administrator\'s email!' }, { type: 'email', message: 'Please enter a valid email address!' }]}
          >
            <Input />
          </Form.Item>
          {/* Password field only for adding new admin, not for editing */}
          {!editingAdmin && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input the administrator\'s password!' }, { min: 6, message: 'Password must be at least 6 characters long!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select a role">
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
