"use client";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { SlBasket } from "react-icons/sl";

import { useState, useEffect } from "react";

export default function Navbar({
  setQueryInput,
  handleSearchClick,
  queryInput,
}) {
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
  if (!loading) return <div>Loading...</div>;
  return (
    <div className="w-full h-20 bg-[#3C467B] flex justify-between items-center px-10 text-white">
      <h1 className="text-4xl font-semibold">Rulshop</h1>

      {/* Search bar */}
      <form
        onSubmit={handleSearchClick}
        className="w-1/2 flex justify-center items-center rounded-full hover:bg-[#636CCB] bg-[#50589C]"
      >
        <input
          type="text"
          placeholder="Cari produk..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          className="w-full outline-none bg-transparent px-2 py-2 ml-2 placeholder:text-blue-100"
        />
        <button
          type="submit"
          className="p-2 text-2xl cursor-pointer rounded-full bg-blue-800 h-full hover:bg-blue-700"
        >
          <CiSearch />
        </button>
      </form>

      <Link href="/keranjang">
        <SlBasket />
      </Link>
      {user ? <Link href="/sell">Sell</Link> : ""}

      {/* Auth Buttons */}
      <div className="flex gap-6 text-sm">
        {user ? (
          <p>{user.username}</p>
        ) : (
          <>
            <button className="cursor-pointer text-blue-200 hover:text-blue-300">
              Masuk
            </button>
            <button className="cursor-pointer text-blue-200 hover:text-blue-300">
              <Link href="/auth/daftar">Daftar</Link>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
