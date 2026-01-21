// src/services/productService.ts
import type { Product } from "../types";

let _products: Product[] = [
  {
    key: "1",
    id: "1",
    productName: "Traditional Cotton Panjabi for Festive Occasions",
    category: "Fashion",
    price: 25,
    stock: 120,
    sku: "PR6653",
    status: "In Stock",
    description: "Comfortable cotton t-shirt",
    imageUrl: "https://placehold.net/default.png",
  },
  {
    key: "2",
    id: "2",
    productName: "Trendy Hoodie Sweatshirt for Casual & Winter Wear",
    category: "Men Fashion",
    price: 50,
    stock: 80,
    sku: "PR6654",
    status: "In Stock",
    description: "Stylish denim jeans",
    imageUrl: "https://placehold.net/default.png",
  },
  {
    key: "3",
    id: "3",
    productName: "Formal Tailored Office Blazer for Professional Look",
    category: "Women s Fashion",
    price: 75,
    stock: 0,
    sku: "PR6655",
    status: "Out of Stock",
    description: "Sporty and comfortable sneakers",
    imageUrl: "https://placehold.net/default.png",
  },
  {
    key: "4",
    id: "4",
    productName: "Lightweight Summer Printed Dress for Women",
    category: "Men Fashion",
    price: 1200,
    stock: 15,
    sku: "PR6656",
    status: "In Stock",
    description: "High-performance laptop",
    imageUrl: "https://placehold.net/default.png",
  },
];

const generateProductId = (): string => {
  return (Math.max(..._products.map((p) => parseInt(p.id))) + 1).toString();
};

export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([..._products]);
    }, 500); // Simulate network delay
  });
};

export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_products.find((p) => p.id === id));
    }, 300); // Simulate network delay
  });
};

export const addProduct = (
  product: Omit<Product, "id" | "key">,
): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = {
        ...product,
        id: generateProductId(),
        key: generateProductId(),
      };
      _products.push(newProduct);
      resolve(newProduct);
    }, 500); // Simulate network delay
  });
};

export const updateProduct = (updatedProduct: Product): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = _products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        _products[index] = { ...updatedProduct, key: updatedProduct.id };
        resolve(_products[index]);
      } else {
        reject(new Error("Product not found"));
      }
    }, 500); // Simulate network delay
  });
};

export const deleteProduct = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = _products.length;
      _products = _products.filter((p) => p.id !== id);
      if (_products.length < initialLength) {
        resolve();
      } else {
        reject(new Error("Product not found"));
      }
    }, 500); // Simulate network delay
  });
};
