// src/services/adminService.ts
import type { Admin } from '../types';

let _admins: Admin[] = [
  { key: 'ADM001', id: 'ADM001', name: 'Rafiul Islam', email: 'rafi@example.com', role: 'Super Admin' },
  { key: 'ADM002', id: 'ADM002', name: 'Jane Doe', email: 'jane@example.com', role: 'Admin' },
  { key: 'ADM003', id: 'ADM003', name: 'Peter Jones', email: 'peter@example.com', role: 'Editor' },
];

const generateAdminId = (): string => {
    return `ADM${Math.max(..._admins.map(a => parseInt(a.id.replace('ADM', '')))) + 1}`.padStart(6, '0');
};

export const fetchAdmins = (): Promise<Admin[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([..._admins]);
    }, 500); // Simulate network delay
  });
};

export const addAdmin = (admin: Omit<Admin, 'id' | 'key'>): Promise<Admin> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAdmin = { ...admin, id: generateAdminId(), key: generateAdminId() };
      _admins.push(newAdmin);
      resolve(newAdmin);
    }, 500); // Simulate network delay
  });
};

export const updateAdmin = (updatedAdmin: Admin): Promise<Admin> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = _admins.findIndex(a => a.id === updatedAdmin.id);
      if (index !== -1) {
        _admins[index] = { ...updatedAdmin, key: updatedAdmin.id };
        resolve(_admins[index]);
      } else {
        reject(new Error('Admin not found'));
      }
    }, 500); // Simulate network delay
  });
};

export const deleteAdmin = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = _admins.length;
      _admins = _admins.filter(a => a.id !== id);
      if (_admins.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Admin not found'));
      }
    }, 500);
  });
};
