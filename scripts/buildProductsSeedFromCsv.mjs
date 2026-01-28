/**
 * Đọc shoes_dim.csv (project root), tạo products.seed.json với 50 sản phẩm.
 * Chạy: npm run build-products-seed
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = join(__dirname, '../../shoes_dim.csv');
const outPath = join(__dirname, 'products.seed.json');

const TARGET_COUNT = 50;

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

function main() {
  const raw = readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    console.error('CSV trống hoặc chỉ có header.');
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

  const products = [];
  for (let i = 1; i < lines.length && products.length < TARGET_COUNT; i++) {
    const cols = parseCsvLine(lines[i]);
    const id = (cols[idx.id] || '').trim();
    const name = (cols[idx.name] || '').trim();
    const imageUrl = (cols[idx.image_url] || '').trim();
    if (!id || !name || !imageUrl) continue;

    const bestForWear = (cols[idx.best_for_wear] || '').trim() || null;
    const gender = (cols[idx.gender] || '').trim() || null;
    const dominant = (cols[idx.dominant_color] || '').trim();
    const c1 = (cols[idx.sub_color1] || '').trim();
    const c2 = (cols[idx.sub_color2] || '').trim();

    const category =
      gender === 'M' ? 'Nam' : gender === 'W' ? 'Nữ' : gender === 'K' ? 'Trẻ em' : 'Unisex';

    const colorSet = new Set([dominant, c1, c2].filter((c) => c && c.length > 0));
    const colors = Array.from(colorSet);

    const sizes = gender === 'K' ? ['30', '31', '32', '33', '34', '35'] : ['38', '39', '40', '41', '42', '43'];

    const n = products.length;
    const basePrice = 1_499_000 + (n % 6) * 200_000;
    const price = basePrice;
    const oldPrice = basePrice + 400_000;

    const description = `${name} là mẫu giày Adidas với phong cách ${bestForWear || 'đa dụng'} và tông màu chủ đạo ${dominant || 'trung tính'}.`;

    products.push({
      id,
      name,
      price,
      oldPrice,
      category,
      imageUrl,
      description,
      isNew: true,
      isTrending: n < 8,
      sizes,
      colors,
      bestForWear: bestForWear || undefined,
      gender: gender || undefined,
    });
  }

  writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Đã ghi ${products.length} sản phẩm vào ${outPath}`);
}

main();
