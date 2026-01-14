"use client";

import { use, useEffect, useState } from "react";
import ProdukDetail from "./ProdukDetailClient";

export default function ProdukIdPage({ params }) {
  const { id } = use(params);
  const [produkChose, setProdukChose] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProdukChose(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Guard clause to return early if id is not available
  if (!id) return <div>Loading...</div>;

  if (loading) return <div>Loading...</div>;
  if (!produkChose) return <div>Produk tidak ditemukan!</div>;

  return <ProdukDetail produkChose={produkChose} />;
}
