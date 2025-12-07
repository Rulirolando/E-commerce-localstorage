"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function ShowProduk({ produkSelected }) {
  const [selectedImage, setSelectedImage] = useState("");
  const [mounted, setMounted] = useState(false);
  console.log("selectedimage", selectedImage);
  const allimg = produkSelected
    ? produkSelected.produk.flatMap((item) => item.gambar)
    : [];

  useEffect(() => {
    try {
      if (produkSelected && produkSelected.produk.length > 0) {
        setSelectedImage(produkSelected.produk[0].gambar[0]);
      }
    } catch {
      setSelectedImage("");
    } finally {
      setMounted(true);
    }
  }, [produkSelected]);

  if (!mounted) {
    // tampilkan skeleton / loading yang sama di server & client sehingga tidak ada mismatch
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🛒 Keranjang Belanja</h1>
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  const idImg =
    produkSelected && selectedImage
      ? produkSelected.produk.find((p) => p.gambar.includes(selectedImage))
      : null;

  console.log("idimg", idImg);
  console.log("allimg", allimg);

  console.log("produkSelected:", produkSelected);

  return (
    <div
      className={` max-md:hidden bg-blue-100 rounded-2xl p-4 transition-all duration-500 ease-in-out transform ${
        produkSelected
          ? "translate-x-0 opacity-100 col-span-1"
          : "translate-x-full opacity-0"
      } flex flex-col w-full h-screen overflow-auto items-center bg-blue-100 shadow-md sticky top-0`}
    >
      {produkSelected ? (
        <>
          <div className="relative aspect-4/3 w-full ">
            <Image
              src={selectedImage || produkSelected.produk[0].gambar[0]}
              alt={produkSelected.nama}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover rounded-2xl `}
            />
          </div>

          {/* gambar kecil yang dipilih */}
          <div className="flex justify-start gap-2 mt-2">
            {produkSelected.produk.map((p, index) => (
              <Image
                key={index}
                src={p.gambar[0]}
                alt={produkSelected.nama}
                width={50}
                height={50}
                onClick={() => setSelectedImage(p.gambar[0])}
                className={`object-cover rounded-2xl cursor-pointer w-16 h-16 border-2 ${
                  selectedImage === p.gambar[0] ? "border-blue-500" : ""
                }`}
              />
            ))}
          </div>

          {/*    Ukuran */}
          <div className="flex justify-start items-center w-full mt-4  flex-wrap">
            {" "}
            <span className="font-semibold text-sm mr-2">
              Ukuran:
              <span className="bg-blue-300 text-blue-900 px-3 mx-1 rounded-full text-sm font-medium ">
                {idImg
                  ? idImg.ukuran.join(" | ")
                  : produkSelected.produk[0].ukuran.join(" | ")}
              </span>{" "}
            </span>
          </div>
          {/*    Warna */}
          <div className="flex justify-start items-center w-full mt-4  flex-wrap">
            {" "}
            <span className="font-semibold text-sm mr-2">
              Warna:
              <span className="bg-blue-300 text-blue-900 px-3 mx-1 rounded-full text-sm font-medium ">
                {idImg ? idImg.warna : produkSelected.produk[0].warna}
              </span>{" "}
            </span>
          </div>

          {/*      Stok */}
          <div className="flex justify-start items-center w-full mt-4  flex-wrap">
            {" "}
            <span className="font-semibold text-sm mr-2">
              Stok:
              <span className="bg-blue-300 text-blue-900 px-3 mx-1 rounded-full text-sm font-medium ">
                {idImg ? idImg.stok : produkSelected.produk[0].stok}
              </span>{" "}
            </span>
          </div>

          <h2 className="text-lg font-semibold mt-2">{produkSelected.nama}</h2>
          <div className="flex justify-between w-full items-center mt-2 mb-4">
            {" "}
            <p className="text-blue-800 font-bold">
              Rp{" "}
              {idImg
                ? idImg.harga.toLocaleString("id-ID")
                : produkSelected.produk[0].harga.toLocaleString("id-ID")}
            </p>
            <button className="bg-blue-900 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer">
              <Link href={`/produk/${produkSelected.id}`}>Lihat detail</Link>
            </button>
          </div>

          <p className="mt-4 text-justify">
            {produkSelected.deskripsi} Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Corporis aliquam est consectetur corrupti
            perspiciatis voluptate eum quod tempore nam, amet nemo, omnis earum,
            soluta quaerat! Ad odit voluptate aperiam doloribus. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Vel cum commodi fugiat
            dolorum quidem, ab obcaecati esse dolor aperiam sint? Praesentium
            amet iste autem officia mollitia! Quos corporis beatae consequatur?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora
            ipsam voluptates non numquam provident sint sequi, perferendis vel
            ad nemo delectus iste, aperiam, enim porro! Iste eum voluptate
            cupiditate? Voluptatibus.
          </p>
        </>
      ) : (
        <p className="text-gray-500">Pilih produk untuk melihat detail</p>
      )}
    </div>
  );
}
