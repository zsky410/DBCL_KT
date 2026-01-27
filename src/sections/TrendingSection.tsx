import React from 'react';
import { Link } from 'react-router-dom';
import { trendingProducts } from '../data/mockData';

export const TrendingSection: React.FC = () => {
  return (
    <section className="container-wide py-14">
      <div className="grid md:grid-cols-[1.2fr,2fr] gap-10 items-center">
        <div>
          <p className="uppercase tracking-[0.25em] text-xs text-gray-400 mb-3">
            — Giày Đang Hot
          </p>
          <h2 className="text-2xl font-semibold mb-3">Sản Phẩm Phổ Biến</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Khám phá những mẫu giày được yêu thích nhất hiện nay.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium shadow-md hover:bg-gray-800 transition-colors"
          >
            Khám Phá
          </Link>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-2xl shadow-card p-4 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-16 mb-4 object-cover rounded-xl"
                />
                <h3 className="text-xs font-medium mb-1">{product.name}</h3>
                <p className="text-xs text-gray-700">
                  {product.price.toLocaleString('vi-VN')} ₫
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
