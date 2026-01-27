import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showNewBadge = true }) => {
  return (
    <article className="bg-white rounded-3xl shadow-card p-4 flex flex-col hover:shadow-xl transition-shadow">
      <Link to={`/product/${product.id}`} className="relative mb-4 group">
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center object-[center_70%] group-hover:scale-110 transition-transform"
          />
        </div>
        {showNewBadge && product.isNew && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-black text-white">
            MỚI
          </span>
        )}
        <Link
          to={`/product/${product.id}`}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          ↗
        </Link>
      </Link>
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium mb-2 hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto text-sm">
          <span className="font-semibold mr-2">
            {product.price.toLocaleString('vi-VN')} ₫
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through">
              {product.oldPrice.toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};
