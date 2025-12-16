# 🛒 E-Commerce Website (Next.js)

cara menjalankan: 
```npm run dev```

Website e-commerce sederhana menggunakan **Next.js (App Router)** dengan fitur:
- Produk
- Kategori
- Login
- Love / Wishlist Produk
- Penyimpanan data sementara (localStorage & API)

---

## 🚀 Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- LocalStorage (sementara)
- REST API (Next.js API Routes)

---

## 📦 Fitur Utama

### 1. Autentikasi User
- Login user disimpan di `localStorage`
- Data login digunakan untuk validasi aksi user (love produk)

---

### 2. Love / Wishlist Produk (API)

Fitur love produk **menggunakan API**, bukan langsung manipulasi state.

#### Endpoint
