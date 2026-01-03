"use client";

import { useEffect, useState, use } from "react";
import CardProduk from "../../components/CardProduk";
import Image from "next/image";
import Navbar from "../../components/navbar";
import { MdAccountCircle } from "react-icons/md";
import { IoBasket } from "react-icons/io5";
import { TbBrandProducthunt } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { PiNewspaperThin } from "react-icons/pi";
import ProfileEditModal from "../../components/ProfileEditModal";
import { LiaUserLockSolid } from "react-icons/lia";
import AddAdressModal from "../../components/AddressAddModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditProdukModal from "../../components/EditProduk";

export default function ProfilePage({ params }) {
  const { id: username } = use(params);
  const [user, setUser] = useState({});
  const [produkList, setProdukList] = useState(null);
  console.log("produklist", produkList);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [activePesananMenu, setActivePesananMenu] = useState("semuapesanan");
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [mailEnabled, setMailEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [IsEditProfile, setIsEditProfile] = useState(false);
  const [isAddAddress, setIsAddAddress] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [produkBeli, setProdukBeli] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  console.log("isedit", isEdit);
  const [onEdit, setOnEdit] = useState({});
  const [myProduks, setMyProduks] = useState([]);
  console.log("produkBeli", produkBeli);
  const router = useRouter();

  const [addressList, setAddressList] = useState([]);
  console.log("adresslist", addressList);

  function toggleLove(produkId) {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk menyukai produk.");
      return;
    }
    const updateProdukList = produkList.map((produk) => {
      if (produkId !== produk.id) return produk;
      const isLoved = produk.loved.some((l) => l.userId === currentUser.id);
      return {
        ...produk,
        loved: isLoved
          ? produk.loved.filter((f) => f.userId !== currentUser.id)
          : [...produk.loved, { status: true, userId: currentUser.id }],
      };
    });
    setProdukList(updateProdukList);
    localStorage.setItem("produkDB", JSON.stringify(updateProdukList));
  }

  function handleSubmitAddress(e, id) {
    e.preventDefault();
    if (!editAddress) return;

    const updateAddressList = addressList.map((item) =>
      item.id === id ? editAddress : item
    );
    setAddressList(updateAddressList);
    localStorage.setItem("addressDB", JSON.stringify(updateAddressList));
    setIsEditAddress(null);
    setEditAddress(null);
  }

  function handleDeleteAddress(id) {
    const updateAddressList = addressList.filter((item) => item.id !== id);
    setAddressList(updateAddressList);
    localStorage.setItem("addressDB", JSON.stringify(updateAddressList));
  }
  function toggleStatusAddress(id) {
    const updateAddressList = addressList.map((item) => {
      if (item.userId !== currentUser.id) return item;

      if (item.id === id) {
        return { ...item, status: !item.status };
      }

      return { ...item, status: false };
    });
    setAddressList(updateAddressList);
    localStorage.setItem("addressDB", JSON.stringify(updateAddressList));
  }
  function handleHapusProduk(postId, produkId) {
    const confirm = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirm) return;
    const updateProdukList = produkList.map((produk) => {
      if (produk.id !== postId) return produk;
      return {
        ...produk,
        produk: produk.produk.filter((p) => p.id !== produkId),
      };
    });
    setProdukList(updateProdukList);
    localStorage.setItem("produkDB", JSON.stringify(updateProdukList));
  }

  useEffect(() => {
    try {
      const userAddress = JSON.parse(localStorage.getItem("addressDB")) || [];
      setAddressList(userAddress);
    } catch {
      setAddressList([]);
    }
  }, []);

  useEffect(() => {
    try {
      const allUsers = JSON.parse(localStorage.getItem("userDB")) || [];

      const found = allUsers.find((u) => u.username === username);
      if (found) setUser(found);
    } catch {
    } finally {
    }
  }, [username]);

  useEffect(() => {
    try {
      const allProduk = JSON.parse(localStorage.getItem("produkDB")) || [];
      if (allProduk) setProdukList(allProduk);
      //Produk Yang saya jual
      const myProduk = allProduk.filter((p) => p.ownerId === user.id);
      setMyProduks(myProduk);
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("loginSessionDB"));

      setCurrentUser(user);
      console.log("currentUser", user);
    } catch {
      setCurrentUser(false);
    } finally {
    }
  }, [user]);

  useEffect(() => {
    try {
      const allProduk = JSON.parse(localStorage.getItem("beliDB")) || [];
      if (allProduk) setProdukBeli(allProduk);
    } catch {
      setProdukBeli([]);
    } finally {
    }
  }, []);

  if (!user) return <div>User tidak ditemukan</div>;
  return (
    <>
      <Navbar />
      <div className="w-full bg-blue-100 flex gap-4 h-auto ">
        {/* Kiri */}
        <div className="sticky top-2 mb-4   w-[250px] bg-blue-200 border-gray-100 ml-32 mt-14 rounded-2xl p-4 h-screen">
          <div className="flex flex-col items-center">
            {" "}
            <Image
              id={user.id}
              src={user.foto || "/default-avatar.png"}
              alt="Profile"
              width={50}
              height={50}
              className="w-16 h-16 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{user.nama}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

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
            onClick={() => {
              setActiveMenu("keluar");
              const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
              if (!confirmLogout) return;
              localStorage.removeItem("loginSessionDB");
              router.push("/");
            }}
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
                <button
                  onClick={() => setIsEditProfile(true)}
                  className="font-semibold border border-blue-500 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg"
                >
                  Edit profile
                </button>
              </div>
              {IsEditProfile && (
                <ProfileEditModal
                  user={user}
                  setUser={setUser}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  onClose={() => setIsEditProfile(false)}
                />
              )}

              <div className="w-full mt-10">
                <div className="flex w-full flex-wrap justify-start space-y-11">
                  {" "}
                  <div className="flex flex-col w-1/2">
                    <span>Nama Lengkap</span>
                    <div className=" bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]">
                      {user.nama}
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <span>Email</span>
                    <div className=" bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]">
                      {user.email}
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <span>Nomor Telepon</span>
                    <div className=" bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]">
                      {user.telepon}
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <span>Tanggal Lahir</span>
                    <div className="div bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]">
                      {user.tanggalLahir}
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <span>Jenis Kelamin</span>
                    <div className="div bg-blue-100 border border-gray-300 rounded-md px-2 py-1 w-[90%]">
                      {user.gender}
                    </div>
                  </div>
                </div>
              </div>
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
                  <div className="w-full h-full  ">
                    {produkBeli
                      .filter((produk) => produk.buyerId === currentUser.id)
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
                                  Tanggal:{" "}
                                  {new Date(produk.date).toLocaleString()}
                                </p>
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
                                  "id-ID"
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

              {/* Belum dibayar pesanan */}
              {activePesananMenu === "belumdibayarpesanan" && (
                <>
                  {" "}
                  <div className="w-full h-full  ">
                    {produkBeli
                      .filter(
                        (produk) =>
                          produk.status === "Belum dibayar" &&
                          produk.buyerId === currentUser.id
                      )
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
                                  Tanggal: 12-12-2022
                                </p>
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
                                  "id-ID"
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
              {/* Dikemas pesanan */}
              {activePesananMenu === "dikemaspesanan" && (
                <>
                  {" "}
                  <div className="w-full h-full  ">
                    {produkBeli
                      .filter(
                        (produk) =>
                          produk.status === "Dikemas" &&
                          produk.buyerId === currentUser.id
                      )
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
                                  Tanggal: 12-12-2022
                                </p>
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
                                  "id-ID"
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
              {/* Dikirim pesanan */}
              {activePesananMenu === "dikirimpesanan" && (
                <>
                  {" "}
                  <div className="w-full h-full  ">
                    {produkBeli
                      .filter(
                        (produk) =>
                          produk.status === "Dikirim" &&
                          produk.buyerId === currentUser.id
                      )
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
                                  Tanggal: 12-12-2022
                                </p>
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
                                  "id-ID"
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
              {/* Selesai Pesanan */}
              {activePesananMenu === "selesaipesanan" && (
                <>
                  {" "}
                  <div className="w-full h-full  ">
                    {produkBeli
                      .filter(
                        (produk) =>
                          produk.status === "Selesai" &&
                          produk.buyerId === currentUser.id
                      )
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
                                  Tanggal: 12-12-2022
                                </p>
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
                                  "id-ID"
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
                {isEdit ? (
                  <EditProdukModal
                    produk={onEdit}
                    setMyProduks={setMyProduks}
                    onClose={() => setIsEdit(false)}
                  />
                ) : (
                  ""
                )}
                {myProduks.length > 0 ? (
                  myProduks.map((item) =>
                    item.produk.map((p) => (
                      <CardProduk
                        key={p.id}
                        nama={item.nama}
                        harga={p.harga}
                        gambar={p.gambar[0]}
                        terjual={item.terjual}
                        edit={true}
                        onEdit={() => {
                          setOnEdit({ postId: item.id, ...p });

                          setIsEdit(true);
                        }}
                        onHapus={() => {
                          handleHapusProduk(item.id, p.id);
                        }}
                        loveProduk={true}
                      />
                    ))
                  )
                ) : (
                  <>
                    <p>Belum ada produk</p>
                    <h1>Silahakan tambahkan produk anda</h1>
                  </>
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
                {produkList.filter((u) =>
                  u.loved.some((l) => l.userId === currentUser?.id)
                ).length > 0 ? (
                  produkList
                    .filter((u) =>
                      u.loved.some((l) => l.userId === currentUser?.id)
                    )
                    .map((produk) => (
                      <CardProduk
                        key={produk.id}
                        nama={produk.nama}
                        harga={
                          "Rp " +
                          produk.produk?.[0]?.harga.toLocaleString("id-ID")
                        }
                        gambar={produk.produk?.[0]?.gambar?.[0]}
                        terjual={produk.produk?.[0]?.terjual || 0}
                        edit={false}
                        isLoved={produk.loved.some(
                          (l) =>
                            l.userId === currentUser?.id && l.status === true
                        )}
                        onLove={() => toggleLove(produk.id)}
                        showLove={produk.ownerId === currentUser?.id}
                      />
                    ))
                ) : (
                  <p>Belum ada produk favorit</p>
                )}
              </div>
            </div>
          </>
        )}
        {activeMenu === "alamat" && (
          <>
            <div className="w-[800px] h-full bg-blue-200 border-gray-100 ml-2 mt-14 rounded-2xl p-4 shadow-2xl">
              <div className="flex justify-between mb-12 pt-2">
                <h1 className="text-2xl font-semibold">Alamat</h1>
                {currentUser.id && (
                  <button
                    onClick={() => setIsAddAddress(!isAddAddress)}
                    className="border border-blue-500 hover:bg-blue-300 hover:text-amber-950 hover:border-gray-100 p-2 rounded-lg cursor-pointer"
                  >
                    {isAddAddress ? "Batal" : "Tambahkan Alamat"}
                  </button>
                )}
              </div>

              {/* Tambah alamat Baru */}
              {isAddAddress && currentUser.id && (
                <AddAdressModal
                  currentUser={currentUser.id}
                  onClose={() => setIsAddAddress(!isAddAddress)}
                  onAddAddress={(newAddress) => {
                    const updated = [...addressList, newAddress];
                    setAddressList(updated);
                    localStorage.setItem("addressDB", JSON.stringify(updated));
                  }}
                />
              )}

              {[...addressList].filter((u) => u?.userId === currentUser?.id)
                .length > 0 ? (
                [...addressList]
                  .filter((u) => u?.userId === currentUser?.id)
                  .sort((a, b) => b.status - a.status)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col mt-3 w-full hover:border border-gray-400 shadow-lg rounded-md p-6 "
                    >
                      <form
                        onSubmit={(e) => handleSubmitAddress(e, item?.id)}
                        className=""
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col gap-2 w-full max-w-md">
                            {/* Input Nama & Status */}
                            <div className="flex space-x-3 items-center">
                              <input
                                type="text"
                                value={
                                  isEditAddress === item.id
                                    ? editAddress.nama
                                    : item.nama
                                }
                                className="font-bold text-lg border-b focus:outline-none focus:border-blue-500"
                                placeholder="Nama"
                                disabled={isEditAddress !== item.id}
                                onChange={(e) =>
                                  setEditAddress({
                                    ...editAddress,
                                    nama: e.target.value,
                                  })
                                }
                              />
                              <button
                                type="button"
                                onClick={() => toggleStatusAddress(item.id)}
                                className={`px-2 py-1 rounded text-xs cursor-pointer ${
                                  item.status
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                              >
                                {" "}
                                {item.status ? "Alamat Utama" : "Jadikan Utama"}
                              </button>
                            </div>

                            {/* Input Telepon */}
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={
                                isEditAddress === item.id
                                  ? editAddress.telepon
                                  : item.telepon
                              }
                              className="text-sm border-b focus:outline-none focus:border-blue-500 w-full"
                              placeholder="Nomor Telepon"
                              disabled={isEditAddress !== item.id}
                              onChange={(e) => {
                                const onlyNumber = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                setEditAddress({
                                  ...editAddress,
                                  telepon: onlyNumber,
                                });
                              }}
                            />

                            {/* Input Alamat */}
                            <textarea
                              value={
                                isEditAddress === item.id
                                  ? editAddress.alamat
                                  : item.alamat
                              }
                              className="text-sm border-b focus:outline-none focus:border-blue-500 w-full"
                              placeholder="Alamat Lengkap"
                              name="alamat"
                              disabled={isEditAddress !== item.id}
                              onChange={(e) =>
                                setEditAddress({
                                  ...editAddress,
                                  alamat: e.target.value,
                                })
                              }
                            />

                            {/* Input Lokasi */}
                            <input
                              type="text"
                              value={
                                isEditAddress === item.id
                                  ? editAddress.lokasi
                                  : item.lokasi
                              }
                              className="text-sm border-b focus:outline-none focus:border-blue-500 w-full"
                              placeholder="Koordinat/Lokasi"
                              name="lokasi"
                              disabled={isEditAddress !== item.id}
                              onChange={(e) =>
                                setEditAddress({
                                  ...editAddress,
                                  lokasi: e.target.value,
                                })
                              }
                            />
                          </div>
                          <button
                            type="submit"
                            className={`bg-blue-500 ${
                              isEditAddress !== item.id ? "hidden" : ""
                            } text-white hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition cursor-pointer`}
                          >
                            Ubah
                          </button>

                          {/* Tombol Aksi */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.id !== isEditAddress) {
                                  setIsEditAddress(item.id);
                                  setEditAddress(item);
                                } else {
                                  setIsEditAddress(null);
                                  setEditAddress(null);
                                }
                              }}
                              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                            >
                              {isEditAddress === item.id ? "Batal" : "Edit"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(item.id)}
                              className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  ))
              ) : (
                <p>Belum ada alamat</p>
              )}
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
