import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const csvPath = path.resolve(process.cwd(), '../shoes_dim.csv');

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    console.error('CSV seems empty');
    process.exit(1);
  }

  const header = parseCsvLine(lines[0]);
  const idx = {
    id: header.indexOf('id'),
    name: header.indexOf('name'),
    best_for_wear: header.indexOf('best_for_wear'),
    gender: header.indexOf('gender'),
    image_url: header.indexOf('image_url'),
    dominant_color: header.indexOf('dominant_color'),
    sub_color1: header.indexOf('sub_color1'),
    sub_color2: header.indexOf('sub_color2'),
  };

  const skipIds = new Set(['HP9426', 'HQ4199', 'IH5467', 'IG7323', 'IE8593']);

  const dataLines = lines.slice(1, 80); // take first ~79 rows after header

  const products = [];
  for (const line of dataLines) {
    const cols = parseCsvLine(line);
    const id = cols[idx.id];
    if (!id || skipIds.has(id)) continue;

    const name = cols[idx.name];
    const bestForWear = cols[idx.best_for_wear] || null;
    const gender = cols[idx.gender] || null;
    const imageUrl = cols[idx.image_url] || null;
    const dominant = cols[idx.dominant_color] || null;
    const c1 = cols[idx.sub_color1] || null;
    const c2 = cols[idx.sub_color2] || null;

    if (!imageUrl) continue;

    const category =
      gender === 'M'
        ? 'Nam'
        : gender === 'W'
        ? 'Nữ'
        : gender === 'K'
        ? 'Trẻ em'
        : 'Unisex';

    const colorSet = new Set(
      [dominant, c1, c2].filter((c) => c && c.trim().length > 0),
    );
    const colors = Array.from(colorSet);

    let sizes;
    if (gender === 'K') {
      sizes = ['30', '31', '32', '33', '34', '35'];
    } else {
      sizes = ['38', '39', '40', '41', '42', '43'];
    }

    const index = products.length;
    const basePrice = 1499000 + (index % 6) * 200000;
    const price = basePrice;
    const oldPrice = basePrice + 400000;

    products.push({
      id,
      name,
      price,
      old_price: oldPrice,
      category,
      gender,
      best_for_wear: bestForWear,
      image_url: imageUrl,
      description: `${name} là mẫu giày Adidas với phong cách ${bestForWear || 'đa dụng'} và tông màu chủ đạo ${dominant || 'trung tính'}.`,
      is_new: true,
      is_trending: index < 8,
      sizes,
      colors,
    });

    if (products.length >= 40) break;
  }

  console.log(`Prepared ${products.length} products to import`);

  const { error } = await supabase.from('products').upsert(products, {
    onConflict: 'id',
  });

  if (error) {
    console.error('Error inserting products:', error);
    process.exit(1);
  }

  console.log('Import completed successfully');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

