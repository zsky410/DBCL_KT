import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === 'login') {
      const ok = await login(email, password);
      if (!ok) {
        setError('Email hoặc mật khẩu không đúng.');
        return;
      }
      onClose();
    } else {
      if (!name.trim()) {
        setError('Vui lòng nhập họ tên.');
        return;
      }
      await signup(name.trim(), email, password);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <div className="flex mb-4 rounded-full bg-gray-100 p-1 text-sm font-medium">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 ${
              mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-full py-2 ${
              mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block font-medium">Họ tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
};

