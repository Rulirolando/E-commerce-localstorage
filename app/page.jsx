"use client";

import { useEffect, useState } from "react";
import SearchProduk from "./components/Products";
import Navbar from "./components/navbar";
export default function Home() {
  const [queryInput, setQueryInput] = useState(""); // input yang diketik
  const [cari, setCari] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const loginSession = localStorage.getItem("loginSession");
      if (loginSession) setUser(JSON.parse(loginSession));
    } catch {
    } finally {
      setLoading(true);
    }
  }, []);
  useEffect(() => {
    console.log("usersession:", user);
  }, [user]);

  if (!loading) return <div>Loading...</div>;

  if (!user)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-2xl font-semibold">
          Silahkan login terlebih dahulu
        </div>
      </>
    );

  const handleSearchClick = (e) => {
    e.preventDefault(); // supaya form tidak reload
    setCari(queryInput); // jalankan pencarian sesuai teks input
  };

  return (
    <>
      {/* Header */}
      <Navbar
        setQueryInput={setQueryInput}
        handleSearchClick={handleSearchClick}
        queryInput={queryInput}
      />
      {/* Produk Tampil dan produk yang dipilih*/}
      <div>
        <SearchProduk cari={cari} />
      </div>
    </>
  );
}
