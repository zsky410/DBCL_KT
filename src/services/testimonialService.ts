import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

const COL = 'testimonials';

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const snap = await getDocs(collection(db, COL));
    return snap.docs
      .map((d) => {
        const data = d.data();
        if (!data || data.isApproved === false) return null;
        return {
          id: d.id,
          name: data.name ?? '',
          role: data.role ?? 'Khách hàng',
          rating: Number(data.rating ?? 5),
          text: data.text ?? '',
          avatar: data.avatarUrl ?? data.avatar_url ?? 'https://i.pravatar.cc/48',
        };
      })
      .filter(Boolean) as Testimonial[];
  },
};
