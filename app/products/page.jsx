"use client";
import { useSearchParams } from "next/navigation";
import SearchProduk from "../components/Products";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";

export default function Products() {
  const searchParams = useSearchParams();
  const cari = searchParams.get("q") || "";
  const { data: session } = useSession();
  const currentUser = session;

  return (
    <>
      <Navbar currentUser={currentUser} />
      <SearchProduk cari={cari} />
      <Footer />
    </>
  );
}
