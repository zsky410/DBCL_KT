import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { ProductCard } from '../components/ProductCard';
import { products, categories, Product } from '../data/mockData';

export const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | 'Tất cả'>('Tất cả');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  let filteredProducts = products;

  if (selectedCategory !== 'Tất cả') {
    filteredProducts = products.filter((p) => p.category === selectedCategory);
  }

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <div className="container-wide py-12">
        <h1 className="text-4xl font-semibold mb-8">Cửa Hàng</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Category Filter */}
          <div className="flex-1">
            <h2 className="text-sm font-semibold mb-3 text-gray-700">Danh mục</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'Tất cả'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700">Sắp xếp</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="name">Tên</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-4 text-sm text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
