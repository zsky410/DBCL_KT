import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { ProductCard } from '../components/ProductCard';
import { productService, Product } from '../services/productService';

const categories: Product['category'][] = ['Unisex', 'Nữ', 'Nam', 'Trẻ em'];

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | 'Tất cả'>('Tất cả');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = searchQuery
          ? await productService.search(searchQuery)
          : await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchQuery]);

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
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Hiển thị {filteredProducts.length} sản phẩm
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
          </>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
};
