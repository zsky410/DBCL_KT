import fs from 'node:fs';
import path from 'node:path';

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

function main() {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    throw new Error('CSV seems empty');
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

  const dataLines = lines.slice(1, 80);

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

  const escape = (v) => String(v).replace(/'/g, "''");

  const rowSql = products
    .map((p) => {
      const sizesSql =
        'ARRAY[' + p.sizes.map((s) => `'${escape(s)}'`).join(', ') + ']';
      const colorsSql =
        'ARRAY[' + p.colors.map((c) => `'${escape(c)}'`).join(', ') + ']';

      return `('${escape(p.id)}', '${escape(p.name)}', ${p.price}, ${p.old_price}, '${escape(
        p.category,
      )}', ${p.gender ? `'${escape(p.gender)}'` : 'NULL'}, ${
        p.best_for_wear ? `'${escape(p.best_for_wear)}'` : 'NULL'
      }, '${escape(p.image_url)}', '${escape(
        p.description,
      )}', ${p.is_new ? 'true' : 'false'}, ${
        p.is_trending ? 'true' : 'false'
      }, ${sizesSql}, ${colorsSql})`;
    })
    .join(',\n  ');

  const sql = `INSERT INTO products (id, name, price, old_price, category, gender, best_for_wear, image_url, description, is_new, is_trending, sizes, colors)
VALUES
  ${rowSql}
ON CONFLICT (id) DO NOTHING;`;

  console.log(sql);
}

main();

