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
  imageUrls?: string[];
  sku?: string;
  isPublished?: boolean;
  tags?: string[];
  hasDiscount?: boolean;
  discountType?: "flat" | "percentage";
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
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
  size?: string[];
  color?: string[];
  sku?: string;
}

export interface Order {
  key: string;
  id: string;
  orderId?: string; // Display ID
  customerName: string;
  customerEmail: string;
  customerDistrict: string;
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
  key?: string;
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
}

export interface Category {
  key: string;
  id: string;
  name: string;
  description: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  status: "Active" | "Inactive" | "Expired";
  minOrderValue?: number;
}
