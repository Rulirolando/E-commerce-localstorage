"use client";

import { useEffect, useState, use } from "react";
import CardProduk from "../../components/CardProduk";
import ProfileEditModal from "../../components/ProfileEditModal";
import Image from "next/image";
import Navbar from "../../components/navbar";
import { MdAccountCircle } from "react-icons/md";
import { IoBasket } from "react-icons/io5";
import { TbBrandProducthunt } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { PiNewspaperThin } from "react-icons/pi";
import { LiaUserLockSolid } from "react-icons/lia";
export default function ProfilePage({ params }) {
  const { id: username } = use(params);
  const [user, setUser] = useState(null);
  const [produks, setProduks] = useState(null);
  console.log("produks", produks);
  console.log("user", user);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [activePesananMenu, setActivePesananMenu] = useState("semuapesanan");
  const [gender, setGender] = useState("");
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [mailEnabled, setMailEnabled] = useState(false);

  function toggleLove(produkId) {
    const update = produks.map((p) => {
      if (p.id === produkId) {
        return { ...p, loved: !p.loved };
      }
      return p;
    });
    console.log("update", update);
    setProduks(update);
    // Simpan ke localStorage
    localStorage.setItem("produkDB", JSON.stringify(update));
  }

  useEffect(() => {
    try {
      const allUsers = JSON.parse(localStorage.getItem("userDB")) || [];
      console.log("allUsers", allUsers);
      const found = allUsers.filter((u) => u.username === username);
      console.log("foundUser", found);
      if (found) setUser(found);
    } catch {
    } finally {
      setLoading(true);
    }
  }, [username]);

  useEffect(() => {
    try {
      const allProduk = JSON.parse(localStorage.getItem("produkDB")) || [];
      console.log("allProduk", allProduk);
      const found = allProduk.filter((u) => u.ownerId === user[0].id);
      console.log("foundProduk", found);
      if (found) setProduks(found);
    } catch {}
  }, [user]);

  if (!loading) return <div>Loading...</div>;
  if (!user) return <div>User tidak ditemukan</div>;
  return (
    <>
      <Navbar />
      <div className="w-full bg-blue-100 flex gap-4 h-auto ">
        {/* Kiri */}
        <div className="sticky top-2 mb-4   w-[250px] bg-blue-200 border-gray-100 ml-32 mt-14 rounded-2xl p-4 h-screen">
          {user.map((u) => (
            <div key={u.id} className="flex flex-col items-center">
              {" "}
              <Image
                id={u.id}
                src={u.foto}
                alt="Profile"
                width={50}
                height={50}
                className="w-16 h-16 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{u.username}</h2>
              <p className="text-gray-600">{u.email}</p>
            </div>
          ))}

          <button
            onClick={() => setActiveMenu("profile")}
            className={`flex items-center  mt-8 cursor-pointer ${
              activeMenu === "profile"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <MdAccountCircle size={30} />
            <p className="ml-4 font-bold text-amber-950">Profile</p>
          </button>
          <button
            onClick={() => setActiveMenu("pesanan")}
            className={`flex items-center  mt-2 cursor-pointer ${
              activeMenu === "pesanan"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <IoBasket size={30} />
            <p className="ml-4 font-bold text-amber-950">Pesanan saya</p>
          </button>
          <button
            onClick={() => setActiveMenu("produk")}
            className={`flex items-center  mt-2 cursor-pointer ${
              activeMenu === "produk"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <TbBrandProducthunt size={30} />
            <p className="ml-4 font-bold text-amber-950">Produk saya</p>
          </button>
          <button
            onClick={() => setActiveMenu("favorit")}
            className={`flex items-center  mt-2 cursor-pointer ${
              activeMenu === "favorit"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <FaHeart size={30} />
            <p className="ml-4 font-bold text-amber-950">Favorit</p>
          </button>
          <button
            onClick={() => setActiveMenu("alamat")}
            className={`flex items-center  mt-2 cursor-pointer ${
              activeMenu === "alamat"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <FaLocationDot size={30} />
            <p className="ml-4 font-bold text-amber-950">Alamat</p>
          </button>
          <button
            onClick={() => setActiveMenu("pengaturan")}
            className={`flex items-center  mt-2 cursor-pointer ${
              activeMenu === "pengaturan"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <IoIosSettings size={30} />
            <p className="ml-4 font-bold text-amber-950">Pengaturan</p>
          </button>
          <button
            onClick={() => setActiveMenu("keluar")}
            className={`flex items-center  mt-2 cursor-pointer ${
              activeMenu === "keluar"
                ? "bg-blue-300 text-amber-950 border-gray-100"
                : ""
            }  p-2 rounded-lg w-[90%] `}
          >
            {" "}
            <RiLogoutBoxRLine size={30} />
            <p className="ml-4 font-bold text-amber-950">Keluar</p>
          </button>
        </div>
        {/* Kanan */}

        {activeMenu === "profile" && (
          <>
            <div className="sticky top-2 w-[800px] h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-2xl">
              <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Profile saya</h1>
                <button className="font-semibold border border-blue-500 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg">
                  Edit profile
                </button>
              </div>
              <form action="" className="w-full mt-10">
                <div className="flex w-full flex-wrap justify-start space-y-11">
                  {" "}
                  <label htmlFor="nama" className="flex flex-col w-1/2">
                    <span>Nama Lengkap</span>
                    <input
                      type="text"
                      name="nama"
                      id="nama"
                      className="focus:outline-none bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]"
                    />
                  </label>
                  <label htmlFor="nama" className="flex flex-col w-1/2">
                    <span>Email</span>
                    <input
                      type="email"
                      name="nama"
                      id="nama"
                      className="focus:outline-none bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]"
                    />
                  </label>
                  <label htmlFor="nama" className="flex flex-col w-1/2">
                    <span>Nomor Telepon</span>
                    <input
                      type="tel"
                      name="nama"
                      id="nama"
                      className="focus:outline-none bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]"
                    />
                  </label>
                  <label htmlFor="nama" className="flex flex-col w-1/2">
                    <span>Tanggal Lahir</span>
                    <input
                      type="date"
                      name="nama"
                      id="nama"
                      className="focus:outline-none bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]"
                    />
                  </label>
                  <select
                    className="flex flex-col w-1/5 focus:outline-none rounded-md p-2 bg-blue-100 border"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Jenis Kelamin</option>
                    <option value="Pria">Laki-laki</option>
                    <option value="wanita">Perempuan</option>
                  </select>
                </div>
              </form>
            </div>
          </>
        )}

        {activeMenu === "pesanan" && (
          <>
            <div className="w-[800px] h-full mb-4 flex flex-col">
              <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-sm">
                <div className="w-full">
                  <h1 className="text-2xl font-semibold text-start">
                    Pesanan saya
                  </h1>
                  <div className="flex gap-3 mt-7">
                    <button
                      onClick={() => setActivePesananMenu("semuapesanan")}
                      className="cursor-pointer border p-1 px-2 rounded-lg bg-blue-950 text-gray-200"
                    >
                      Semua
                    </button>
                    <button
                      onClick={() =>
                        setActivePesananMenu("belumdibayarpesanan")
                      }
                      className="cursor-pointer border p-1 px-2 rounded-lg bg-blue-950 text-gray-200"
                    >
                      Belum dibayar
                    </button>
                    <button
                      onClick={() => setActivePesananMenu("dikemaspesanan")}
                      className="cursor-pointer border p-1 px-2 rounded-lg bg-blue-950 text-gray-200"
                    >
                      Dikemas
                    </button>
                    <button
                      onClick={() => setActivePesananMenu("dikirimpesanan")}
                      className="cursor-pointer border p-1 px-2 rounded-lg bg-blue-950 text-gray-200"
                    >
                      Dikirim
                    </button>
                    <button
                      onClick={() => setActivePesananMenu("selesaipesanan")}
                      className="cursor-pointer border p-1 px-2 rounded-lg bg-blue-950 text-gray-200"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              </div>
              {/* Semua pesanan */}
              {activePesananMenu === "semuapesanan" && (
                <>
                  {" "}
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400">
                          Selesai
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400">
                          Selesai
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400">
                          Selesai
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400">
                          Selesai
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400">
                          Belum dibayar
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Belum dibayar pesanan */}
              {activePesananMenu === "belumdibayarpesanan" && (
                <>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 w-27 text-center">
                          Belum dibayar
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Dikemas pesanan */}
              {activePesananMenu === "dikemaspesanan" && (
                <>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 w-27 text-center">
                          Dikemas
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Dikirim pesanan */}
              {activePesananMenu === "dikirimpesanan" && (
                <>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 w-27 text-center">
                          Dikirim
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Selesai Pesanan */}
              {activePesananMenu === "selesaipesanan" && (
                <>
                  <div className="w-full h-full bg-blue-200 border-gray-100 ml-2 mt-5 rounded-2xl p-4 shadow-2xs">
                    <div className="w-full mt-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-row">
                          {" "}
                          <IoBasket size={30} />{" "}
                          <div className="flex flex-col ml-3">
                            <h1>ID: sleioje2847729</h1>
                            <p className="font-light text-sm">
                              Tanggal: 12-12-2022
                            </p>
                          </div>
                        </div>

                        <p className="border-gray-100 rounded-lg px-2 text-[12px] text-light py-0.5 bg-blue-400 w-27 text-center">
                          Selesai
                        </p>
                      </div>
                      <hr className="mt-5" />
                      <div className="flex justify-between w-full mt-5 items-center">
                        <div className="flex items-center">
                          <Image
                            src="https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFqdSUyMHB1dGlofGVufDB8fDB8fHww"
                            width={100}
                            height={100}
                            alt="foto barang"
                            className="object-cover w-30 h-30 rounded-md"
                          />
                          <div className="flex flex-col ml-3">
                            <h1 className="font-normal text-sm">Baju Putih</h1>
                            <div className="flex items-center space-x-3 ">
                              <p className="font-normal text-sm">Rp. 100.000</p>
                              <p className="font-light text-light text-sm">
                                2 x
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1>Total belanja</h1>
                          <p className="font-light text-sm">Rp. 200.000</p>

                          <div className="flex mt-7">
                            <button className="border-gray-100 bg-blue-500 rounded-lg p-2">
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {activeMenu === "produk" && (
          <>
            <div className="w-[800px] h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-2xl">
              <div className="flex space-x-4 p-2">
                <Image
                  src={user.foto || "/no-image.png"}
                  width={100}
                  height={100}
                  alt="logo"
                  className="object-cover w-30 h-30 rounded-full"
                ></Image>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">Toko kelontong</h1>
                  <p className="font-light text-sm">{user.username}</p>
                  <p className="font-light text-sm">{user.email}</p>
                  <p className="font-light text-sm">{user.alamat}</p>
                  <p className="font-light text-sm">{user.no_hp}</p>
                  <p className="font-light text-sm text-yellow-300">★★★★★</p>
                </div>
              </div>
              <div className="font-bold text-xl p-2">Produk saya</div>
              <div className="flex flex-start flex-wrap w-full h-full">
                {/* Card Produk */}
                {produks.map((item) =>
                  item.produk.map((p) => (
                    <CardProduk
                      key={p.id}
                      nama={item.nama}
                      harga={p.harga}
                      gambar={p.gambar[0]}
                      terjual={item.terjual}
                      edit={true}
                      loveProduk={true}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
        {activeMenu === "favorit" && (
          <>
            {" "}
            <div className="w-[800px] h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-2xl">
              <div className="flex space-x-4 p-2">
                <h1 className="font-bold text-2xl">Favorit</h1>
              </div>

              <div className="flex flex-start flex-wrap w-full h-full">
                {/* Card Produk */}
                {produks
                  .filter((p) => p.loved === true)
                  .map((p) => (
                    <CardProduk
                      key={p.id}
                      nama={p.nama}
                      harga={
                        "Rp " + p.produk?.[0]?.harga.toLocaleString("id-ID")
                      }
                      gambar={p.produk?.[0]?.gambar?.[0]}
                      terjual={p.produk?.[0]?.terjual || 0}
                      edit={false}
                      isLoved={p.loved}
                      onLove={() => toggleLove(p.id)}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
        {activeMenu === "alamat" && (
          <>
            <div className="w-[800px] h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-2xl">
              <div className="flex justify-between mb-12 pt-2">
                <h1 className="text-2xl font-semibold">Alamat</h1>
                <button className="border border-blue-500 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg">
                  Tambah alamat
                </button>
              </div>
              <div className="flex flex-col mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 ">
                <div className="flex justify-between w-ful">
                  <div className="flex space-x-5 items-center">
                    {" "}
                    <h1>Rumah</h1>
                    <p className="text-xs border rounded-sm bg-blue-300 p-1">
                      Utama
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="border border-gray-100 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg">
                      Edit
                    </button>
                    <button className="border border-gray-100 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg">
                      Hapus
                    </button>
                  </div>
                </div>

                <p className="font-normal text-sm">08123456789</p>
                <p className="font-normal text-sm">
                  Jl. Raya No. 123, RT 05/RW 02
                </p>
                <p className="font-normal text-sm">
                  Palu, sulawesi tengah, indonesia
                </p>
              </div>
              <div className="flex flex-col mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 ">
                <div className="flex justify-between w-ful">
                  <div className="flex space-x-5 items-center">
                    {" "}
                    <h1>Rumah</h1>
                    <p className="hidden text-xs border rounded-sm bg-blue-300 p-1">
                      Utama
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="border border-gray-100 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg">
                      Edit
                    </button>
                    <button className="border border-gray-100 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg">
                      Hapus
                    </button>
                  </div>
                </div>

                <p className="font-normal text-sm">08123456789</p>
                <p className="font-normal text-sm">
                  Jl. Raya No. 123, RT 05/RW 02
                </p>
                <p className="font-normal text-sm">
                  Palu, sulawesi tengah, indonesia
                </p>
              </div>
            </div>
          </>
        )}
        {activeMenu === "pengaturan" && (
          <>
            <div className="w-[800px] h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-2xl">
              <div className="w-full">
                <h1
                  className="font-bold text-lg
                "
                >
                  Pengaturan Akun
                </h1>
                <p className="font-bold text-sm mt-7">Keamanan</p>
              </div>
              <button className="flex flex-row items-center space-x-3 mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 cursor-pointer">
                <CiLock />
                <div className="flex flex-col">
                  <h2>Ubah kata sandi</h2>
                  <p className="text-xs font-light">
                    Terakhir diubah bulan lalu
                  </p>
                </div>
              </button>
              <button className="flex flex-row items-center space-x-3 mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 cursor-pointer">
                <MdOutlineVerifiedUser />
                <div className="flex flex-col">
                  <h2>Verifikasi 2 langkah</h2>
                  <p className="text-xs font-light">
                    Tingkatkan keamanan akun anda
                  </p>
                </div>
              </button>
              <p className="font-bold text-sm mt-7">Notifikasi</p>
              <div className="flex  items-center justify-between mt-3 w-full  border-gray-400 shadow-lg rounded-md p-6 ">
                <div className="flex flex-row items-center space-x-3">
                  <IoIosNotificationsOutline />
                  <div className="flex flex-col">
                    <h2>Notifikasi</h2>
                    <p className="text-xs font-light">
                      Terima notifikasi pesanan & promo
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifEnabled(!notifEnabled)}
                  className={`
        relative flex h-6 w-12 cursor-pointer items-center rounded-full
        transition-colors duration-300
        ${notifEnabled ? "bg-blue-600" : "bg-gray-300"}
      `}
                >
                  <span
                    className={`
          absolute h-5 w-5 rounded-full bg-white shadow transform
          transition-transform duration-300
          ${notifEnabled ? "translate-x-6" : "translate-x-1"}
        `}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between  mt-3 w-full  border-gray-400 shadow-lg rounded-md p-6 ">
                <div className="flex flex-row items-center space-x-3">
                  {" "}
                  <MdOutlineMail />
                  <div className="flex flex-col">
                    <h2>Email Newsletter</h2>
                    <p className="text-xs font-light">
                      Dapatkan info promo terbaru
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMailEnabled(!mailEnabled)}
                  className={`
        relative flex h-6 w-12 cursor-pointer items-center rounded-full
        transition-colors duration-300
        ${mailEnabled ? "bg-blue-600" : "bg-gray-300"}
      `}
                >
                  <span
                    className={`
          absolute h-5 w-5 rounded-full bg-white shadow transform
          transition-transform duration-300
          ${mailEnabled ? "translate-x-6" : "translate-x-1"}
        `}
                  />
                </button>
              </div>
              <p className="font-bold text-sm mt-7">Lainnya</p>
              <button className="flex items-center space-x-3 mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 cursor-pointer ">
                <IoHelpCircleOutline />
                <h2>Bantuan & dukungan</h2>
              </button>
              <button className="flex items-center space-x-3 mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 cursor-pointer ">
                <PiNewspaperThin />
                <h2>Syarat & ketentuan</h2>
              </button>
              <button className="flex items-center space-x-3 mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 cursor-pointer ">
                <LiaUserLockSolid />
                <h2>Kebijakan Privasi</h2>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
