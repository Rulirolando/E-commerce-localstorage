"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/navbar";

export default function KeranjangPage() {
  const [keranjang, setKeranjang] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [mounted, setMounted] = useState(false);
  const [selectproduk, setSelectProduk] = useState([]);
  console.log("selectproduk", selectproduk);
  const [beli, setBeli] = useState([]);
  const [users, setUsers] = useState([]);
  console.log("users", users);
  console.log("beli", beli);
  console.log("keranjang", keranjang);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("keranjang") || "[]";
      const data = JSON.parse(raw);
      console.log(data);
      setKeranjang(Array.isArray(data) ? data : []);
    } catch {
      setKeranjang([]);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem("userDB"));
      setUsers(users);
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem("loginSessionDB"));
      setCurrentUser(session);
    } catch {
      setCurrentUser({});
    }
  }, []);

  useEffect(() => {
    try {
      const products = localStorage.getItem("produkDB") || "[]";
      const data = JSON.parse(products);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    try {
      const beli = JSON.parse(localStorage.getItem("beliDB"));
      setBeli(beli);
    } catch {
      setBeli([]);
    }
  }, []);

  const handleSelect = (item, checked) => {
    console.log("checked", checked);
    if (checked) {
      setSelectProduk((prev) => [...prev, item]);
      console.log("selectproduk", selectproduk);
    } else {
      setSelectProduk((prev) =>
        prev.filter(
          (p) =>
            !(
              p.id == item.id &&
              p.warna == item.warna &&
              p.ukuran == item.ukuran
            )
        )
      );
      console.log("selectprodukdihapus", selectproduk);
    }
  };

  function capitalizeFirst(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  if (!mounted) {
    // tampilkan skeleton / loading yang sama di server & client sehingga tidak ada mismatch
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🛒 Keranjang Belanja</h1>
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  // Fungsi hapus item
  const handleHapus = (index) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      const newKeranjang = keranjang.filter((_, i) => i !== index);
      setKeranjang(newKeranjang);
      localStorage.setItem("keranjang", JSON.stringify(newKeranjang));
    }
  };

  const allSelected =
    selectproduk.length === keranjang.length && keranjang.length > 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectProduk(keranjang);
    } else {
      setSelectProduk([]);
    }
  };

  function handleCheckout() {
    if (selectproduk.length === 0) {
      alert("Anda belum memilih produk.");
      return;
    }
    const produkBeli = selectproduk.map((produk) => ({
      ...produk,
      status: "Belum dibayar",
      buyerId: currentUser.id,
      date: new Date().toISOString(),
    }));
    const beliLama = JSON.parse(localStorage.getItem("beliDB")) || [];
    const confirmation = confirm("Apakah Anda yakin ingin membeli produk ini?");
    if (!confirmation) {
      return;
    }
    localStorage.setItem(
      "beliDB",
      JSON.stringify([...beliLama, ...produkBeli])
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🛒 Keranjang Belanja</h1>
        {keranjang.length === 0 ? (
          <p className="text-gray-600">Keranjang masih kosong.</p>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-7 gap-4 border p-4 rounded-lg font-semibold text-gray-800 bg-gray-100">
              <div className=" col-span-2">Produk</div>
              <div>Detail</div>
              <div className="text-center">Satuan</div>
              <div className="text-center">Jumlah</div>
              <div className="text-center">Total</div>
              <div className="text-center">Aksi</div>
            </div>

            {/* Isi Keranjang */}
            {keranjang.map((item, index) => (
              <div
                key={`${item.id}-${item.ukuran}-${index}`}
                className="grid grid-cols-7 gap-4 border p-4 rounded-lg items-center"
              >
                {/* Kolom 1: Produk */}
                <div className="flex items-center space-x-3 col-span-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={
                      selectproduk.filter(
                        (p) =>
                          p.id === item.id &&
                          p.warna === item.warna &&
                          p.ukuran === item.ukuran
                      ).length
                    }
                    onChange={(e) => handleSelect(item, e.target.checked)}
                  />
                  <Image
                    src={item.gambar}
                    alt={item.nama}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex justify-start w-[230px] h-16 overflow-hidden">
                    <p
                      className="text-sm font-semibold overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {capitalizeFirst(item.nama)}
                    </p>
                  </div>
                </div>

                {/* Kolom 2: Detail */}
                <div className="text-sm text-gray-500">
                  Warna: {item.warna} <br /> Ukuran: {item.ukuran}
                </div>

                {/* Kolom 3: Harga Satuan */}
                <div className="text-center">
                  Rp {item.harga.toLocaleString("id-ID")}
                </div>

                {/* Kolom 4: Jumlah */}
                <div className="text-center">{item.jumlah}</div>

                {/* Kolom 5: Total Harga */}
                <div className="text-center font-semibold">
                  Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                </div>

                {/* Kolom 6: Tombol Hapus */}
                <div className="text-center">
                  <button
                    onClick={() => handleHapus(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all"
                    aria-label={`Hapus ${item.nama}`}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {keranjang.length > 0 && (
          <div className="flex justify-between border p-4 rounded-lg font-semibold text-gray-800 bg-gray-100 h-20 mt-4 sticky bottom-2">
            <div className="flex gap-3 items-center">
              <input
                type="checkbox"
                name={keranjang.id}
                id={keranjang.id}
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <label htmlFor={keranjang.id}>Pilih Semua</label>
            </div>
            <div className="flex items-center gap-4">
              <p>Total belanja ({selectproduk.length})</p>
              <p className="ml-2">
                Rp{" "}
                {selectproduk
                  .reduce((total, item) => total + item.harga * item.jumlah, 0)
                  .toLocaleString("id-ID")}
              </p>
              <button
                onClick={handleCheckout}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-all"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
