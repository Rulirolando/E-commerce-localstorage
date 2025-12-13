"use client";
import { useSearchParams } from "next/navigation";
import SearchProduk from "../components/Products";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

export default function Products() {
  const searchParams = useSearchParams();
  const cari = searchParams.get("q") || "";

  return (
    <>
      <Navbar />
      <SearchProduk cari={cari} />
      <Footer />
    </>
  );
}
