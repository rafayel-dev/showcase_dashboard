import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Tag, Typography, Modal, Select, Descriptions, Spin, message } from 'antd';
import type { TableProps } from 'antd';
import type { Order } from '../../types'; // Import Order interface
import { fetchOrders, updateOrder } from '../../services/orderService'; // Import service functions

const { Title } = Typography;
const { Option } = Select;

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  // Fetch orders on component mount
  useEffect(() => {
    const getOrders = async () => {
      setTableLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        message.error('Failed to fetch orders.');
      } finally {
        setTableLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleViewDetails = (record: Order) => {
    setViewingOrder(record);
    setIsViewModalVisible(true);
  };

  const handleUpdateStatus = (record: Order) => {
    Modal.confirm({
      title: 'Update Order Status',
      content: (
        <div>
          <p>Current Status for Order ID: {record.id} is <b>{record.status}</b></p>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={async (value: Order['status']) => {
              // setStatusUpdateLoading(true); // Removed as confirmLoading is not available in Modal.confirm
              try {
                const updated = await updateOrder({ ...record, status: value });
                setOrders(orders.map(order => order.id === updated.id ? updated : order));
                Modal.destroyAll(); // Close previous modal before opening new one
                message.success(`Order ID: ${record.id} status updated to ${value}.`);
              } catch (error) {
                message.error('Failed to update order status.');
              } finally {
                // setStatusUpdateLoading(false); // Removed as confirmLoading is not available in Modal.confirm
              }
            }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </div>
      ),
      icon: null,
      okButtonProps: { style: { display: 'none' } }, // Hide OK button
      cancelText: 'Close',
    });
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setViewingOrder(null);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Processing': return 'processing';
      case 'Shipped': return 'geekblue';
      case 'Pending': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns: TableProps<Order>['columns'] = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetails(record)}>View</Button>
          <Button type="link" onClick={() => handleUpdateStatus(record)}>Update Status</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card
        title={<Title level={2} className="text-gray-800 m-0">Order Management</Title>}
      >
        <Spin spinning={tableLoading}>
          <Table dataSource={orders} columns={columns} pagination={{ pageSize: 5 }} />
        </Spin>
      </Card>

      {/* Order Details View Modal */}
      <Modal
        title="Order Details"
        open={isViewModalVisible}
        onCancel={handleViewModalCancel}
        footer={[
          <Button key="close" onClick={handleViewModalCancel}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {viewingOrder && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Order ID">{viewingOrder.id}</Descriptions.Item>
            <Descriptions.Item label="Customer Name">{viewingOrder.customerName}</Descriptions.Item>
            <Descriptions.Item label="Customer Email">{viewingOrder.customerEmail}</Descriptions.Item>
            <Descriptions.Item label="Order Date">{viewingOrder.orderDate}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(viewingOrder.status)}>{viewingOrder.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">${viewingOrder.totalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Shipping Address">{viewingOrder.shippingAddress}</Descriptions.Item>
            <Descriptions.Item label="Payment Method">{viewingOrder.paymentMethod}</Descriptions.Item>
            <Descriptions.Item label="Ordered Items">
              <Table
                dataSource={viewingOrder.items}
                columns={[
                  { title: 'Product', dataIndex: 'productName', key: 'productName' },
                  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                  { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
                ]}
                pagination={false}
                size="small"
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;
