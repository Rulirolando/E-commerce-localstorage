import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama,
      warna,
      ukuran,
      stok,
      jumlah,
      harga,
      gambar,
      produkId,
      buyerId,
    } = body;

    if (
      !warna ||
      !ukuran ||
      !stok ||
      !jumlah ||
      !harga ||
      !gambar ||
      !produkId ||
      !buyerId
    ) {
      return NextResponse.json(
        { message: "Data order tidak lengkap" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        warna,
        nama,
        ukuran,
        stok: Number(stok),
        jumlah: Number(jumlah),
        harga: Number(harga),
        gambar,
        produkId: Number(produkId),
        buyerId: Number(buyerId),
        totalHarga: Number(harga) * Number(jumlah),
        status: "Belum dibayar",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order create failed:", error); // lebih jelas
    return NextResponse.json(
      {
        message: "Gagal membuat order",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
