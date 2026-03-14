<div align="center">

<br/>

```
███╗   ██╗███████╗██╗  ██╗███████╗████████╗ ██████╗ ██████╗ ███████╗
████╗  ██║██╔════╝╚██╗██╔╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ███████╗   ██║   ██║   ██║██████╔╝█████╗  
██║╚██╗██║██╔══╝   ██╔██╗ ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  
██║ ╚████║███████╗██╔╝ ██╗███████║   ██║   ╚██████╔╝██║  ██║███████╗
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
```

### **Multi-Tenant E-Commerce Platform**
*Every store. One platform. Zero limits.*

<br/>

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

> 🇮🇷 **فارسی** &nbsp;|&nbsp; 🇺🇸 **English** &nbsp;|&nbsp; 🇮🇹 **Italiano**

<br/>

</div>

---

## ✨ امکانات پلتفرم

### 🔐 سیستم احراز هویت و دسترسی

| ویژگی | توضیح |
|-------|--------|
| **ابرمدیر (SuperAdmin)** | یک پنل کاملاً جداگانه با دسترسی کامل به همه فروشگاه‌ها |
| **مدیر فروشگاه** | پنل مدیریت اختصاصی با دسترسی محدود به داده‌های خودش |
| **مشتری** | ثبت‌نام، خرید، پیگیری سفارش |
| **JWT Sessions** | امنیت بالا با NextAuth.js |
| **رمزنگاری bcrypt** | رمز عبور با bcrypt هش می‌شود |

---

### 🏪 مدیریت فروشگاه‌ها (ابرمدیر)

- **توکن‌دهی** — ابرمدیر به هر فروشگاه توکن اختصاصی با تاریخ انقضا می‌دهد
- **فعال/غیرفعال‌سازی** — هر فروشگاه با یک کلیک فعال یا مسدود می‌شود
- **داشبورد جامع** — آمار کلی تمام فروشگاه‌ها، کاربران و سفارشات
- **مدیریت کاربران** — مشاهده و کنترل تمام کاربران پلتفرم

---

### 🛍️ مدیریت محصولات

- **اطلاعات چندزبانه** — نام، توضیحات و محتوا به ۳ زبان فارسی، انگلیسی و ایتالیایی
- **گالری تصویر** — آپلود تصاویر متعدد با Cloudinary (تبدیل خودکار WebP)
- **رنگ‌بندی** — تعریف رنگ‌های مختلف با color picker، موجودی جداگانه
- **مدل/سایز** — متغیرهای نامحدود با قیمت و موجودی اختصاصی
- **تخفیف زمان‌دار** — درصدی یا مبلغ ثابت، با تاریخ شروع و پایان دقیق
- **موجودی انبار** — مدیریت stock با هشدار کم‌بودن موجودی
- **محصول ویژه** — نشانه‌گذاری محصولات Featured با آیکون ستاره
- **امتیاز و نظرات** — سیستم Rating با تأیید دستی مدیر

---

### 📂 دسته‌بندی بی‌نهایت (Infinite Nesting)

```
📁 پوشاک
  ├── 📁 مردانه
  │     ├── 📁 پیراهن
  │     │     ├── 📁 رسمی
  │     │     └── 📁 اسپرت
  │     └── 📁 شلوار
  └── 📁 زنانه
        └── 📁 لباس مجلسی
              └── 📁 کوتاه
                    └── 📁 ... (نامحدود)
```

- **درخت قابل سازی** — ساختار tree با UI بصری و expandable
- **تصویر اختصاصی** — هر دسته تصویر جداگانه دارد
- **مرتب‌سازی** — ترتیب نمایش قابل تنظیم
- **حذف آبشاری** — حذف دسته، تمام زیردسته‌ها را هم حذف می‌کند

---

### 🎨 شخصی‌سازی فروشگاه

| ویژگی | توضیح |
|-------|--------|
| **لوگو اختصاصی** | آپلود لوگو PNG/SVG با background شفاف |
| **رنگ اصلی** | Color picker کامل برای تم فروشگاه |
| **رنگ تأکیدی** | رنگ دکمه‌ها و المان‌های برجسته |
| **پیش‌تنظیم‌های رنگی** | ۶ تم آماده برای انتخاب سریع |
| **پیش‌نمایش زنده** | مشاهده تغییرات رنگ قبل از ذخیره |
| **زبان پیش‌فرض** | انتخاب زبان پیش‌فرض فروشگاه |

---

### 🖼️ مدیریت بنرها

- **اسلایدر پویا** — تغییر خودکار بنرها هر ۵ ثانیه
- **آپلود تصویر** — آپلود مستقیم روی بنر با Cloudinary
- **متن روی بنر** — عنوان، زیرعنوان و دکمه CTA با لینک
- **فعال/غیرفعال** — هر بنر مستقل قابل مدیریت است
- **ترتیب** — بنرها به ترتیب ایجاد نمایش داده می‌شوند

---

### 📦 مدیریت سفارشات

**وضعیت‌های سفارش:**
```
در انتظار → تأیید شده → در پردازش → ارسال شده → تحویل داده شده
                                                   ↘ لغو شده
```

- **جزئیات کامل** — آیتم‌ها، آدرس، قیمت، رنگ و مدل انتخابی
- **فیلتر پیشرفته** — جستجو بر اساس شماره سفارش، نام یا ایمیل
- **تغییر وضعیت** — مستقیم از modal با یک کلیک
- **وضعیت پرداخت** — پرداخت نشده، پرداخت شده، برگشت داده شده
- **کد پیگیری** — قابلیت ثبت کد رهگیری پستی

