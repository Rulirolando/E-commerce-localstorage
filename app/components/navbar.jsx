"use client";
import Link from "next/link";
import { SlBasket } from "react-icons/sl";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";
import { IoMoon, IoSunny } from "react-icons/io5";
import useThemeStore from "../../store/useThemeStore";
import { useEffect } from "react";

export default function Navbar({ className = "", currentUser }) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  function capitalizeFirst(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <div
      className={`w-full h-20 bg-[#3C467B] flex justify-between items-center px-10 text-white ${className} dark:bg-slate-900 dark:text-white transition-colors duration-300`}
    >
      <h1
        className="text-4xl font-semibold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Rulshop
      </h1>

      {/* Search bar */}
      <SearchBar />

      {/* Theme toggle */}
      <button
        onClick={toggleDarkMode}
        className="text-2xl p-2 rounded-full hover:bg-slate-700 transition-colors duration-300"
      >
        {isDarkMode ? <IoSunny /> : <IoMoon />}
      </button>
      <Link href="/keranjang">
        <SlBasket />
      </Link>

      {currentUser && <Link href="/sell">Sell</Link>}

      <div className="flex gap-6 text-sm">
        {currentUser ? (
          <>
            <Link href={`/order/${currentUser.user.id}`}>Kelola pesanan</Link>
            <Link href={`/profile/${currentUser.user.id}`}>
              {" "}
              <p>{capitalizeFirst(currentUser.user.name)}</p>
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
