# 🚀 راهنمای کامل راه‌اندازی NexStore

## مرحله ۱ — آماده‌سازی پروژه

```bash
# استخراج فایل zip
unzip nexstore.zip
cd nexstore

# نصب پکیج‌ها
npm install
```

---

## مرحله ۲ — تنظیم MongoDB Atlas

1. به https://cloud.mongodb.com بروید
2. یک Cluster رایگان (M0) بسازید
3. در بخش **Database Access**: کاربر با رمز بسازید
4. در بخش **Network Access**: IP `0.0.0.0/0` اضافه کنید
5. Connection String را کپی کنید:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/nexstore
   ```

---

## مرحله ۳ — تنظیم Cloudinary

1. به https://cloudinary.com بروید (حساب رایگان)
2. از Dashboard این ۳ مقدار را کپی کنید:
   - Cloud Name
   - API Key  
   - API Secret

---

## مرحله ۴ — فایل .env.local

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/nexstore
NEXTAUTH_SECRET=replace-this-with-a-random-32-char-string-abc123
NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
```

> برای NEXTAUTH_SECRET: `openssl rand -base64 32` را اجرا کنید

---

## مرحله ۵ — ایجاد ابرمدیر

```bash
node scripts/seed.js
```

---

## مرحله ۶ — تست محلی

```bash
npm run dev
# باز کنید: http://localhost:3000
```

---

## مرحله ۷ — ایجاد ریپو GitHub

```bash
# داخل پوشه nexstore:
git init
git add .
git commit -m "feat: initial commit — NexStore multi-tenant platform"

# در GitHub یک ریپو جدید بسازید (private یا public)
git remote add origin https://github.com/YOUR_USERNAME/nexstore.git
git branch -M main
git push -u origin main
```

---

## مرحله ۸ — دیپلوی Vercel

### روش A — از طریق داشبورد (آسان‌تر):
1. به https://vercel.com بروید
2. **New Project** → **Import Git Repository**
3. ریپوی nexstore را انتخاب کنید
4. در بخش **Environment Variables** این متغیرها را اضافه کنید:
   ```
   MONGODB_URI
   NEXTAUTH_SECRET
   NEXTAUTH_URL=https://your-project.vercel.app
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   ADMIN_EMAIL
   ADMIN_PASSWORD
   ```
5. **Deploy** را کلیک کنید

### روش B — از طریق CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## مرحله ۹ — بعد از دیپلوی

1. آدرس Vercel را در `NEXTAUTH_URL` آپدیت کنید
2. دوباره دیپلوی کنید یا متغیر را در Vercel Dashboard ویرایش کنید
3. سیدسکریپت را با MongoDB URI اصلی اجرا کنید

---

## 🔐 ورود به پنل‌ها

| پنل | آدرس | نقش |
|-----|------|-----|
| ابرمدیر | `/admin` | superadmin |
| مدیر فروشگاه | `/dashboard` | store_admin |
| فروشگاه مشتری | `/store/SLUG` | customer |

---

## 🏪 فلو کامل راه‌اندازی فروشگاه

```
1. مدیر جدید → /register → فروشگاه ثبت می‌کند
2. ابرمدیر → /admin/stores → توکن صادر می‌کند
3. فروشگاه فعال می‌شود
4. مدیر → /dashboard → محصولات و تنظیمات اضافه می‌کند
5. مشتریان → /store/SLUG → خرید می‌کنند
```

---

## ⚠️ نکات مهم

- فایل `.env.local` را هرگز به Git نفرستید (در .gitignore است)
- رمز ابرمدیر را بعد از اولین ورود تغییر دهید
- برای production، NEXTAUTH_URL را به دامنه اصلی تغییر دهید
- Cloudinary رایگان تا ۲۵GB فضا دارد
