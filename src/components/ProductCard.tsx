import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
  size?: 'default' | 'large';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showNewBadge = true, size = 'default' }) => {
  const isLarge = size === 'large';

  return (
    <article className={`bg-white rounded-3xl shadow-card flex flex-col hover:shadow-xl transition-shadow ${isLarge ? 'p-5' : 'p-4'}`}>
      <Link to={`/product/${product.id}`} className={`relative group ${isLarge ? 'mb-5' : 'mb-4'}`}>
        <div className={`w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden ${isLarge ? 'h-52' : 'h-40'}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center object-[center_70%] group-hover:scale-110 transition-transform"
          />
        </div>
        {showNewBadge && product.isNew && (
          <span className={`absolute top-3 left-3 font-semibold rounded-full bg-black text-white ${isLarge ? 'text-xs px-3 py-1.5' : 'text-[10px] px-2 py-1'}`}>
            MỚI
          </span>
        )}
        <Link
          to={`/product/${product.id}`}
          className={`absolute bottom-3 right-3 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors ${isLarge ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'}`}
        >
          ↗
        </Link>
      </Link>
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        <h3 className={`font-medium hover:text-gray-600 transition-colors ${isLarge ? 'text-base mb-3' : 'text-sm mb-2'}`}>
          {product.name}
        </h3>
        <div className={`mt-auto ${isLarge ? 'text-base' : 'text-sm'}`}>
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
