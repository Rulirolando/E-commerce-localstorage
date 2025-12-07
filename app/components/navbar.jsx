"use client";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { SlBasket } from "react-icons/sl";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ className = "" }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target[0].value.trim();

    if (!query) {
      router.push("/products"); // kalau input kosong → tdk buat ?q=
      return;
    }

    router.push(`/products?q=${query}`); // pindah ke home + kirim query
  };

  return (
    <div
      className={`w-full h-20 bg-[#3C467B] flex justify-between items-center px-10 text-white ${className}`}
    >
      <h1
        className="text-4xl font-semibold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Rulshop
      </h1>

      {/* Search bar */}
      <form
        onSubmit={handleSubmit}
        className="w-1/2 flex justify-center items-center rounded-full hover:bg-[#636CCB] bg-[#50589C]"
      >
        <input
          type="text"
          placeholder="Cari produk..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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

      {user && <Link href="/sell">Sell</Link>}

      <div className="flex gap-6 text-sm">
        {user ? (
          <>
            <button
              onClick={() => {
                localStorage.removeItem("loginSession");
                window.location.reload();
              }}
              className="cursor-pointer text-red-300 hover:text-red-400"
            >
              Logout
            </button>
            <Link href={`/profile/${user.username}`}>
              {" "}
              <p>{user.username}</p>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="text-blue-200 hover:text-blue-300"
            >
              Login
            </Link>
            <Link
              href="/auth/daftar"
              className="text-blue-200 hover:text-blue-300"
            >
              Daftar
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
