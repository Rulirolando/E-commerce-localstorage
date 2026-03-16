"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Image from "next/image";
import { IoBasket } from "react-icons/io5";
import Link from "next/link";
import { GoPerson } from "react-icons/go";
import { MdOutlinePhone } from "react-icons/md";

export default function DetailPage({ currentUser }) {
  const [activePesananMenu, setActivePesananMenu] = useState("semuapesanan");
  const [produkBeli, setProdukBeli] = useState([]);
  console.log("produkBeli", produkBeli);

  async function handleStatusChange(id, ket) {
    try {
      const response = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: ket }),
      });

      if (response.ok) {
        const produk = await fetch(`/api/order/produk/${currentUser.user.id}`);
        const data = await produk.json();
        setProdukBeli(data);

        alert(`Pesanan ${ket}!`);
      } else {
        alert("Gagal memperbarui status di server");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi");
    }
  }

  useEffect(() => {
    try {
      async function fetchData() {
        const response = await fetch(
          `/api/order/produk/${currentUser.user.id}`,
        );
        const data = await response.json();
        setProdukBeli(data);
      }
      fetchData();
    } catch {
      setProdukBeli([]);
    } finally {
    }
  }, [currentUser.user.id]);

  const FilterButton = ({ label, target }) => (
    <button
      onClick={() => setActivePesananMenu(target)}
      className={` ${
        activePesananMenu === target
          ? "bg-blue-900 text-blue-900 dark:bg-blue-700 dark:border-blue-700"
          : "bg-blue-950 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700  dark:hover:bg-slate-700"
      } cursor-pointer border p-1 px-2 rounded-lg  text-gray-200`}
    >
      {label}
    </button>
  );

  const FilteredProduk = ({ label, active, status, statusChange }) => {
    if (active === label && label === "semuapesanan") {
      return (
        <>
          {" "}
          <div className="w-full h-full  ">
            {produkBeli.map((produk, index) => (
              <div
                key={index}
                className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs dark:bg-slate-900 dark:border-slate-800 transition-colors"
              >
                <div className="flex w-full justify-between items-center">
                  <div className="w-1/2 flex flex-row dark:text-blue-400">
                    {" "}
                    <IoBasket size={30} />{" "}
                    <div className="flex flex-col ml-3 dark:text-white">
                      <h1>ID: {produk.produkId}</h1>
                      <p className="font-light text-sm opacity-80 dark:text-slate-400">
                        Tanggal:{" "}
                        {new Date(produk.createdAt).toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center">
                        {" "}
                        <GoPerson />
                        <p className="font-light text-sm ml-2">
                          {produk.namaPenerima}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <MdOutlinePhone />
                        <p className="font-light text-sm ml-2">
                          {" "}
                          {produk.telepon}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 dark:bg-blue-600 ">
                    {produk.status}
                  </p>
                </div>
                <hr className="mt-5 dark:border-slate-800 border-slate-300" />
                <div className="flex justify-between w-full mt-5 items-center">
                  <div className="flex items-center">
                    <Image
                      src={produk.gambar}
                      width={100}
                      height={100}
                      alt="foto barang"
                      className="object-cover w-30 h-30 rounded-md dark:bg-slate-800"
                    />
                    <div className="flex flex-col ml-3 dark:text-white">
                      <h1 className="font-normal text-sm">{produk.nama}</h1>
                      <div className="flex items-center space-x-3 ">
                        <p className="font-normal text-sm dark:text-blue-400">
                          Rp.{produk.harga.toLocaleString("id-ID")}
                        </p>
                        <p className="font-light text-light text-sm">
                          {produk.jumlah} x
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col text-slate-900 dark:text-white">
                    <h1>Total belanja</h1>
                    <p className="font-light text-sm">
                      Rp.
                      {(produk.jumlah * produk.harga).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else if (active === label) {
      return (
        <>
          {" "}
          <div className="w-full h-full  ">
            {produkBeli
              .filter((produk) => produk.status === status)
              .map((produk, index) => (
                <div
                  key={index}
                  className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs dark:bg-slate-900 dark:border-slate-800 transition-colors"
                >
                  <div className="flex w-full justify-between items-center">
                    <div className="w-1/2 flex flex-row text-slate-800 dark:text-blue-400">
                      {" "}
                      <IoBasket size={30} />{" "}
                      <div className="flex flex-col ml-3 text-slate-900 dark:text-white">
                        <h1>ID: {produk.produkId}</h1>
                        <p className="font-light text-sm dark:text-slate-400">
                          {new Date(produk.createdAt).toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center">
                          {" "}
                          <GoPerson />
                          <p className="font-light text-sm ml-2">
                            {produk.namaPenerima}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <MdOutlinePhone />
                          <p className="font-light text-sm ml-2">
                            {" "}
                            {produk.telepon}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 dark:bg-blue-600">
                      {produk.status}
                    </p>
                  </div>
                  <hr className="mt-5 border-slate-300 dark:border-slate-800" />
                  <div className="flex justify-between w-full mt-5 items-center">
                    <div className="flex items-center">
                      <Image
                        src={produk.gambar}
                        width={100}
                        height={100}
                        alt="foto barang"
                        className="object-cover w-30 h-30 rounded-md dark:bg-slate-800"
                      />
                      <div className="flex flex-col ml-3 text-slate-900 dark:text-white">
                        <h1 className="font-normal text-sm">{produk.nama}</h1>
                        <div className="flex items-center space-x-3 ">
                          <p className="font-normal text-sm dark:text-blue-400">
                            Rp.{produk.harga.toLocaleString("id-ID")}
                          </p>
                          <p className="font-light text-light text-sm">
                            {produk.jumlah} x
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col text-slate-900 dark:text-white">
                      <h1>Total belanja</h1>
                      <p className="font-light text-sm">
                        Rp.
                        {(produk.jumlah * produk.harga).toLocaleString("id-ID")}
                      </p>

                      {status === "Selesai" ? (
                        <div className="flex mt-7">
                          <button className="border-gray-100 bg-blue-500 rounded-lg p-2 dark:bg-blue-600">
                            <Link href={`/produk/${produk.produkId}`}>
                              {" "}
                              Lihat detail
                            </Link>
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      {status === "Selesai" ? (
                        ""
                      ) : (
                        <div className="flex mt-7">
                          <button
                            onClick={() =>
                              handleStatusChange(produk.id, statusChange)
                            }
                            className="border-gray-100 bg-blue-500 rounded-lg p-2 dark:bg-blue-600"
                          >
                            Ubah status
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="w-full bg-blue-100 px-15 min-h-screen dark:bg-slate-950 transition-colors">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Kelola pesanan
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Kelola semua pesanan masuk dari pelanggan
        </p>
        <div className="w-full flex flex-col">
          {" "}
          <div className="flex gap-3 mt-7">
            <FilterButton label="Semua" target="semuapesanan" />
            <FilterButton label="Belum Dibayar" target="belumdibayarpesanan" />
            <FilterButton label="Dikemas" target="dikemaspesanan" />
            <FilterButton label="Dikirim" target="dikirimpesanan" />
            <FilterButton label="Selesai" target="selesaipesanan" />
          </div>
          <FilteredProduk label="semuapesanan" active={activePesananMenu} />
          <FilteredProduk
            label="belumdibayarpesanan"
            active={activePesananMenu}
            status="Belum dibayar"
            statusChange="Dikemas"
          />
          <FilteredProduk
            label="dikemaspesanan"
            active={activePesananMenu}
            status="Dikemas"
            statusChange="Dikirim"
          />
          {/* Dikirim pesanan */}
          <FilteredProduk
            label="dikirimpesanan"
            active={activePesananMenu}
            status="Dikirim"
            statusChange="Selesai"
          />
          {/* Selesai Pesanan */}
          <FilteredProduk
            label="selesaipesanan"
            active={activePesananMenu}
            status="Selesai"
          />
        </div>
      </div>
    </>
  );
}
