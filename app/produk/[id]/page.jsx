"use client";

import { use, useEffect, useState } from "react";
import ProdukDetail from "./ProdukDetailClient";

export default function ProdukIdPage({ params }) {
  const { id } = use(params);

  const [produkChose, setProdukChose] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("produkDB");
      const list = JSON.parse(data);
      // id adalah UUID → sudah string
      const found = list.find((p) => p.id === id);

      setProdukChose(found);
    } catch {
      setProdukChose(null);
    } finally {
      setLoading(true);
    }
  }, [id]);

  if (!loading) return <div>Loading...</div>;

  if (!produkChose) return <div>Produk tidak ditemukan!</div>;

  return <ProdukDetail produkChose={produkChose} />;
}
