import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [search, setSearch] = useState('');
  const [cartPulse, setCartPulse] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useNotification();

  useEffect(() => {
    if (totalCount > 0) {
      setCartPulse(true);
      const t = setTimeout(() => setCartPulse(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalCount]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('q') ?? '');
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <>
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-50">
        <div className="container-wide py-4 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-semibold tracking-tight hover:opacity-80">
            Slick
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-gray-900 hover:text-gray-600">
              Trang chủ
            </Link>
            <Link to="/shop" className="text-gray-500 hover:text-gray-900">
              Cửa hàng
            </Link>
            <Link to="/collection" className="text-gray-500 hover:text-gray-900">
              Bộ sưu tập
            </Link>
            <Link to="/customize" className="text-gray-500 hover:text-gray-900">
              Tùy chỉnh
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500"
            >
              <FiSearch className="h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm giày..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 bg-transparent outline-none placeholder:text-gray-400"
              />
            </form>

            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="md:hidden p-2 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900"
              aria-label="Tìm kiếm"
            >
              <FiSearch className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setShowAuth(true);
                  notify('info', 'Vui lòng đăng nhập để xem giỏ hàng.');
                } else {
                  navigate('/cart');
                }
              }}
              aria-label="Giỏ hàng"
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-gray-900 ${
                cartPulse ? 'animate-bounce' : ''
              }`}
            >
              <FiShoppingBag className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {totalCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white"
                  aria-label="Tài khoản"
                >
                  {initials || <FiUser className="h-4 w-4" />}
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-700 shadow-lg transition">
                  <p className="px-2 py-1 font-semibold truncate">{user.name}</p>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="hidden md:inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiUser className="h-4 w-4" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal open={showAuth && !user} onClose={() => setShowAuth(false)} />
    </>
  );
};

