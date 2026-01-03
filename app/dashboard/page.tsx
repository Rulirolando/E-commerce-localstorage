"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SimpanProduk() {
  const [namaProduk, setNamaProduk] = useState("");
  const [loading, setLoading] = useState(false);
  const simpan = () => {
    const produkList = localStorage.getItem("nama");

    const dataBaru = {
      id: uuidv4(),
      nama: namaProduk,
    };

    const update = produkList
      ? [...JSON.parse(produkList), dataBaru]
      : [dataBaru];

    localStorage.setItem("nama", JSON.stringify(update));

    setNamaProduk(""); // reset input
  };

  // Ambil data saat halaman pertama dibuka
  useEffect(() => {
    try {
      const data = localStorage.getItem("nama");
      console.log(data);
    } catch {
      setNamaProduk("");
    } finally {
      setLoading(true);
    }
  }, []);

  if (!loading) return <p>Loading...</p>;
  return (
    <div>
      <h2>Tambah Produk</h2>

      <input
        value={namaProduk}
        onChange={(e) => setNamaProduk(e.target.value)}
        placeholder="Nama produk..."
      />

      <button onClick={simpan}>Simpan</button>
      <button
        onClick={() => {
          localStorage.removeItem("nama");
          setNamaProduk(""); // supaya UI langsung kosong
        }}
      >
        Hapus Semua Produk
      </button>
    </div>
  );
}
