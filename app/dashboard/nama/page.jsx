"use client";
import { useState, useEffect } from "react";
export default function ListProduk() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("nama")) || [];
      setProduk(data);
    } catch {
      setProduk([]);
    } finally {
      setLoading(true);
    }
  }, []);

  if (!loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Daftar Produk</h2>

      {produk.length === 0 && <p>Belum ada produk.</p>}

      <ul>
        {produk.map((p) => (
          <li key={p.id}>{p.nama}</li>
        ))}
      </ul>
    </div>
  );
}
