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

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="w-full bg-blue-100 px-15">
        <h1 className="text-3xl font-semibold">Kelola pesanan</h1>
        <p>Kelola semua pesanan masuk dari pelanggan</p>
        <div className="w-full flex flex-col">
          {" "}
          <div className="flex gap-3 mt-7">
            <button
              onClick={() => setActivePesananMenu("semuapesanan")}
              className={` ${
                activePesananMenu === "semuapesanan"
                  ? "bg-blue-900 text-blue-900"
                  : "bg-blue-950"
              } cursor-pointer border p-1 px-2 rounded-lg  text-gray-200`}
            >
              Semua
            </button>
            <button
              onClick={() => setActivePesananMenu("belumdibayarpesanan")}
              className={`${
                activePesananMenu === "belumdibayarpesanan"
                  ? "bg-blue-900 text-blue-900"
                  : "bg-blue-950"
              } cursor-pointer border p-1 px-2 rounded-lg  text-gray-200`}
            >
              Belum dibayar
            </button>
            <button
              onClick={() => setActivePesananMenu("dikemaspesanan")}
              className={`${
                activePesananMenu === "dikemaspesanan"
                  ? "bg-blue-900 text-blue-900"
                  : "bg-blue-950"
              } cursor-pointer border p-1 px-2 rounded-lg  text-gray-200`}
            >
              Dikemas
            </button>
            <button
              onClick={() => setActivePesananMenu("dikirimpesanan")}
              className={`${
                activePesananMenu === "dikirimpesanan"
                  ? "bg-blue-900 text-blue-900"
                  : "bg-blue-950"
              } cursor-pointer border p-1 px-2 rounded-lg  text-gray-200`}
            >
              Dikirim
            </button>
            <button
              onClick={() => setActivePesananMenu("selesaipesanan")}
              className={`${
                activePesananMenu === "selesaipesanan"
                  ? "bg-blue-900 text-blue-900"
                  : "bg-blue-950"
              } cursor-pointer border p-1 px-2 rounded-lg  text-gray-200`}
            >
              Selesai
            </button>
          </div>
          {activePesananMenu === "semuapesanan" && (
            <>
              {" "}
              <div className="w-full h-full  ">
                {produkBeli.map((produk, index) => (
                  <div
                    key={index}
                    className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs"
                  >
                    <div className="flex w-full justify-between items-center">
                      <div className="w-1/2 flex flex-row">
                        {" "}
                        <IoBasket size={30} />{" "}
                        <div className="flex flex-col ml-3">
                          <h1>ID: {produk.produkId}</h1>
                          <p className="font-light text-sm">
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

                      <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 ">
                        {produk.status}
                      </p>
                    </div>
                    <hr className="mt-5" />
                    <div className="flex justify-between w-full mt-5 items-center">
                      <div className="flex items-center">
                        <Image
                          src={produk.gambar}
                          width={100}
                          height={100}
                          alt="foto barang"
                          className="object-cover w-30 h-30 rounded-md"
                        />
                        <div className="flex flex-col ml-3">
                          <h1 className="font-normal text-sm">{produk.nama}</h1>
                          <div className="flex items-center space-x-3 ">
                            <p className="font-normal text-sm">
                              Rp.{produk.harga.toLocaleString("id-ID")}
                            </p>
                            <p className="font-light text-light text-sm">
                              {produk.jumlah} x
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h1>Total belanja</h1>
                        <p className="font-light text-sm">
                          Rp.
                          {(produk.jumlah * produk.harga).toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* Belum dibayar pesanan */}
          {activePesananMenu === "belumdibayarpesanan" && (
            <>
              {" "}
              <div className="w-full h-full  ">
                {produkBeli
                  .filter((produk) => produk.status === "Belum dibayar")
                  .map((produk, index) => (
                    <div
                      key={index}
                      className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs"
                    >
                      <div className="flex w-full justify-between items-center">
                        <div className="w-1/2 flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: {produk.produkId}</h1>
                            <p className="font-light text-sm">
                              {new Date(produk.createdAt).toLocaleString(
                                "id-ID",
                              )}
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

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 ">
                          {produk.status}
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src={produk.gambar}
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">
                              {produk.nama}
                            </h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">
                                Rp.{produk.harga.toLocaleString("id-ID")}
                              </p>
                              <p className="font-light text-light text-sm">
                                {produk.jumlah} x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">
                            Rp.
                            {(produk.jumlah * produk.harga).toLocaleString(
                              "id-ID",
                            )}
                          </p>

                          <div className="flex mt-7">
                            <button
                              onClick={() =>
                                handleStatusChange(produk.id, "Dikemas")
                              }
                              className="border-gray-100 bg-blue-500 rounded-lg p-2"
                            >
                              Ubah status
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
          {/* Dikemas pesanan */}
          {activePesananMenu === "dikemaspesanan" && (
            <>
              {" "}
              <div className="w-full h-full  ">
                {produkBeli
                  .filter((produk) => produk.status === "Dikemas")
                  .map((produk, index) => (
                    <div
                      key={index}
                      className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs"
                    >
                      <div className="flex w-full justify-between items-center">
                        <div className="w-1/2 flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: {produk.produkId}</h1>
                            <p className="font-light text-sm">
                              {new Date(produk.createdAt).toLocaleString(
                                "id-ID",
                              )}
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

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 ">
                          {produk.status}
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src={produk.gambar}
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">
                              {produk.nama}
                            </h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">
                                Rp.{produk.harga.toLocaleString("id-ID")}
                              </p>
                              <p className="font-light text-light text-sm">
                                {produk.jumlah} x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">
                            Rp.
                            {(produk.jumlah * produk.harga).toLocaleString(
                              "id-ID",
                            )}
                          </p>

                          <div className="flex mt-7">
                            <button
                              onClick={() =>
                                handleStatusChange(produk.id, "Dikirim")
                              }
                              className="border-gray-100 bg-blue-500 rounded-lg p-2 cursor-pointer"
                            >
                              Ubah status
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
          {/* Dikirim pesanan */}
          {activePesananMenu === "dikirimpesanan" && (
            <>
              {" "}
              <div className="w-full h-full  ">
                {produkBeli
                  .filter((produk) => produk.status === "Dikirim")
                  .map((produk, index) => (
                    <div
                      key={index}
                      className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs"
                    >
                      <div className="flex w-full justify-between items-center">
                        <div className="w-1/2 flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: {produk.produkId}</h1>
                            <p className="font-light text-sm">
                              {new Date(produk.createdAt).toLocaleString(
                                "id-ID",
                              )}
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

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 ">
                          {produk.status}
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src={produk.gambar}
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">
                              {produk.nama}
                            </h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">
                                Rp.{produk.harga.toLocaleString("id-ID")}
                              </p>
                              <p className="font-light text-light text-sm">
                                {produk.jumlah} x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">
                            Rp.
                            {(produk.jumlah * produk.harga).toLocaleString(
                              "id-ID",
                            )}
                          </p>

                          <div className="flex mt-7">
                            <button
                              onClick={() =>
                                handleStatusChange(produk.id, "Selesai")
                              }
                              className="border-gray-100 bg-blue-500 rounded-lg p-2 cursor-pointer"
                            >
                              Ubah status
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
          {/* Selesai Pesanan */}
          {activePesananMenu === "selesaipesanan" && (
            <>
              {" "}
              <div className="w-full h-full  ">
                {produkBeli
                  .filter((produk) => produk.status === "Selesai")
                  .map((produk, index) => (
                    <div
                      key={index}
                      className="w-full  bg-blue-200 ml-2 mt-5 rounded-2xl p-4 shadow-2xs"
                    >
                      <div className="flex w-full justify-between items-center">
                        <div className="w-1/2 flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: {produk.produkId}</h1>
                            <p className="font-light text-sm">
                              {new Date(produk.createdAt).toLocaleString(
                                "id-ID",
                              )}
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

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 ">
                          {produk.status}
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src={produk.gambar}
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">
                              {produk.nama}
                            </h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">
                                Rp.{produk.harga.toLocaleString("id-ID")}
                              </p>
                              <p className="font-light text-light text-sm">
                                {produk.jumlah} x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">
                            Rp.
                            {(produk.jumlah * produk.harga).toLocaleString(
                              "id-ID",
                            )}
                          </p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              <Link href={`/produk/${produk.id}`}>
                                {" "}
                                Lihat detail
                              </Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
