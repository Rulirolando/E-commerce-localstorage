"use client";
import Navbar from "./components/navbar";
import Image from "next/image";
import img from "../public/assets/img/pngtree-e-commerce-website-displayed-on-laptop-screen-with-shopping-cart-and-image_3903594.jpg";
import kategoriList from "../public/assets/kategoriProduk";
import { useState } from "react";
export default function Home() {
  const [showAll, setShowAll] = useState(false);

  const kategoriArray = Object.keys(kategoriList)
    .map((key) => {
      const foto = kategoriList[key].foto;
      if (!foto) return null;

      return (
        <div key={key} className="relative w-1/4 h-48">
          <Image
            src={foto}
            alt={kategoriList[key].deskripsi}
            width={300}
            height={300}
            className="w-full h-full object-cover transition hover:-translate-y-1 hover:scale-105 duration-300 rounded-lg"
          />

          <p className="absolute bottom-3 left-3 text-white font-bold text-xl drop-shadow">
            {key}
          </p>
        </div>
      );
    })
    .filter(Boolean);

  // tampilkan hanya 6 kategori awal jika belum showAll
  const tampilkanKategori = showAll ? kategoriArray : kategoriArray.slice(0, 6);
  return (
    <>
      <Navbar className="fixed z-50" />
      <div className="relative w-full h-1/2">
        <Image
          src={img}
          alt="logo"
          width={100}
          height={100}
          className="w-full h-1/2 object-cover"
        ></Image>
        <div className="absolute top-1/4 left-30 w-1/2 space-y-4 text-white">
          <h1 className="text-5xl font-bold">
            Belanja Produk Berkualitas dengan Harga Terbaik
          </h1>
          <p>
            Temukan berbagai pilihan produk berkualitas tinggi untuk memenuhi
            kebutuhan Anda. Pengiriman cepat, pembayaran aman, dan layanan
            pelanggan terbaik.
          </p>
        </div>
      </div>

      <h1 className="text-center font-bold text-5xl mt-12">Kategori Populer</h1>
      <p className="text-center mt-4">
        Jelajahi berbagai kategori produk pilihan kami
      </p>
      <div className="w-full flex flex-wrap gap-5 justify-center mt-7">
        {tampilkanKategori}
      </div>

      {/* BUTTON LIHAT SEMUA */}
      {!showAll === true ? (
        <button
          className="flex justify-self-center mt-7 px-4 py-2 text-blue-400 border-2 border-blue-700  shadow-blue-500 rounded-lg hover:bg-blue-300 text-center cursor-pointer transition translate hover:-translate-y-1 hover:scale-105 duration-300"
          onClick={() => setShowAll(true)}
        >
          Lihat Semua
        </button>
      ) : (
        <button
          className="flex justify-self-center mt-7 px-4 py-2  text-blue-400 border-2 border-blue-700  shadow-blue-500 rounded-lg hover:bg-blue-300 text-center cursor-pointer transition translate hover:-translate-y-1 hover:scale-105 duration-300"
          onClick={() => setShowAll(false)}
        >
          Lihat Lebih Sedikit
        </button>
      )}

      <h1 className="text-center font-bold text-5xl mt-12">Produk Terbaru</h1>
      <p className="text-center mt-4">Jelajahi berbagai produk pilihan kami</p>
    </>
  );
}
