import React, { useState } from 'react';
import { categories, products, Product } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const CategoryGridSection: React.FC = () => {
  const [active, setActive] = useState<Product['category']>(categories[0]);
  const filtered = products.filter((p) => p.category === active).slice(0, 8);

  return (
    <section className="container-wide py-14">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">— Bán Chạy Nhất —</h2>
        <div className="inline-flex rounded-full border border-gray-200 overflow-hidden">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                active === tab
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

