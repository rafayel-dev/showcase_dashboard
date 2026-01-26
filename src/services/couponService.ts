import type { Coupon } from "../types";

const MOCK_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "WELCOME50",
    discountType: "flat",
    discountValue: 50,
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    usageLimit: 100,
    usedCount: 12,
    status: "Active",
    minOrderValue: 500,
  },
  {
    id: "2",
    code: "SUMMER10",
    discountType: "percentage",
    discountValue: 10,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    usageLimit: 500,
    usedCount: 45,
    status: "Expired",
    minOrderValue: 1000,
  },
];

export const fetchCoupons = async (): Promise<Coupon[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_COUPONS), 500);
  });
};

export const addCoupon = async (coupon: Coupon): Promise<Coupon> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCoupon = { ...coupon, id: Math.random().toString(36).substr(2, 9) };
      MOCK_COUPONS.push(newCoupon);
      resolve(newCoupon);
    }, 500);
  });
};

export const updateCoupon = async (coupon: Coupon): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_COUPONS.findIndex((c) => c.id === coupon.id);
      if (index !== -1) {
        MOCK_COUPONS[index] = coupon;
      }
      resolve();
    }, 500);
  });
};

export const deleteCoupon = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_COUPONS.findIndex((c) => c.id === id);
      if (index !== -1) {
        MOCK_COUPONS.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};
