"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import kategoriList from "../../public/assets/kategoriProduk";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import DragDropUploader from "../components/DragDropUploader";

export default function JualPage() {
  const router = useRouter();
  const [produkList, setProdukList] = useState([]);
  console.log("produkList", produkList);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  console.log("user", user);

  const [form, setForm] = useState(() => ({
    id: crypto.randomUUID(),
    nama: "",
    kategori: "",
    deskripsi: "",
    lokasi: "",
    comment: "",
    createdAt: new Date().toISOString(),
  }));

  const [variasi, setVariasi] = useState(() => ({
    id: crypto.randomUUID(),
    warna: "",
    harga: "",
    stok: "",
    ukuran: "",
    gambar: "",
    terjual: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const [variasiList, setVariasiList] = useState([]);

  // Load products + session once
  useEffect(() => {
    try {
      const products = localStorage.getItem("produkDB");
      if (products) setProdukList(JSON.parse(products));
    } catch (err) {
      console.error("fail load produkDB", err);
      setProdukList([]);
    } finally {
    }

    try {
      const session = localStorage.getItem("loginSessionDB");
      if (session) setUser(JSON.parse(session));
    } catch (err) {
      console.error("fail load session", err);
      setUser(null);
    }

    setReady(true);
  }, []);

  const tambahVariasi = () => {
    if (!user) return alert("User belum siap. Silakan login ulang jika perlu.");

    if (
      !variasi.warna ||
      !variasi.harga ||
      !variasi.stok ||
      !variasi.ukuran ||
      !variasi.gambar
    )
      return alert("Isi semua data variasi!");

    const newVar = {
      id: crypto.randomUUID(),
      ownerId: user.id,
      warna: variasi.warna,
      harga: parseInt(variasi.harga, 10),
      stok: parseInt(variasi.stok, 10),
      ukuran: variasi.ukuran.split(",").map((u) => u.trim()),
      gambar: [variasi.gambar], // base64 or url
      terjual: parseInt(variasi.terjual || 0, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVariasiList((prev) => [...prev, newVar]);

    setVariasi({
      id: crypto.randomUUID(),
      warna: "",
      harga: "",
      stok: "",
      ukuran: "",
      gambar: "",
      terjual: 0,
    });
  };

  const hapusVariasi = (id) => {
    setVariasiList((prev) => prev.filter((v) => v.id !== id));
  };

  const simpanProduk = () => {
    if (!user) return alert("Anda harus login terlebih dahulu.");
    if (!form.nama) return alert("Nama produk wajib diisi");
    if (!form.kategori) return alert("Kategori wajib dipilih");
    if (variasiList.length === 0) return alert("Tambahkan minimal 1 variasi");

    const newProduk = {
      id: form.id || crypto.randomUUID(),
      nama: form.nama,
      kategori: form.kategori,
      deskripsi: form.deskripsi,
      lokasi: form.lokasi,
      comment: form.comment,
      createdAt: form.createdAt || new Date().toISOString(),
      ownerId: user.id,
      loved: [],
      produk: variasiList,
    };

    const update = produkList ? [...produkList, newProduk] : [newProduk];

    setProdukList(update);

    localStorage.setItem("produkDB", JSON.stringify(update));

    // reset form & variasi
    setForm({
      id: crypto.randomUUID(),
      nama: "",
      kategori: "",
      deskripsi: "",
      lokasi: "",
      comment: "",
      loved: [],
      createdAt: new Date().toISOString(),
    });

    setVariasiList([]);
    setVariasi({
      id: crypto.randomUUID(),
      warna: "",
      harga: "",
      stok: "",
      ukuran: "",
      gambar: "",
      terjual: 0,
    });

    router.push("/");
  };

  if (!ready) return <h1>Loading...</h1>;
  if (!user) return <h1>Anda belum login</h1>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{`Jual produk kamu ${user.username}`}</h1>

        {/* FORM PRODUK */}
        <div className="space-y-3 bg-blue-100 p-4 rounded-xl">
          <input
            placeholder="Nama produk"
            className="p-2 w-full border rounded"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />

          <div className="p-4 w-full max-w-xl">
            <label className="font-semibold text-lg">
              Pilih Kategori Produk
            </label>
            <select
              className="w-full p-3 mt-2 border rounded-lg"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            >
              <option value="">-- Pilih Kategori --</option>
              {Object.keys(kategoriList).map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>

            {form.kategori && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                <h2 className="font-bold text-xl">{form.kategori}</h2>
                <p className="mt-2 text-gray-700">
                  {kategoriList[form.kategori].deskripsi}
                </p>

                <h3 className="font-semibold mt-3">Contoh Produk:</h3>
                <ul className="list-disc ml-5 text-gray-800">
                  {kategoriList[form.kategori].contoh.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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

          <DragDropUploader
            onUpload={(file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                setVariasi((prev) => ({ ...prev, gambar: reader.result }));
              };
              reader.readAsDataURL(file);
            }}
          />

          {/* Preview gambar setelah upload */}
          {variasi.gambar && (
            // use native img tag for base64 to avoid Next/Image processing
            <Image
              src={variasi.gambar}
              alt="Preview"
              width={100}
              height={100}
              className="w-32 h-32 object-cover mt-2 rounded-lg border"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={tambahVariasi}
              className="bg-blue-700 text-white px-3 py-2 rounded"
            >
              + Tambah Variasi
            </button>

            <button
              onClick={() => {
                setVariasi({
                  id: crypto.randomUUID(),
                  warna: "",
                  harga: "",
                  stok: "",
                  ukuran: "",
                  gambar: "",
                  terjual: 0,
                });
              }}
              className="px-3 py-2 border rounded"
            >
              Reset Variasi
            </button>
          </div>
        </div>

        {/* LIST VARIASI */}
        {variasiList.length > 0 && (
          <div className="mt-3">
            <h3 className="font-bold">Variasi Ditambahkan:</h3>
            <ul className="list-disc ml-5">
              {variasiList.map((v) => (
                <li key={v.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    {v.warna} — Rp{v.harga.toLocaleString()} — stok {v.stok}
                  </div>
                  {v.gambar?.[0] && (
                    <Image
                      src={v.gambar[0]}
                      alt={v.warna}
                      width={100}
                      height={100}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <button
                    className="text-sm text-red-600"
                    onClick={() => hapusVariasi(v.id)}
                  >
                    Hapus
                  </button>
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
            setProdukList([]);
          }}
        >
          Hapus Semua Produk
        </button>

        {/* DAFTAR PRODUK */}
        <h2 className="text-xl font-bold mt-8">Produk Kamu</h2>

        <div className="mt-4 space-y-4">
          {produkList
            .filter((p) => p.ownerId === user.id)
            .map((p) => (
              <div key={p.id} className="p-4 border rounded-xl bg-white shadow">
                <h3 className="font-bold">{p.nama}</h3>
                <p className="text-sm text-gray-600">{p.kategori}</p>

                <div className="flex gap-2 mt-2 overflow-auto">
                  {p.produk?.map((v) => (
                    <div
                      key={v.id}
                      className="w-20 h-20 rounded overflow-hidden border"
                    >
                      {v.gambar?.[0] ? (
                        <Image
                          src={v.gambar[0]}
                          alt={v.warna}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-sm mt-2">{p.deskripsi}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
