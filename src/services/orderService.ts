// src/services/orderService.ts
import type { Order } from '../types';

let _orders: Order[] = [
  {
    key: 'ORD001', id: 'ORD001', customerName: 'Alice Smith', customerEmail: 'alice@example.com', orderDate: '2026-01-10', status: 'Delivered', totalAmount: 120.50, shippingAddress: '123 Main St, Anytown', paymentMethod: 'Credit Card',
    items: [
      { productId: 'PROD001', productName: 'T-Shirt', quantity: 2, price: 25.00 },
      { productId: 'PROD003', productName: 'Sneakers', quantity: 1, price: 70.50 },
    ]
  },
  {
    key: 'ORD002', id: 'ORD002', customerName: 'Bob Johnson', customerEmail: 'bob@example.com', orderDate: '2026-01-12', status: 'Processing', totalAmount: 75.00, shippingAddress: '456 Oak Ave, Somewhere', paymentMethod: 'PayPal',
    items: [
      { productId: 'PROD002', productName: 'Jeans', quantity: 1, price: 50.00 },
      { productId: 'PROD005', productName: 'Mouse', quantity: 1, price: 25.00 },
    ]
  },
  {
    key: 'ORD003', id: 'ORD003', customerName: 'Charlie Brown', customerEmail: 'charlie@example.com', orderDate: '2026-01-14', status: 'Pending', totalAmount: 240.99, shippingAddress: '789 Pine Ln, Nowhere', paymentMethod: 'Credit Card',
    items: [
      { productId: 'PROD004', productName: 'Laptop', quantity: 1, price: 1200.00 },
      { productId: 'PROD001', productName: 'T-Shirt', quantity: 1, price: 25.00 },
    ]
  },
  {
    key: 'ORD004', id: 'ORD004', customerName: 'Diana Prince', customerEmail: 'diana@example.com', orderDate: '2026-01-15', status: 'Shipped', totalAmount: 30.00, shippingAddress: '101 Hero St, Themyscira', paymentMethod: 'Cash on Delivery',
    items: [
      { productId: 'PROD001', productName: 'T-Shirt', quantity: 1, price: 30.00 },
    ]
  },
  {
    key: 'ORD005', id: 'ORD005', customerName: 'Clark Kent', customerEmail: 'clark@example.com', orderDate: '2026-01-16', status: 'Delivered', totalAmount: 500.00, shippingAddress: 'Daily Planet, Metropolis', paymentMethod: 'Credit Card',
    items: [
      { productId: 'PROD004', productName: 'Laptop', quantity: 1, price: 500.00 },
    ]
  },
];



export const fetchOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([..._orders]);
    }, 500); // Simulate network delay
  });
};

export const getOrderById = (id: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_orders.find(o => o.id === id));
    }, 300); // Simulate network delay
  });
};

export const updateOrder = (updatedOrder: Order): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = _orders.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        _orders[index] = { ...updatedOrder, key: updatedOrder.id };
        resolve(_orders[index]);
      } else {
        reject(new Error('Order not found'));
      }
    }, 500); // Simulate network delay
  });
};

export const deleteOrder = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = _orders.length;
      _orders = _orders.filter(o => o.id !== id);
      if (_orders.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Order not found'));
      }
    }, 500); // Simulate network delay
  });
};
