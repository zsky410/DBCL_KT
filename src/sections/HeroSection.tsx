import React from 'react';
import { Link } from 'react-router-dom';
import { trendingProducts, products } from '../data/mockData';

export const HeroSection: React.FC = () => {
  const featuredProduct = trendingProducts[0] || products[0];

  return (
    <>
      <section className="container-wide py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-4">
            Tối Ưu
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Tìm Đôi Giày
            <br />
            Hoàn Hảo
            <br />
            Cùng Chúng Tôi
          </h1>
          <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md">
            Khám phá bộ sưu tập giày đa dạng với chất lượng cao và thiết kế thời trang.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium shadow-lg hover:bg-gray-800 transition-colors"
          >
            Mua Ngay
          </Link>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-72 h-72 md:w-80 md:h-80 bg-gradient-to-b from-gray-100 to-white rounded-full flex items-center justify-center shadow-card overflow-hidden">
            <img
              src={featuredProduct.image}
              alt={featuredProduct.name}
              className="w-56 h-40 object-cover rounded-3xl"
            />
          </div>
          <Link
            to={`/product/${featuredProduct.id}`}
            className="absolute bottom-4 right-6 bg-white/90 px-4 py-3 rounded-xl shadow-card text-sm hover:shadow-xl transition-shadow"
          >
            <p className="font-medium">{featuredProduct.name}</p>
            <p className="text-gray-700 mt-1">
              {featuredProduct.price.toLocaleString('vi-VN')} ₫
            </p>
          </Link>
        </div>
      </section>

      <div className="bg-black py-4">
        <div className="container-wide flex flex-wrap items-center justify-center gap-8 text-white text-xs uppercase tracking-[0.25em] opacity-80">
          <span>ebay</span>
          <span>amazon.com</span>
          <span>AJIO</span>
          <span>ebay</span>
          <span>amazon.com</span>
          <span>AJIO</span>
        </div>
      </div>
    </>
  );
};
