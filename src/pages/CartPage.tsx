import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { productService, Product } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { AuthModal } from '../components/AuthModal';

interface CartProduct extends Product {
  size: string;
  color: string;
  quantity: number;
}

export const CartPage: React.FC = () => {
  const { items, updateItem, removeItem, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      notify('info', 'Vui lòng đăng nhập để thanh toán.');
      return;
    }
    navigate('/checkout');
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (items.length === 0) {
        setCartProducts([]);
        setLoading(false);
        return;
      }

      try {
        const products = await Promise.all(
          items.map(async (item) => {
            const product = await productService.getById(item.productId);
            if (!product) return null;
            return { ...product, ...item };
          }),
        );

        setCartProducts(products.filter(Boolean) as CartProduct[]);
      } catch (error) {
        console.error('Error loading cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [items]);

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartProducts.length > 0 ? 199000 : 0;
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    await updateItem(productId, size, color, quantity);
  };

  const handleRemoveItem = async (productId: string, size: string, color: string) => {
    await removeItem(productId, size, color);
  };

  if (loading || cartLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <main className="flex-1">
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
                  className="w-24 h-24 object-cover object-center object-[center_70%] rounded-xl flex-shrink-0"
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
                      onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.productId, item.size, item.color, item.quantity + 1)
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
              <button
                onClick={handleCheckout}
                className="block w-full px-6 py-3 bg-black text-white rounded-full text-center font-medium hover:bg-gray-800 transition-colors"
              >
                Thanh toán
              </button>
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
      </main>
      <Footer />
    </div>
  );
};
