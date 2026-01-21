// src/components/common/ProductCard.tsx

import React from "react";

interface ProductCardProps {
  product: {
    id: string;
    productName: string; // Changed from name to title
    description?: string;
    price: number;
    imageUrls?: string[];
    productDetails?: {
      description?: string;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : "https://placehold.net/default.png";
  const displayDescription =
    product.description || product.productDetails?.description;
  return (
    <div className="min-h-screen">
      <div className="rounded-lg p-4 shadow-lg">
        <img
          src={imageUrl}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
        <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
        <p className="text-gray-600 mb-4">{displayDescription}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">৳{product.price}</span>
          <button className="bg-violet-500 text-white! px-4 py-2 rounded hover:bg-violet-600 cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
