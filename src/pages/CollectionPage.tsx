import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { ProductCard } from '../components/ProductCard';
import { productService, Product } from '../services/productService';

const categories: Product['category'][] = ['Unisex', 'Nữ', 'Nam', 'Trẻ em'];

export const CollectionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Product['category']>(categories[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
      <div className="container-wide py-12">
        <h1 className="text-4xl font-semibold mb-4">Bộ Sưu Tập</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Khám phá các bộ sưu tập giày cao cấp được tuyển chọn kỹ lưỡng. Mỗi bộ sưu tập được
          chọn lọc cẩn thận để mang đến cho bạn những sản phẩm tốt nhất về phong cách, sự thoải
          mái và chất lượng.
        </p>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-gray-200 overflow-hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Info */}
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-2">Bộ Sưu Tập {selectedCategory}</h2>
          <p className="text-gray-600 text-sm">
            Khám phá bộ sưu tập độc quyền {selectedCategory} với những xu hướng mới nhất và các
            mẫu cổ điển vượt thời gian.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {filteredProducts.length} sản phẩm trong bộ sưu tập này
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Không có sản phẩm nào trong danh mục này.</p>
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
