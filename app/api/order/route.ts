import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        nama: body.nama,
        warna: body.warna,
        ukuran: body.ukuran,
        harga: body.harga,
        author: body.author,
        totalHarga: body.totalHarga,
        gambar: body.gambar,
        namaPenerima: body.namaPenerima,
        telepon: body.telepon,
        alamat: body.alamat,
        jumlah: body.jumlah,
        buyerId: body.buyerId,

        produkId: body.produkId || null,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("PRISMA ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: Number(id) },
        data: { status: status },
      });

      if (status === "Selesai" && updatedOrder.produkId) {
        await tx.variation.update({
          where: { id: updatedOrder.produkId },
          data: {
            stok: {
              decrement: updatedOrder.jumlah,
            },
          },
        });
      }

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal update status" },
      { status: 500 },
    );
  }
}
