import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  updateItem: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  removeItem: (productId: string, size: string, color: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const COL = 'cartItems';

function cartDocId(userId: string, productId: string, size: string, color: string) {
  return [userId, productId, size, color].join('__');
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadCartItems();
    else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = query(collection(db, COL), where('userId', '==', user.id));
      const snap = await getDocs(q);
      setItems(
        snap.docs.map((d) => {
          const x = d.data();
          return {
            productId: x.productId,
            size: x.size,
            color: x.color,
            quantity: x.quantity,
          };
        })
      );
    } catch (e) {
      console.error('Error loading cart:', e);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: CartItem) => {
    if (!user) throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    const id = cartDocId(user.id, item.productId, item.size, item.color);
    const ref = doc(db, COL, id);
    const snap = await getDoc(ref);
    const qty = snap.exists()
      ? (snap.data()?.quantity ?? 0) + item.quantity
      : item.quantity;
    await setDoc(ref, {
      userId: user.id,
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: qty,
    });
    await loadCartItems();
  };

  const updateItem = async (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeItem(productId, size, color);
      return;
    }
    const id = cartDocId(user.id, productId, size, color);
    await setDoc(doc(db, COL, id), {
      userId: user.id,
      productId,
      size,
      color,
      quantity,
    });
    await loadCartItems();
  };

  const removeItem = async (productId: string, size: string, color: string) => {
    if (!user) return;
    const id = cartDocId(user.id, productId, size, color);
    await deleteDoc(doc(db, COL, id));
    await loadCartItems();
  };

  const clearCart = async () => {
    if (!user) return;
    const q = query(collection(db, COL), where('userId', '==', user.id));
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    await loadCartItems();
  };

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, addItem, updateItem, removeItem, clearCart, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