---

### 👥 مدیریت مشتریان

- **لیست کامل** — اطلاعات تماس، آدرس، تاریخ عضویت
- **مسدودسازی** — غیرفعال کردن حساب مشتری بدون حذف
- **آمار** — تعداد کل، فعال و غیرفعال
- **جستجو** — بر اساس نام، ایمیل یا شماره تلفن

---

### 🌐 پشتیبانی چندزبانه

```typescript
// هر محتوا به ۳ زبان ذخیره می‌شود
{
  name: {
    fa: "کفش ورزشی نایک",
    en: "Nike Sports Shoes",
    it: "Scarpe Sportive Nike"
  }
}
```

- **RTL/LTR** — چیدمان خودکار بر اساس زبان انتخابی
- **فونت اختصاصی** — وزیرمتن برای فارسی، DM Sans برای لاتین
- **سوئیچ زنده** — تغییر زبان بدون reload صفحه
- **انتخاب مشتری** — مشتری می‌تواند زبان را تغییر دهد

---

### 🏬 تجربه مشتری (Customer Storefront)

**صفحه اصلی:**
- اسلایدر بنر با انیمیشن
- گرید دسته‌بندی‌ها
- محصولات ویژه (Featured)
- جدیدترین محصولات

**لیست محصولات:**
- فیلتر بر اساس دسته
- مرتب‌سازی (جدید، ارزان، گران، پرفروش)
- نمای Grid و List
- جستجوی پیشرفته
- صفحه‌بندی (Pagination)

**صفحه محصول:**
- گالری تصاویر با thumbnail
- انتخاب رنگ با color swatch
- انتخاب مدل/سایز
- کنترل تعداد
- افزودن به سبد خرید
- لیست علاقه‌مندی (Wishlist)
- محصولات مرتبط

---

## 🏗️ معماری پروژه

```
nexstore/
├── app/
│   ├── (auth)/              # صفحات ورود و ثبت‌نام
│   ├── (dashboard)/
│   │   ├── admin/           # پنل ابرمدیر
│   │   └── store/           # پنل مدیر فروشگاه
│   ├── (store)/
│   │   └── [storeId]/       # فروشگاه مشتری
│   └── api/                 # تمام API Routeها
├── components/
│   ├── store/               # کامپوننت‌های فروشگاه
│   └── ui/                  # کامپوننت‌های مشترک
├── models/                  # مدل‌های MongoDB
│   ├── User.ts
│   ├── Store.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Order.ts
│   └── Review.ts
├── lib/
│   ├── db.ts                # اتصال MongoDB
│   ├── auth.ts              # NextAuth config
│   ├── i18n.ts              # ترجمه‌ها
│   ├── cloudinary.ts        # آپلود تصویر
│   └── utils.ts             # توابع کمکی
└── scripts/
    └── seed.js              # ایجاد ابرمدیر
```

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- حساب MongoDB Atlas
- حساب Cloudinary

### ۱. کلون پروژه

```bash
git clone https://github.com/YOUR_USERNAME/nexstore.git
cd nexstore
npm install
```

### ۲. تنظیم متغیرهای محیطی

```bash
cp .env.example .env.local
```

فایل `.env.local` را با مقادیر خود پر کنید:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_min_32_chars
NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=your_secure_password
```

### ۳. ایجاد ابرمدیر

```bash
node scripts/seed.js
```

### ۴. اجرای پروژه

```bash
npm run dev
```

---

## ☁️ استقرار روی Vercel

```bash
# نصب Vercel CLI
npm i -g vercel

# لاگین
vercel login

# دیپلوی
vercel --prod
```

**متغیرهای محیطی را در داشبورد Vercel اضافه کنید:**

`Settings → Environment Variables`

---

## 🔗 مسیرهای اصلی

| مسیر | توضیح |
|------|--------|
| `/` | صفحه اصلی و معرفی پلتفرم |
| `/login` | ورود به سیستم |
| `/register` | ثبت‌نام مدیر فروشگاه |
| `/admin` | داشبورد ابرمدیر |
| `/admin/stores` | مدیریت فروشگاه‌ها و توکن‌ها |
| `/dashboard` | داشبورد مدیر فروشگاه |
| `/dashboard/products` | مدیریت محصولات |
| `/dashboard/categories` | مدیریت دسته‌بندی‌ها |
| `/dashboard/orders` | مدیریت سفارشات |
| `/dashboard/banners` | مدیریت بنرها |
| `/dashboard/appearance` | تنظیمات ظاهری |
| `/store/[slug]` | فروشگاه مشتری |
| `/store/[slug]/products` | لیست محصولات |
| `/store/[slug]/product/[slug]` | صفحه محصول |

---

## 🎨 طراحی

- **فونت**: Playfair Display (عناوین) + DM Sans (متن) + Vazirmatn (فارسی)
- **پالت**: مینیمال مشکی و طلایی با تم‌های سفارشی
- **انیمیشن**: CSS animations + Framer Motion
- **Glass Morphism**: در navbar و overlay‌ها
- **RTL/LTR**: پشتیبانی کامل بر اساس زبان

---

## 🔧 تکنولوژی‌ها

| دسته | فناوری |
|------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (JWT) |
| Styling | Tailwind CSS |
| Images | Cloudinary |
| Hosting | Vercel |
| Password | bcryptjs |

---

<div align="center">

**ساخته شده با ❤️ برای رزومه‌های درخشان**

*NexStore — Where every store finds its home*

</div>
