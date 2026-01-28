import React, { useEffect, useState } from 'react';
import { testimonialService, Testimonial } from '../services/testimonialService';

export const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    };
    loadTestimonials();
  }, []);

  return (
    <section className="bg-muted py-20">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">— Đánh Giá Khách Hàng —</h2>
        {testimonials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.id}
                className="bg-white rounded-3xl shadow-card px-8 py-8 flex flex-col gap-4"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-base">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                    <p className="text-sm mt-1 text-yellow-500">
                      {'★'.repeat(t.rating)}
                    </p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">{t.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-base">Chưa có đánh giá nào.</p>
        )}
      </div>
    </section>
  );
};

