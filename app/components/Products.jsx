"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ShowProduk from "./produk";
import { useSearchParams } from "next/navigation";
import kategoriList from "../../public/assets/kategoriProduk";
import CardProduk from "./CardProduk";
export default function SearchProduk() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const kategoriURL = (searchParams.get("q") || "").toLowerCase().trim();
  const [kategori, setKategori] = useState(kategoriURL || "");
  const [warna, setWarna] = useState("");
  const [ukuran, setUkuran] = useState("");
  const [lokasi, setLokasi] = useState("");
  console.log("kategorilist", kategori);
  const [produkChosen, setProdukChosen] = useState("");
  const [produkList, setProdukList] = useState([]);
  console.log("produklist", produkList);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  async function toggleLove(produkId) {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk menyukai produk.");
      return;
    }
    try {
      const res = await fetch("/api/love", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          productId: produkId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return alert(love.message);
      }
      setProdukList((prev) =>
        prev.map((p) =>
          p.id === produkId
            ? {
                ...p,
                loves: data.loves
                  ? [...p.loves, { userId: currentUser.id, status: true }]
                  : p.loves.filter((l) => l.userId !== currentUser.id),
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error toggling love:", error);
      alert("Terjadi kesalahan saat menyukai produk. Silakan coba lagi.");
    }
  }
  const filteredProduk = produkList.filter((p) => {
    const allWarna = p.produk.map((item) => item.warna.toLowerCase());
    const allUkuran = p.produk.flatMap((item) =>
      item.ukuran.map((u) => u.toLowerCase())
    );

    const matchKategori =
      kategori === "" ||
      p.kategori.toLowerCase().includes(kategori.toLowerCase());

    const matchWarna = warna === "" || allWarna.includes(warna.toLowerCase());
    const matchUkuran =
      ukuran === "" || allUkuran.includes(ukuran.toLowerCase());

    const matchLokasi =
      lokasi === "" || p.lokasi.toLowerCase().includes(lokasi.toLowerCase());

    const keyword = (searchParams.get("q") || "").toLowerCase().trim();

    const matchCari =
      keyword === "" ||
      p.nama.toLowerCase().includes(keyword) ||
      p.deskripsi.toLowerCase().includes(keyword) ||
      p.kategori.toLowerCase().includes(keyword);

    return (
      matchKategori && matchWarna && matchUkuran && matchLokasi && matchCari
    );
  });

  // 🔥 Load data dari localStorage
  useEffect(() => {
    try {
      fetch("/api/products/search")
        .then((res) => res.json())
        .then((data) => {
          setProdukList(data);
        });
    } catch {
      setProdukList([]);
    } finally {
      setLoading(true);
    }
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loginSessionDB"));
    if (user) setCurrentUser(user);
  }, []);

  useEffect(() => {
    setKategori(""); // reset kategori saat search
  }, [searchParams]);

  if (!loading) return <p>Memuat...</p>;

  return (
    <>
      {/* Konten */}
      <div className="flex m-0 w-full gap-2 bg-[#F3F4F6]">
        <div className="p-2 space-y-2 w-full">
          {/* Filter Section */}
          <div className="flex flex-wrap gap-4">
            {/* Filter Warna */}
            <select
              className="border border-gray-300 rounded-xl px-3 py-2"
              value={warna}
              onChange={(e) => {
                setWarna(e.target.value);
              }}
            >
              <option value="">Semua Warna</option>
              <option value="hitam">Hitam</option>
              <option value="putih">Putih</option>
              <option value="merah">Merah</option>
              <option value="biru">Biru</option>
              <option value="coklat">Coklat</option>
            </select>

            {/* Filter Ukuran */}
            <select
              className="border border-gray-300 rounded-xl px-3 py-2"
              value={ukuran}
              onChange={(e) => {
                setUkuran(e.target.value);
              }}
            >
              <option value="">Semua Ukuran</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </select>

            {/* Filter Lokasi */}
            <select
              className="border border-gray-300 rounded-xl px-3 py-2"
              value={lokasi}
              onChange={(e) => {
                setLokasi(e.target.value);
              }}
            >
              <option value="">Semua Lokasi</option>
              <option value="jakarta">Jakarta</option>
              <option value="bandung">Bandung</option>
              <option value="surabaya">Surabaya</option>
              <option value="yogyakarta">Yogyakarta</option>
            </select>
            <select
              className="border border-gray-300 rounded-xl px-1 py-2 text-center"
              value={kategori}
              onChange={(e) => {
                setKategori(e.target.value);
              }}
            >
              <option value="">Semua Kategori</option>
              {Object.keys(kategoriList).map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Produk Tampil */}
          <div className="grid grid-cols-6 max-md:grid-cols-1 gap-1 w-full">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                produkChosen
                  ? "col-span-5 translate-x-0 opacity-100"
                  : "col-span-6 translate-x-0 opacity-100"
              } flex flex-wrap items-start justify-center h-full bg-blue-200 rounded-2xl`}
            >
              {produkList.length > 0 ? (
                filteredProduk.map((p) => (
                  <CardProduk
                    key={p.id}
                    onClick={() => setProdukChosen(p)}
                    nama={p.nama}
                    harga={"Rp " + p.produk?.[0]?.harga.toLocaleString("id-ID")}
                    gambar={p.produk?.[0]?.gambar?.[0]}
                    terjual={p.produk?.[0]?.terjual || 0}
                    edit={false}
                    isLoved={p.loves.some(
                      (l) => l.userId === currentUser?.id && l.status === true
                    )}
                    onLove={() => toggleLove(p.id)}
                    showLove={p.ownerId === currentUser?.id}
                  />
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
