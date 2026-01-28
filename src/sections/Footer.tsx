import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { notify } = useNotification();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      notify('success', 'Cảm ơn bạn đã đăng ký nhận tin!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white py-12 mt-12">
      <div className="container-wide grid gap-10 md:grid-cols-3 items-start text-base">
        <div>
          <Link to="/" className="text-xl font-semibold mb-4 block hover:opacity-80">
            Slick
          </Link>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Cửa hàng giày thời trang với đa dạng mẫu mã, chất lượng cao và giá cả hợp lý. Chúng
            tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
          </p>
        </div>

        <div>
          <h4 className="text-base font-semibold mb-4">Đăng ký nhận tin</h4>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-full bg-white text-black text-sm font-semibold shrink-0 hover:bg-gray-100 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>

        <div className="md:text-right">
          <h4 className="text-base font-semibold mb-4">Liên Kết Nhanh</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">
                Cửa hàng
              </Link>
            </li>
            <li>
              <Link to="/collection" className="hover:text-white transition-colors">
                Bộ sưu tập
              </Link>
            </li>
            <li>
              <Link to="/customize" className="hover:text-white transition-colors">
                Tùy chỉnh
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                Giỏ hàng
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-wide mt-10 text-sm text-gray-500 flex justify-between items-center">
        <span>© Slick. Bảo lưu mọi quyền.</span>
        <span className="hidden md:inline">Điều khoản & Điều kiện</span>
      </div>
    </footer>
  );
};

