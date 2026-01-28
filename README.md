# Slick Web Shop

Cửa hàng giày (React + Vite + Tailwind). Backend: **Firebase** (Auth + Firestore).

## Firebase setup

1. Tạo project tại [Firebase Console](https://console.firebase.google.com).
2. Bật **Authentication** → Sign-in method → **Email/Password**.
3. Tạo **Firestore** database (chế độ production hoặc test).
4. Vào Project settings → General → Your apps → thêm **Web app** → copy config.

5. Tạo `.env.local` trong `web-shop/`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. **Deploy Firestore rules** (bắt buộc nếu Firestore đang chế độ production):

```bash
npm install -g firebase-tools
firebase login
cd web-shop
firebase deploy --only firestore:rules
```

(Project `quickshop-ab035` đã cấu hình trong `.firebaserc`.)

7. **Service account** (cho `npm run seed` — bypass Firestore rules):

- Firebase Console → **Project settings** → **Service accounts** → **Generate new private key** → tải file JSON.
- Đổi tên và đặt file thành `web-shop/firebase-service-account.json` (đã có trong `.gitignore`).

Script seed tự tìm file này. Muốn dùng đường dẫn khác: thêm `FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/key.json` vào `.env.local`.

8. **Seed dữ liệu mẫu** (50 products từ `shoes_dim.csv` + testimonials):

```bash
npm run seed
```

`npm run seed` chạy `build-products-seed` (CSV → `products.seed.json`) rồi ghi lên Firestore qua Admin SDK. Chỉ tạo JSON: `npm run build-products-seed`.

## Chạy

```bash
npm install
npm run dev
```

Build: `npm run build`.

---

**Vẫn không thấy sản phẩm?** Mở DevTools (F12) → Console:

- `Firestore products rỗng...` → Chạy `npm run seed`, sau đó **restart** `npm run dev` và refresh trang.
- `Lỗi đọc products...` / `Missing or insufficient permissions` → Deploy Firestore rules (bước 6). Nếu đã deploy, kiểm tra Firestore đã bật và đúng project.
- **Restart `npm run dev`** sau khi sửa `.env.local` (Vite chỉ đọc env lúc khởi động).

**`npm run seed` báo PERMISSION_DENIED?** → Cấu hình **service account** (bước 7): tải key JSON, đặt `FIREBASE_SERVICE_ACCOUNT_PATH` trong `.env.local`, chạy lại seed.
