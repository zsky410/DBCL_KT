import { supabase } from '../lib/supabase';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }

    return (data || []).map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      rating: t.rating,
      text: t.text,
      avatar: t.avatar_url || 'https://i.pravatar.cc/48',
    }));
  },
};
