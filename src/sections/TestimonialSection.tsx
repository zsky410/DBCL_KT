import React from 'react';
import { testimonials } from '../data/mockData';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="bg-muted py-16">
      <div className="container-wide">
        <h2 className="text-2xl font-semibold text-center mb-10">— Đánh Giá Khách Hàng —</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-3xl shadow-card px-6 py-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-[11px] text-gray-500">{t.role}</p>
                  <p className="text-xs mt-1 text-yellow-500">
                    {'★'.repeat(t.rating)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

