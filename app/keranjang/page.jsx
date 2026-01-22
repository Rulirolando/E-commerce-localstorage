"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/navbar";

export default function KeranjangPage() {
  const [keranjang, setKeranjang] = useState(null);
  console.log("keranjang", keranjang);
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectProduk, setSelectProduk] = useState([]);
  console.log("selectProduk", selectProduk);

  /* =====================
     Ambil session user
  ====================== */
  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem("loginSessionDB"));
      setCurrentUser(session);
    } catch {
      setCurrentUser(null);
    } finally {
    }
  }, []);

  /* =====================
     Fetch keranjang dari API
  ====================== */
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchCart = async () => {
      const res = await fetch(`/api/keranjang?userId=${currentUser.id}`);
      const data = await res.json();
      setKeranjang(data || {});
      setMounted(true);
    };

    fetchCart();
  }, [currentUser]);

  /* =====================
     Helper
  ====================== */
  const isSelected = (item) =>
    selectProduk.some(
      (p) =>
        p.id === item.id &&
        p.ukuran === item.ukuran &&
        p.variantId === item.variantId,
    );

  const handleSelect = (item, checked) => {
    if (checked) {
      setSelectProduk((prev) => [...prev, item]);
    } else {
      setSelectProduk((prev) =>
        prev.filter(
          (p) =>
            !(
              p.id === item.id &&
              p.ukuran === item.ukuran &&
              p.variantId === item.variantId
            ),
        ),
      );
    }
  };

  const handleSelectAll = (checked) => {
    setSelectProduk(checked ? keranjang.items : []);
  };

  /* =====================
     Hapus item
  ====================== */
  const handleHapus = async (id) => {
    if (!confirm("Yakin hapus item ini?")) return;

    await fetch(`/api/keranjang/${id}`, { method: "DELETE" });
    setKeranjang((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));

    setSelectProduk((prev) => prev.filter((item) => item.id !== id));
  };

  /* =====================
     Checkout
  ====================== */
  const handleCheckout = async () => {
    if (selectProduk.length === 0) {
      alert("Pilih produk terlebih dahulu");
      return;
    }

    const confirmCheckout = confirm("Yakin checkout produk ini?");
    if (!confirmCheckout) return;

    for (const item of selectProduk) {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: item.nama,
          warna: item.warna,
          ukuran: item.ukuran,
          jumlah: item.jumlah,
          gambar: item.gambar,
          variantId: item.variantId,
          buyerId: currentUser.id,
        }),
      });
    }

    alert("Checkout berhasil");
    setSelectProduk([]);
  };

  if (!mounted) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">🛒 Keranjang</h1>
        <p>Memuat...</p>
      </div>
    );
  }

  const totalHarga = selectProduk.reduce(
    (total, item) => total + item.variant.harga * item.jumlah,
    0,
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🛒 Keranjang Belanja</h1>

        {!keranjang || keranjang.items.length === 0 ? (
          <p>Keranjang kosong</p>
        ) : (
          <>
            {keranjang.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-7 gap-4 border p-4 mb-3 rounded-lg items-center"
              >
                <div className="col-span-2 flex gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected(item)}
                    onChange={(e) => handleSelect(item, e.target.checked)}
                  />
                  <Image
                    src={item.variant.images[0].img}
                    alt={item.variant.product.nama}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                  <p className="font-semibold">{item.variant.product.nama}</p>
                </div>

                <div>
                  Warna: {item.variant.warna}
                  <br />
                  Ukuran: {item.ukuran}
                </div>

                <div className="text-center">
                  Rp {item.variant.harga.toLocaleString("id-ID")}
                </div>

                <div className="text-center">{item.jumlah}</div>

                <div className="text-center font-bold">
                  Rp{" "}
                  {(item.variant.harga * item.jumlah).toLocaleString("id-ID")}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => handleHapus(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="flex justify-between items-center border p-4 rounded bg-gray-100 sticky bottom-2">
              <div>
                <input
                  type="checkbox"
                  checked={
                    selectProduk.length === keranjang.length &&
                    keranjang.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />{" "}
                Pilih Semua
              </div>

              <div className="flex gap-4 items-center">
                <p>Total ({selectProduk.length})</p>
                <p className="font-bold">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </p>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
