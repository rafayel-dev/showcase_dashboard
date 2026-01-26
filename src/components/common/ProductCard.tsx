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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const imageSrc = (product as any).imageUrl
    ? ((product as any).imageUrl.startsWith('/') ? `http://localhost:5000${(product as any).imageUrl}` : (product as any).imageUrl)
    : "https://placehold.co/600x400?text=No+Image";
  const displayDescription =
    product.description || product.productDetails?.description;
  return (
    <div className="min-h-screen">
      <div className="rounded-lg p-4 shadow-lg">
        <img
          src={imageSrc}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
        <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
        <p className="text-gray-600 mb-4">{displayDescription}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">৳{product.price}</span>
          <AppButton type="primary" onClick={onView}>
            View Details
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
