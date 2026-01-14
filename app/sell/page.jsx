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
    nama: "",
    kategori: "",
    deskripsi: "",
    lokasi: "",
    comment: "",
  }));

  const [variasi, setVariasi] = useState(() => ({
    warna: "",
    harga: "",
    stok: "",
    ukuran: "",
    gambar: "",
  }));

  const [variasiList, setVariasiList] = useState([]);

  // Load products + session once
  useEffect(() => {
    try {
      fetch("/api/product")
        .then((res) => res.json())
        .then(setProdukList)
        .catch(console.error);

      const session = localStorage.getItem("loginSessionDB");
      if (session) setUser(JSON.parse(session));

      setReady(true);
    } catch {
    } finally {
    }
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
      warna: variasi.warna,
      harga: parseInt(variasi.harga, 10),
      stok: parseInt(variasi.stok, 10),
      ukuran: variasi.ukuran.split(",").map((u) => u.trim()),
      gambar: [variasi.gambar], // base64 or url
    };

    setVariasiList((prev) => [...prev, newVar]);

    setVariasi({
      warna: "",
      harga: "",
      stok: "",
      ukuran: "",
      gambar: "",
    });
  };

  const hapusVariasi = (id) => {
    setVariasiList((prev) => prev.filter((_, i) => i !== id));
  };

  const simpanProduk = async () => {
    if (!user) return alert("Anda harus login terlebih dahulu.");

    try {
      const newProduk = {
        nama: form.nama,
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        lokasi: form.lokasi,
        comment: form.comment,
        ownerId: Number(user.id),
        variasiList,
      };
      const res = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduk),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      alert("Produk berhasil disimpan");
      router.push("/");
    } catch {
      alert("Gagal koneksi ke server");
    }
  };

  if (!ready) return <h1>Loading...</h1>;
  if (!user) return <h1>Anda belum login</h1>;
  function capitalizeFirst(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{`Jual produk kamu ${capitalizeFirst(
          user.nama || user.username
        )}`}</h1>

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
                  warna: "",
                  harga: "",
                  stok: "",
                  ukuran: "",
                  gambar: "",
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
              {variasiList.map((v, index) => (
                <li key={index} className="flex items-center gap-3">
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
                    onClick={() => hapusVariasi(index)}
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
                  {p.variations?.map((v) => (
                    <div
                      key={v.id}
                      className="w-20 h-20 rounded overflow-hidden border"
                    >
                      {v.images?.[0]?.img ? (
                        <Image
                          src={v.images[0].img}
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
