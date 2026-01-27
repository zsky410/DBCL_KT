import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  description: string;
  isNew?: boolean;
  isTrending?: boolean;
  sizes?: string[];
  colors?: string[];
  bestForWear?: string;
  gender?: string;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.old_price,
      category: p.category,
      image: p.image_url,
      description: p.description || '',
      isNew: p.is_new,
      isTrending: p.is_trending,
      sizes: p.sizes || [],
      colors: p.colors || [],
      bestForWear: p.best_for_wear,
      gender: p.gender,
    }));
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      oldPrice: data.old_price,
      category: data.category,
      image: data.image_url,
      description: data.description || '',
      isNew: data.is_new,
      isTrending: data.is_trending,
      sizes: data.sizes || [],
      colors: data.colors || [],
      bestForWear: data.best_for_wear,
      gender: data.gender,
    };
  },

  async getTrending(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.old_price,
      category: p.category,
      image: p.image_url,
      description: p.description || '',
      isNew: p.is_new,
      isTrending: p.is_trending,
      sizes: p.sizes || [],
      colors: p.colors || [],
      bestForWear: p.best_for_wear,
      gender: p.gender,
    }));
  },

  async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.old_price,
      category: p.category,
      image: p.image_url,
      description: p.description || '',
      isNew: p.is_new,
      isTrending: p.is_trending,
      sizes: p.sizes || [],
      colors: p.colors || [],
      bestForWear: p.best_for_wear,
      gender: p.gender,
    }));
  },
};
