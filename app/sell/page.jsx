"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function JualPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    nama: "",
    kategori: "",
    deskripsi: "",
    lokasi: "",
    comment: "",
  });

  const [variasi, setVariasi] = useState({
    id: crypto.randomUUID(),
    warna: "",
    harga: "",
    stok: "",
    ukuran: "",
    gambar: "",
  });

  const [variasiList, setVariasiList] = useState([]);

  // 🔥 Simpan otomatis ke localStorage setiap produkList berubah

  const tambahVariasi = () => {
    if (
      !variasi.warna ||
      !variasi.harga ||
      !variasi.stok ||
      !variasi.ukuran ||
      !variasi.gambar
    )
      return alert("Isi semua data variasi!");

    setVariasiList([
      ...variasiList,
      {
        id: crypto.randomUUID(),
        warna: variasi.warna,
        harga: parseInt(variasi.harga),
        stok: parseInt(variasi.stok),
        ukuran: variasi.ukuran.split(",").map((u) => u.trim()),
        gambar: [variasi.gambar],
      },
    ]);

    setVariasi({
      warna: "",
      harga: "",
      stok: "",
      ukuran: "",
      gambar: "",
    });
  };

  const simpanProduk = () => {
    const products = localStorage.getItem("produkDB");

    const newProduk = {
      ...form,
      produk: variasiList,
    };

    const update = products
      ? [...JSON.parse(products), newProduk]
      : [newProduk];

    localStorage.setItem("produkDB", JSON.stringify(update));
    setProdukList(update);
    // reset form
    setForm({
      nama: "",
      kategori: "",
      deskripsi: "",
      lokasi: "",
      comment: "",
    });
    setVariasiList([]);
  };

  // 🔥 Load data dari localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem("produkDB");
      if (data) setProdukList(JSON.parse(data));
      console.log(data);
    } catch {
      setProdukList([]);
    } finally {
      setLoading(true);
    }
  }, []);

  if (!loading) return <h1>Loading...</h1>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jual Produk</h1>

      {/* FORM PRODUK */}
      <div className="space-y-3 bg-blue-100 p-4 rounded-xl">
        <input
          placeholder="Nama produk"
          className="p-2 w-full border rounded"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />

        <input
          placeholder="Kategori"
          className="p-2 w-full border rounded"
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
        />

        <textarea
          placeholder="Deskripsi"
          className="p-2 w-full border rounded"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
        />

        <input
          placeholder="Lokasi"
          className="p-2 w-full border rounded"
          value={form.lokasi}
          onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
        />

        <input
          placeholder="Komentar"
          className="p-2 w-full border rounded"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </div>

      <h2 className="text-lg font-bold mt-4">Variasi Produk</h2>

      {/* FORM VARIASI */}
      <div className="space-y-3 bg-blue-50 p-4 rounded-xl mt-2">
        <input
          placeholder="Warna"
          className="p-2 w-full border rounded"
          value={variasi.warna}
          onChange={(e) => setVariasi({ ...variasi, warna: e.target.value })}
        />

        <input
          placeholder="Harga"
          type="number"
          className="p-2 w-full border rounded"
          value={variasi.harga}
          onChange={(e) => setVariasi({ ...variasi, harga: e.target.value })}
        />

        <input
          placeholder="Stok"
          type="number"
          className="p-2 w-full border rounded"
          value={variasi.stok}
          onChange={(e) => setVariasi({ ...variasi, stok: e.target.value })}
        />

        <input
          placeholder="Ukuran (pisahkan dengan koma: S,M,L)"
          className="p-2 w-full border rounded"
          value={variasi.ukuran}
          onChange={(e) => setVariasi({ ...variasi, ukuran: e.target.value })}
        />

        <input
          placeholder="Gambar URL"
          className="p-2 w-full border rounded"
          value={variasi.gambar}
          onChange={(e) => setVariasi({ ...variasi, gambar: e.target.value })}
        />

        <button
          onClick={tambahVariasi}
          className="bg-blue-700 text-white px-3 py-2 rounded"
        >
          + Tambah Variasi
        </button>
      </div>

      {/* LIST VARIASI */}
      {variasiList.length > 0 && (
        <div className="mt-3">
          <h3 className="font-bold">Variasi Ditambahkan:</h3>
          <ul className="list-disc ml-5">
            {variasiList.map((v) => (
              <li key={v.id}>
                {v.warna} — Rp{v.harga.toLocaleString()} — stok {v.stok}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={simpanProduk}
        className="mt-4 w-full bg-green-600 text-white p-3 rounded-xl"
      >
        Simpan Produk
      </button>
      <button
        onClick={() => {
          localStorage.removeItem("produkDB");
          setProdukList([]); // supaya UI langsung kosong
        }}
      >
        Hapus Semua Produk
      </button>

      {/* DAFTAR PRODUK */}
      <h2 className="text-xl font-bold mt-8">Produk Kamu</h2>

      <div className="mt-4 space-y-4">
        {produkList.map((p) => (
          <div key={p.id} className="p-4 border rounded-xl bg-white shadow">
            <h3 className="font-bold">{p.nama}</h3>
            <p className="text-sm text-gray-600">{p.kategori}</p>

            <div className="flex gap-2 mt-2 overflow-auto">
              {p.produk.map((v) => (
                <Image
                  key={v.id}
                  src={v.gambar[0]}
                  alt={v.warna}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded object-cover border"
                />
              ))}
            </div>

            <p className="text-sm mt-2">{p.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
