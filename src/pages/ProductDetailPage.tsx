import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { notify } = useNotification();
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="container-wide py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/shop" className="text-blue-600 hover:underline">
            Quay lại cửa hàng
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      notify('error', 'Vui lòng chọn size trước khi thêm vào giỏ.');
      return;
    }

    addItem({
      productId: product.id,
      size: selectedSize,
      color: selectedColor || '',
      quantity,
    });

    notify(
      'success',
      `Đã thêm ${quantity} x ${product.name} (Size: ${selectedSize}) vào giỏ hàng.`,
    );
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      notify('error', 'Vui lòng chọn size trước khi mua ngay.');
      return;
    }

    addItem({
      productId: product.id,
      size: selectedSize,
      color: selectedColor || '',
      quantity,
    });

    navigate('/checkout');
    notify('success', 'Đã thêm sản phẩm vào giỏ. Vui lòng hoàn tất thông tin thanh toán.');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <div className="container-wide py-12">
        <div className="mb-4 text-sm text-gray-600">
          <Link to="/shop" className="hover:underline">
            Cửa hàng
          </Link>
          {' / '}
          <Link to={`/collection`} className="hover:underline">
            {product.category}
          </Link>
          {' / '}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.isNew && (
              <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-black text-white">
                MỚI
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-semibold">
                {product.price.toLocaleString('vi-VN')} ₫
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {product.oldPrice.toLocaleString('vi-VN')} ₫
                </span>
              )}
              {product.oldPrice && (
                <span className="text-sm text-green-600 font-medium">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Số lượng</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                className="px-6 py-4 border-2 border-black rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Mua ngay
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold mb-2">Thông tin sản phẩm</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Danh mục: {product.category}</li>
                <li>Chất liệu: Chất lượng cao</li>
                <li>Hướng dẫn bảo quản: Khuyến nghị giặt tay</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
