import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, Product } from '../services/productService';

export const HeroSection: React.FC = () => {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const trending = await productService.getTrending();
      if (trending.length > 0) {
        setFeaturedProduct(trending[0]);
      } else {
        const all = await productService.getAll();
        if (all.length > 0) {
          setFeaturedProduct(all[0]);
        }
      }
    };
    loadProduct();
  }, []);

  if (!featuredProduct) {
    return null;
  }

  return (
    <>
      <section className="container-wide py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-5">
            Tối Ưu
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
            Tìm Đôi Giày
            <br />
            Hoàn Hảo
            <br />
            Cùng Chúng Tôi
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-10 max-w-lg">
            Khám phá bộ sưu tập giày đa dạng với chất lượng cao và thiết kế thời trang.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-black text-white rounded-full text-base font-medium shadow-lg hover:bg-gray-800 transition-colors"
          >
            Mua Ngay
          </Link>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-b from-gray-100 to-white rounded-full flex items-center justify-center shadow-card overflow-hidden">
            <img
              src={featuredProduct.image}
              alt={featuredProduct.name}
              className="w-72 h-52 md:w-80 md:h-56 object-cover object-center object-[center_65%] rounded-3xl"
            />
          </div>
          <Link
            to={`/product/${featuredProduct.id}`}
            className="absolute bottom-6 right-8 bg-white/90 px-5 py-4 rounded-xl shadow-card text-base hover:shadow-xl transition-shadow"
          >
            <p className="font-medium">{featuredProduct.name}</p>
            <p className="text-gray-700 mt-1.5 text-sm">
              {featuredProduct.price.toLocaleString('vi-VN')} ₫
            </p>
          </Link>
        </div>
      </section>

      <div className="bg-black py-5">
        <div className="container-wide flex flex-wrap items-center justify-center gap-10 text-white text-sm uppercase tracking-[0.25em] opacity-80">
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
