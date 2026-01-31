// src/components/common/ProductCard.tsx

import React from "react";
import AppButton from "./AppButton";
import { BASE_URL } from "@/RTK/api";

interface ProductCardProps {
  product: {
    id: string;
    productName: string;
    price: number;
    imageUrls?: string[];
  };
  onView: () => void;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView, onEdit }) => {
  const imageSrc = (product as any).imageUrls?.[0]
    ? ((product as any).imageUrls?.[0].startsWith('/') ? `${BASE_URL}${(product as any).imageUrls?.[0]}` : (product as any).imageUrls?.[0])
    : "https://placehold.co/600x400?text=No+Image";
  return (
    <div className="rounded-lg p-4 shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        src={imageSrc}
        alt={product.productName}
        className="w-full h-84 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold line-clamp-1">{product.productName}</h3>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-violet-600">৳{product.price}</span>
        <div className="flex gap-2">
          <AppButton size="small" onClick={onEdit}>
            Edit
          </AppButton>
          <AppButton size="small" type="primary" onClick={onView}>
            View
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
