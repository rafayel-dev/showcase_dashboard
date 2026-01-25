// src/services/categoryService.ts
import type { Category } from "../types";

let _categories: Category[] = [
  {
    key: "CAT001",
    id: "CAT001",
    name: "Women s Fashion",
    description: "Clothing and accessories",
  },
  {
    key: "CAT002",
    id: "CAT002",
    name: "Men Fashion",
    description: "Electronic gadgets and devices",
  },
  {
    key: "CAT003",
    id: "CAT003",
    name: "Fashion",
    description: "Shoes and other foot coverings",
  },
];

const generateCategoryId = (): string => {
  return `CAT${Math.max(..._categories.map((c) => parseInt(c.id.replace("CAT", "")))) + 1}`.padStart(
    6,
    "0",
  );
};

export const fetchCategories = (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([..._categories]);
    }, 500);
  });
};

export const addCategory = (
  category: Omit<Category, "id" | "key">,
): Promise<Category> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCategory = {
        ...category,
        id: generateCategoryId(),
        key: generateCategoryId(),
      };
      _categories.push(newCategory);
      resolve(newCategory);
    }, 500);
  });
};

export const updateCategory = (
  updatedCategory: Category,
): Promise<Category> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = _categories.findIndex((c) => c.id === updatedCategory.id);
      if (index !== -1) {
        _categories[index] = { ...updatedCategory, key: updatedCategory.id };
        resolve(_categories[index]);
      } else {
        reject(new Error("Category not found"));
      }
    }, 500);
  });
};

export const deleteCategory = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = _categories.length;
      _categories = _categories.filter((c) => c.id !== id);
      if (_categories.length < initialLength) {
        resolve();
      } else {
        reject(new Error("Category not found"));
      }
    }, 500);
  });
};
