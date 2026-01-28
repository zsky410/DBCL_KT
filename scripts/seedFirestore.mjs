/**
 * Seed Firestore với products + testimonials (Firebase Admin SDK).
 * Bypass security rules — cần service account.
 * Chạy: npm run seed (đọc .env.local hoặc .env)
 *
 * Cấu hình: FIREBASE_SERVICE_ACCOUNT_PATH hoặc GOOGLE_APPLICATION_CREDENTIALS
 * trỏ tới file JSON service account (tải từ Firebase Console → Project settings → Service accounts).
 */
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
if (existsSync(join(root, '.env.local'))) dotenv.config({ path: join(root, '.env.local') });
else dotenv.config({ path: join(root, '.env') });

const defaultPath = join(root, 'firebase-service-account.json');
const pathOrEnv =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  (existsSync(defaultPath) ? defaultPath : null);

if (!pathOrEnv) {
  console.error(
    'Thiếu service account.\n' +
      '  1. Firebase Console → Project settings → Service accounts → Generate new private key → tải JSON.\n' +
      '  2. Đặt file thành web-shop/firebase-service-account.json\n' +
      '  Hoặc thêm vào .env.local: FIREBASE_SERVICE_ACCOUNT_PATH=./đường-dẫn-file.json'
  );
  process.exit(1);
}

const keyPath = pathOrEnv.startsWith('/') || pathOrEnv.match(/^[A-Za-z]:/) ? pathOrEnv : join(root, pathOrEnv.replace(/^\.\//, ''));
if (!existsSync(keyPath)) {
  console.error('Không tìm thấy file service account:', keyPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const productsPath = join(__dirname, 'products.seed.json');
const products = JSON.parse(readFileSync(productsPath, 'utf-8'));

const testimonials = [
  { name: 'Minh Anh', role: 'Khách hàng', rating: 5, text: 'Giày đẹp, giao nhanh. Rất hài lòng!', avatarUrl: 'https://i.pravatar.cc/48?u=1', isApproved: true },
  { name: 'Hoàng Nam', role: 'Khách hàng', rating: 5, text: 'Chất lượng tốt, giá hợp lý.', avatarUrl: 'https://i.pravatar.cc/48?u=2', isApproved: true },
  { name: 'Thu Hà', role: 'Khách hàng', rating: 4, text: 'Sản phẩm đúng mô tả, sẽ ủng hộ lâu dài.', avatarUrl: 'https://i.pravatar.cc/48?u=3', isApproved: true },
];

async function main() {
  console.log('Đang seed products...');
  const batch = db.batch();
  for (const p of products) {
    const { id, ...rest } = p;
    const ref = db.collection('products').doc(id);
    batch.set(ref, { ...rest, createdAt: new Date() });
  }
  await batch.commit();
  console.log(`Đã seed ${products.length} products.`);

  console.log('Đang seed testimonials...');
  for (const t of testimonials) {
    await db.collection('testimonials').add(t);
  }
  console.log(`Đã seed ${testimonials.length} testimonials.`);
  console.log('Xong.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
