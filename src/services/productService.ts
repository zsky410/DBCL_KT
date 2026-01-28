import { collection, getDocs, getDoc, doc, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

const COL = 'products';

function mapDoc(d: DocumentSnapshot): Product | null {
  const data = d.data();
  if (!data) return null;
  return {
    id: d.id,
    name: data.name ?? '',
    price: Number(data.price ?? 0),
    oldPrice: data.oldPrice != null ? Number(data.oldPrice) : undefined,
    category: data.category ?? '',
    image: data.imageUrl ?? data.image_url ?? '',
    description: data.description ?? '',
    isNew: data.isNew ?? data.is_new ?? false,
    isTrending: data.isTrending ?? data.is_trending ?? false,
    sizes: data.sizes ?? [],
    colors: data.colors ?? [],
    bestForWear: data.bestForWear ?? data.best_for_wear,
    gender: data.gender,
  };
}

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, COL));
      const list = snap.docs.map((d) => mapDoc(d)).filter(Boolean) as Product[];
      if (list.length === 0) {
        console.warn('Firestore products rỗng. Chạy: npm run seed (trong thư mục web-shop) rồi deploy Firestore rules nếu cần.');
      }
      return list;
    } catch (e) {
      console.error('Lỗi đọc products từ Firestore:', e);
      return [];
    }
  },

  async getById(id: string): Promise<Product | null> {
    const d = await getDoc(doc(db, COL, id));
    return mapDoc(d);
  },

  async getTrending(): Promise<Product[]> {
    const all = await this.getAll();
    return all.filter((p) => p.isTrending).slice(0, 3);
  },

  async search(queryText: string): Promise<Product[]> {
    const all = await this.getAll();
    const q = (queryText || '').toLowerCase();
    if (!q) return all;
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  },
};
