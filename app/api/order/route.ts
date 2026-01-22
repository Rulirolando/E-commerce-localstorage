import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, warna, ukuran, jumlah, gambar, variantId, buyerId } = body;

    // validasi
    if (
      !nama ||
      !warna ||
      !ukuran ||
      !jumlah ||
      !gambar ||
      !variantId ||
      !buyerId
    ) {
      return NextResponse.json(
        { message: "Data order tidak lengkap" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ ambil variasi produk
      const variation = await tx.variation.findUnique({
        where: { id: Number(variantId) },
      });

      if (!variation) {
        throw new Error("Variasi produk tidak ditemukan");
      }

      // 2️⃣ cek stok
      if (variation.stok < jumlah) {
        throw new Error("Stok tidak mencukupi");
      }

      // 3️⃣ buat order
      const order = await tx.order.create({
        data: {
          nama,
          warna,
          ukuran,
          stok: variation.stok,
          jumlah: Number(jumlah),
          harga: variation.harga,
          gambar,
          produkId: variation.id, // relasi ke Variation
          buyerId: Number(buyerId),
          totalHarga: variation.harga * Number(jumlah),
          status: "Belum dibayar",
        },
      });

      // 4️⃣ update stok & terjual
      await tx.variation.update({
        where: { id: variation.id },
        data: {
          stok: variation.stok - Number(jumlah),
          terjual: variation.terjual + Number(jumlah),
        },
      });

      return order;
    });

    return NextResponse.json({
      message: "Order berhasil dibuat",
      data: result,
    });
  } catch (error) {
    console.error("Order failed:", error);
    return NextResponse.json(
      { message: "Gagal membuat order" },
      { status: 500 },
    );
  }
}
