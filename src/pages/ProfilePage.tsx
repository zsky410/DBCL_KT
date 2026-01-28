import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { productService } from '../services/productService';

type OrderRow = {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  zip_code: string;
  phone: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
  order_items?: Array<{
    id?: string;
    order_id: string;
    product_id: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
};

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đã giao',
  delivered: 'Đã nhận',
  cancelled: 'Đã hủy',
};

export const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const rows = (data || []) as OrderRow[];
        setOrders(rows);

        const ids = new Set<string>();
        rows.forEach((o) => {
          (o.order_items || []).forEach((i) => ids.add(i.product_id));
        });
        const names: Record<string, string> = {};
        await Promise.all(
          Array.from(ids).map(async (id) => {
            const p = await productService.getById(id);
            if (p) names[id] = p.name;
          }),
        );
        if (!cancelled) setProductNames(names);
      } catch (e) {
        console.error('Load orders failed', e);
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || !user) {
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
      <div className="container-wide py-12">
        <h1 className="text-2xl font-semibold mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600 text-sm mb-8">{user.email}</p>

        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-12 text-center">
            <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const open = expandedId === order.id;
              const items = order.order_items || [];
              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full flex flex-wrap items-center justify-between gap-4 px-4 py-4 text-left hover:bg-gray-50/50 transition"
                    onClick={() => setExpandedId(open ? null : order.id)}
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-medium">
                        Đơn #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(order.created_at)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </div>
                    <span className="font-semibold">{formatVND(order.total)}</span>
                  </button>
                  {open && items.length > 0 && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/30">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Chi tiết đơn hàng
                      </p>
                      <ul className="space-y-2">
                        {items.map((item, idx) => (
                          <li
                            key={item.order_id + item.product_id + idx}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {productNames[item.product_id] || item.product_id} —{' '}
                              {item.size} / {item.color} × {item.quantity}
                            </span>
                            <span>{formatVND(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
};
