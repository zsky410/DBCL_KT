import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { items, updateItem, removeItem } = useCart();

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, ...item } : null;
    })
    .filter(Boolean) as (typeof products[0] & (typeof items)[number])[];

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartProducts.length > 0 ? 199 : 0;
  const total = subtotal + shipping;

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="container-wide py-12 text-center">
          <h1 className="text-3xl font-semibold mb-4">Giỏ hàng của bạn trống</h1>
          <p className="text-gray-600 mb-8">Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <div className="container-wide py-12">
        <h1 className="text-3xl font-semibold mb-8">Giỏ Hàng</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartProducts.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 p-4 border border-gray-200 rounded-2xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium hover:text-gray-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateItem(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateItem(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-24 p-6 bg-gray-50 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{shipping.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full px-6 py-3 bg-black text-white rounded-full text-center font-medium hover:bg-gray-800 transition-colors"
              >
                Thanh toán
              </Link>
              <Link
                to="/shop"
                className="block w-full mt-3 px-6 py-3 border-2 border-black rounded-full text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
