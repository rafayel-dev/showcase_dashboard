// src/components/common/ProductCard.tsx

import React from 'react';

interface ProductCardProps {
  product: {
    id: string;
    title: string; // Changed from name to title
    description?: string;
    price: number;
    imageUrls?: string[];
    productDetails?: {
      description?: string;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://via.placeholder.com/150';
  const displayDescription = product.description || product.productDetails?.description;
  return (
    <div className="border rounded-lg p-4 shadow-lg">
      <img src={imageUrl} alt={product.title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-4">{displayDescription}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
