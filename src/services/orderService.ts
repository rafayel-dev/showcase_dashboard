// src/services/orderService.ts
import type { Order } from "../types";

let _orders: Order[] = [
  {
    key: "ORD001",
    id: "ORD001",
    customerName: "Alice Smith",
    customerEmail: "alice@example.com",
    orderDate: "2026-01-10",
    status: "Delivered",
    totalAmount: 180,
    shippingAddress: "123 Main St, Anytown",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    customerMobile: "01712345678",
    courier: "Pathao",
    deliveryCharge: 60,
    items: [
      {
        productId: "PROD001",
        productName: "Stylish Casual Full Sleeve Shirt for Men",
        quantity: 2,
        price: 25,
      },
      {
        productId: "PROD003",
        productName: "Modern Slim Fit Denim Jeans with Stretch Fabric",
        quantity: 1,
        price: 70,
      },
    ],
  },
  {
    key: "ORD002",
    id: "ORD002",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    orderDate: "2026-01-12",
    status: "Processing",
    totalAmount: 135,
    shippingAddress: "456 Oak Ave, Somewhere",
    paymentMethod: "PayPal",
    paymentStatus: "Unpaid",
    customerMobile: "01712345679",
    courier: "Steadfast",
    deliveryCharge: 60,
    items: [
      {
        productId: "PROD002",
        productName: "Soft & Comfortable Lounge Pants for Daily Wear",
        quantity: 1,
        price: 50,
      },
      {
        productId: "PROD005",
        productName: "Elegant Printed Kurti for Women with Premium Fabric",
        quantity: 1,
        price: 25,
      },
    ],
  },
  {
    key: "ORD003",
    id: "ORD003",
    customerName: "Charlie Brown",
    customerEmail: "charlie@example.com",
    orderDate: "2026-01-14",
    status: "Pending",
    totalAmount: 1285,
    shippingAddress: "789 Pine Ln, Nowhere",
    paymentMethod: "Credit Card",
    paymentStatus: "Unpaid",
    customerMobile: "01712345680",
    courier: "RedX",
    deliveryCharge: 60,
    items: [
      {
        productId: "PROD004",
        productName: "Traditional Cotton Panjabi for Festive Occasions",
        quantity: 1,
        price: 1200,
      },
      {
        productId: "PROD001",
        productName: "Trendy Hoodie Sweatshirt for Casual & Winter Wear",
        quantity: 1,
        price: 25,
      },
    ],
  },
  {
    key: "ORD004",
    id: "ORD004",
    customerName: "Diana Prince",
    customerEmail: "diana@example.com",
    orderDate: "2026-01-15",
    status: "Shipped",
    totalAmount: 90,
    shippingAddress: "101 Hero St, Themyscira",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    customerMobile: "01712345681",
    courier: "Pathao",
    deliveryCharge: 60,
    items: [
      {
        productId: "PROD001",
        productName: "Formal Tailored Office Blazer for Professional Look",
        quantity: 1,
        price: 30,
      },
    ],
  },
  {
    key: "ORD005",
    id: "ORD005",
    customerName: "Clark Kent",
    customerEmail: "clark@example.com",
    orderDate: "2026-01-16",
    status: "Delivered",
    totalAmount: 560,
    shippingAddress: "Daily Planet, Metropolis",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    customerMobile: "01712345682",
    courier: "Steadfast",
    deliveryCharge: 60,
    items: [
      {
        productId: "PROD004",
        productName: "Lightweight Summer Printed Dress for Women",
        quantity: 1,
        price: 500,
      },
    ],
  },
];

export const fetchOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([..._orders]);
    }, 500);
  });
};

export const getOrderById = (id: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_orders.find((o) => o.id === id));
    }, 300);
  });
};

export const updateOrder = (updatedOrder: Order): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = _orders.findIndex((o) => o.id === updatedOrder.id);
      if (index !== -1) {
        _orders[index] = { ...updatedOrder, key: updatedOrder.id };
        resolve(_orders[index]);
      } else {
        reject(new Error("Order not found"));
      }
    }, 500);
  });
};

export const deleteOrder = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = _orders.length;
      _orders = _orders.filter((o) => o.id !== id);
      if (_orders.length < initialLength) {
        resolve();
      } else {
        reject(new Error("Order not found"));
      }
    }, 500);
  });
};
