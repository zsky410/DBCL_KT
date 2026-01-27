import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, size, color, quantity')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setItems(
        (data || []).map((item) => ({
          productId: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
      );
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: CartItem) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    }

    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.productId)
        .eq('size', item.size)
        .eq('color', item.color)
        .single();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        });

        if (error) throw error;
      }

      await loadCartItems();
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateItem = async (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeItem(productId, size, color);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color', color);

      if (error) throw error;

      await loadCartItems();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (productId: string, size: string, color: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color', color);

      if (error) throw error;

      await loadCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);

      if (error) throw error;

      await loadCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);

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
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};

