"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import ShowProduk from "./produk";

export default function SearchProduk({ cari }) {
  const [warna, setWarna] = useState("");
  const [ukuran, setUkuran] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [produkChosen, setProdukChosen] = useState("");
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const filteredProduk = produkList.filter((p) => {
    const allWarna = p.produk.map((item) => item.warna.toLowerCase());
    const allUkuran = p.produk.flatMap((item) =>
      item.ukuran.map((u) => u.toLowerCase())
    );

    const matchWarna = warna === "" || allWarna.includes(warna);
    const matchUkuran = ukuran === "" || allUkuran.includes(ukuran);
    const matchLokasi =
      lokasi === "" || p.lokasi.toLowerCase().includes(lokasi.toLowerCase());
    const matchCari =
      cari === "" ||
      p.nama.toLowerCase().includes(cari.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(cari.toLowerCase());
    return matchWarna && matchUkuran && matchLokasi && matchCari;
  });

  // 🔥 Load data dari localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem("produkDB");
      if (data) setProdukList(JSON.parse(data));
    } catch {
      setProdukList([]);
    } finally {
      setLoading(true);
    }
  }, []);

  if (!loading) return <p>Memuat...</p>;

  return (
    <>
      {/* Konten */}
      <div className="flex m-0 w-full gap-2">
        <div className="p-2 space-y-2 w-full">
          {/* Filter Section */}
          <div className="flex flex-wrap gap-4">
            {/* Filter Warna */}
            <select
              className="border border-gray-300 rounded-xl px-3 py-2"
              value={warna}
              onChange={(e) => setWarna(e.target.value)}
            >
              <option value="">Semua Warna</option>
              <option value="Hitam">Hitam</option>
              <option value="Putih">Putih</option>
              <option value="Merah">Merah</option>
              <option value="Biru">Biru</option>
              <option value="Coklat">Coklat</option>
            </select>

            {/* Filter Ukuran */}
            <select
              className="border border-gray-300 rounded-xl px-3 py-2"
              value={ukuran}
              onChange={(e) => setUkuran(e.target.value)}
            >
              <option value="">Semua Ukuran</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            {/* Filter Lokasi */}
            <select
              className="border border-gray-300 rounded-xl px-3 py-2"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Yogyakarta">Yogyakarta</option>
            </select>
          </div>

          {/* Produk Tampil */}
          <div className="grid grid-cols-4 max-md:grid-cols-1 gap-2">
            {" "}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                produkChosen
                  ? "col-span-3 translate-x-0 opacity-100"
                  : "col-span-4 translate-x-0 opacity-100"
              } max-md:cols-span-1 flex flex-wrap items-start justify-center h-full bg-blue-200 rounded-2xl`}
            >
              {produkList.length > 0 ? (
                filteredProduk.map((p) => (
                  <button key={p.id} onClick={() => setProdukChosen(p)}>
                    {" "}
                    <div
                      className="border border-gray-300 w-56 h-80 m-2 rounded-2xl bg-blue-100 hover:scale-110 transition-transform duration-300"
                      key={p.id}
                    >
                      <div className="border border-gray-400 m-4 rounded-2xl w-48 h-48 overflow-hidden">
                        <Image
                          src={p.produk[0].gambar[0]}
                          width={200}
                          height={200}
                          alt={p.nama}
                          className="rounded-t-2xl w-full h-full rounded-2xl object-cover "
                        />
                      </div>
                      <div className="px-4">
                        <h2 className="font-semibold text-lg">{p.nama}</h2>
                        <p className="text-blue-800 font-bold">
                          Rp {p.produk[0].harga.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p>Produk Tidak Ditemukan!</p>
                </div>
              )}
            </div>
            {/* Produk Dipilih */}
            <ShowProduk produkSelected={produkChosen} />
          </div>
        </div>
      </div>
    </>
  );
}
