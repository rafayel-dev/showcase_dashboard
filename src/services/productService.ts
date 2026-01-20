// src/services/productService.ts
import type { Product } from '../types';

let _products: Product[] = [
  { key: '1', id: '1', title: 'T-Shirt', category: 'Apparel', price: 25.00, stock: 120, status: 'In Stock', description: 'Comfortable cotton t-shirt' },
  { key: '2', id: '2', title: 'Jeans', category: 'Apparel', price: 50.00, stock: 80, status: 'In Stock', description: 'Stylish denim jeans' },
  { key: '3', id: '3', title: 'Sneakers', category: 'Footwear', price: 75.00, stock: 0, status: 'Out of Stock', description: 'Sporty and comfortable sneakers' },
  { key: '4', id: '4', title: 'Laptop', category: 'Electronics', price: 1200.00, stock: 15, status: 'In Stock', description: 'High-performance laptop' },
  { key: '5', id: '5', title: 'Mouse', category: 'Electronics', price: 200, stock: 200, status: 'In Stock', description: 'Ergonomic wireless mouse' },
];

const generateProductId = (): string => {
  return (Math.max(..._products.map(p => parseInt(p.id))) + 1).toString();
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
      resolve(_products.find(p => p.id === id));
    }, 300); // Simulate network delay
  });
};

export const addProduct = (product: Omit<Product, 'id' | 'key'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = { ...product, id: generateProductId(), key: generateProductId() };
      _products.push(newProduct);
      resolve(newProduct);
    }, 500); // Simulate network delay
  });
};

export const updateProduct = (updatedProduct: Product): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = _products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        _products[index] = { ...updatedProduct, key: updatedProduct.id };
        resolve(_products[index]);
      } else {
        reject(new Error('Product not found'));
      }
    }, 500); // Simulate network delay
  });
};

export const deleteProduct = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = _products.length;
      _products = _products.filter(p => p.id !== id);
      if (_products.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Product not found'));
      }
    }, 500); // Simulate network delay
  });
};
