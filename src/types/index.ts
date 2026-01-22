// src/types/index.ts

export interface Product {
  id: string;
  key: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Out of Stock" | "Discontinued";
  description?: string; // Short description, if still used
  imageUrl?: string;
  sku?: string;
  isPublished?: boolean;
  tags?: string[];
  specifications?: {
    brand?: string;
    material?: string;
    availableSizes?: string[];
    availableColors?: string[];
    countryOfOrigin?: string;
  };
  productDetails?: {
    description?: string; // Long description for Jodit
    features?: string[];
    deliveryInfo?: string;
    returnPolicy?: string;
  };
}

export interface ProductCardProps {
  product: Product;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  key: string;
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  customerMobile: string;
  courier: "Pathao" | "Steadfast" | "RedX";
  deliveryCharge: number;
  paymentStatus: "Paid" | "Unpaid";
}

export interface Admin {
  key: string;
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Editor";
}

export interface Category {
  key: string;
  id: string;
  name: string;
  description: string;
}
