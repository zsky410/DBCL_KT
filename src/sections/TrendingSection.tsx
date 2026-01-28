import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, Product } from '../services/productService';

export const TrendingSection: React.FC = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await productService.getTrending();
      setTrendingProducts(products);
    };
    loadProducts();
  }, []);

  return (
    <section className="container-wide py-16 md:py-20">
      <div className="grid md:grid-cols-[1.2fr,2fr] gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.25em] text-sm text-gray-400 mb-4">
            — Giày Đang Hot
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Sản Phẩm Phổ Biến</h2>
          <p className="text-gray-500 text-base mb-8 max-w-sm">
            Khám phá những mẫu giày được yêu thích nhất hiện nay.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-black text-white rounded-full text-base font-medium shadow-md hover:bg-gray-800 transition-colors"
          >
            Khám Phá
          </Link>
        </div>

        <div className="relative">
          {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {trendingProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-2xl shadow-card p-5 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-full aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center object-[center_70%]"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-medium mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm md:text-base text-gray-700 font-medium">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">Đang tải sản phẩm...</p>
          )}
        </div>
      </div>
    </section>
  );
};
