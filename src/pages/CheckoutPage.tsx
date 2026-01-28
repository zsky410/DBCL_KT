import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { useNotification } from '../context/NotificationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productService, Product } from '../services/productService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartProduct extends Product {
  size: string;
  color: string;
  quantity: number;
}

export const CheckoutPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { notify } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      notify('info', 'Vui lòng đăng nhập để thanh toán.');
      navigate('/cart');
    }
  }, [user, authLoading, navigate, notify]);

  useEffect(() => {
    if (user?.email) setFormData((f) => ({ ...f, email: user.email }));
  }, [user?.email]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      notify('error', 'Vui lòng đăng nhập để đặt hàng.');
      return;
    }

    if (cartProducts.length === 0) {
      notify('error', 'Giỏ hàng của bạn trống.');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        userId: user.id,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        phone: formData.phone,
        subtotal,
        shipping,
        total,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        items: cartProducts.map((item) => ({
          productId: item.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      await addDoc(collection(db, 'orders'), orderData);
      await clearCart();

      notify('success', 'Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
      navigate('/');
    } catch (error: any) {
      console.error('Error creating order:', error);
      notify('error', error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
      <div className="container-wide py-12">
        <h1 className="text-3xl font-semibold mb-8">Thanh Toán</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Thành phố</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mã bưu điện</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h2>
            {loading ? (
              <div className="bg-gray-50 p-6 rounded-2xl text-center text-gray-600">
                Đang tải...
              </div>
            ) : cartProducts.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-2xl text-center text-gray-600">
                Giỏ hàng trống
              </div>
            ) : (
              <>
                <div className="bg-gray-50 p-6 rounded-2xl space-y-4 mb-4">
                  {cartProducts.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                      <span>
                        {item.name} (Size: {item.size}, Color: {item.color}) x {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span>{shipping.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4 flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Phương thức thanh toán</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mr-3"
                  />
                  <span>Thẻ tín dụng/Ghi nợ</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mr-3"
                  />
                  <span>Thanh toán khi nhận hàng</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || cartProducts.length === 0}
              className="w-full mt-6 px-6 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
            <Link
              to="/cart"
              className="block w-full mt-3 px-6 py-3 border-2 border-black rounded-full text-center font-medium hover:bg-gray-50 transition-colors"
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </form>
      </div>
      </main>
      <Footer />
    </div>
  );
};
