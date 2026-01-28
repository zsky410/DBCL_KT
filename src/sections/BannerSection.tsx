import React from 'react';
import { Link } from 'react-router-dom';

export const BannerSection: React.FC = () => {
  return (
    <section className="container-wide overflow-visible">
      <div className="mt-10 mb-16 rounded-3xl overflow-visible relative py-1 px-1 min-h-[320px] md:min-h-[380px]">
        {/* Nền trung tính theo tone web: trắng/xám + gợi nhẹ accent */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_70%_70%_at_15%_50%,rgba(255,75,106,0.06),transparent)]" />
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_50%_50%_at_85%_30%,rgba(0,0,0,0.02),transparent)]" />
        {/* Lớp glass mỏng, blur rõ */}
        <div className="relative rounded-3xl bg-white/30 backdrop-blur-2xl border border-gray-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-visible">
          <div className="grid md:grid-cols-2 gap-6 items-end md:items-center px-4 md:px-8 py-10 md:py-12 rounded-3xl">
            <div className="relative h-72 md:h-[28rem] flex items-end justify-center overflow-visible -mb-2 md:mb-0">
              <img
                src="/banner.png"
                alt="Giày thời trang"
                className="w-full max-w-[420px] md:max-w-[520px] h-auto object-contain object-center object-bottom scale-105"
                style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.45))' }}
              />
            </div>
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-slate-800/95">
                Bạn đã sẵn sàng dẫn đầu xu hướng?
              </h2>
              <p className="text-base md:text-lg mb-8 text-slate-600/90">
                Khám phá bộ sưu tập giày mới nhất với thiết kế độc đáo và chất lượng cao.
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-4 bg-primary text-white rounded-full text-base font-medium shadow-lg hover:opacity-90 transition-opacity"
              >
                Khám Phá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

