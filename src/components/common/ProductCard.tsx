// src/components/common/ProductCard.tsx

import React from "react";
import AppButton from "./AppButton";

interface ProductCardProps {
  product: {
    id: string;
    productName: string;
    description?: string;
    price: number;
    imageUrls?: string[];
    productDetails?: {
      description?: string;
    };
  };
  onView: () => void;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView, onEdit }) => {
  const imageSrc = (product as any).imageUrl
    ? ((product as any).imageUrl.startsWith('/') ? `http://localhost:5000${(product as any).imageUrl}` : (product as any).imageUrl)
    : "https://placehold.co/600x400?text=No+Image";
  const displayDescription =
    product.description || product.productDetails?.description;
  return (
    <div className="rounded-lg p-4 shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        src={imageSrc}
        alt={product.productName}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.productName}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2 min-h-[48px]">{displayDescription || "No description available"}</p>
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
