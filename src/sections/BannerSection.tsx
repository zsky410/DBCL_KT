import React from 'react';
import { Link } from 'react-router-dom';

export const BannerSection: React.FC = () => {
  return (
    <section className="container-wide">
      <div className="mt-8 mb-14 rounded-3xl bg-rose-400 text-white overflow-hidden relative">
        <div className="grid md:grid-cols-2 gap-6 items-center px-6 md:px-10 py-10">
          <div className="relative h-48 md:h-64 flex items-end justify-center">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
              alt="Giày thời trang"
              className="w-40 h-28 md:w-52 md:h-36 object-cover rounded-3xl"
            />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Bạn đã sẵn sàng dẫn đầu xu hướng?
            </h2>
            <p className="text-sm md:text-base mb-6">
              Khám phá bộ sưu tập giày mới nhất với thiết kế độc đáo và chất lượng cao.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-white text-black rounded-full text-sm font-medium shadow-md hover:bg-gray-100 transition-colors"
            >
              Khám Phá
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

