import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
  try {
    const { items, totalHarga, customerDetails, buyerId } = await req.json();

    const transactionId = `TRX-${Date.now()}`;

    await prisma.order.createMany({
      data: items.map(
        (item: {
          name: string;
          warna: string;
          ukuran: string;
          price: number;
          quantity: number;
          gambar: string;
          variantId: number;
          author: string;
          transactionId: string;
        }) => ({
          nama: item.name,
          warna: item.warna,
          ukuran: item.ukuran,
          harga: item.price,
          jumlah: item.quantity,
          totalHarga: item.price * item.quantity,
          gambar: item.gambar,
          namaPenerima: customerDetails.namaPenerima,
          telepon: customerDetails.telepon,
          alamat: customerDetails.alamat,
          author: item.author,
          buyerId: buyerId,
          produkId: item.variantId,
          status: "Belum dibayar", // Default dari skema Anda
          transactionId: transactionId, // Simpan transactionId untuk referensi di webhook
        }),
      ),
    });

    // 3. Konfigurasi Parameter Midtrans
    const parameter = {
      transaction_details: {
        order_id: transactionId, // ID ini yang akan dikirim ke Webhook nanti
        gross_amount: totalHarga,
      },
      custom_field1: buyerId,
      item_details: items.map(
        (item: {
          variantId: number;
          price: number;
          quantity: number;
          name: string;
        }) => ({
          id: String(item.variantId),
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        }),
      ),
      customer_details: {
        first_name: customerDetails.namaPenerima,
        phone: customerDetails.telepon,
        billing_address: {
          address: customerDetails.alamat,
        },
      },
    };

    const transaction = await snap.createTransaction(parameter);
    console.log("Midtrans Transaction Response:", transaction);
    return NextResponse.json(
      {
        token: transaction.token,
        transactionId: transactionId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("PRISMA/MIDTRANS ERROR:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, estimasiTiba } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(id) },
        data: {
          status: status,
          ...(estimasiTiba && { estimasiTiba }), // Update estimasi jika ada
        },
      });

      // Kirim notifikasi ke pembeli jika status berubah jadi 'Dikirim'
      if (status === "Dikirim") {
        await prisma.notification.create({
          data: {
            userId: updatedOrder.buyerId,
            orderId: updatedOrder.id,
            title: "📦 Pesanan Sedang Dikirim",
            message: `Penjual telah mengirimkan ${updatedOrder.nama}. Cek secara berkala ya!`,
          },
        });
      }

      if (status === "Sudah dibayar" && updatedOrder.produkId) {
        await tx.variation.update({
          where: { id: updatedOrder.produkId },
          data: {
            stok: {
              decrement: updatedOrder.jumlah,
            },
          },
        });
      }
      if (status === "Selesai") {
        // 1. Cek apakah notifikasi selesai sudah pernah ada untuk order ini
        const existingNotif = await tx.notification.findFirst({
          where: {
            orderId: updatedOrder.id,
            title: { contains: "Selesai" },
          },
        });

        // 2. Hanya buat jika belum ada
        if (!existingNotif) {
          await tx.notification.create({
            data: {
              userId: updatedOrder.buyerId,
              orderId: updatedOrder.id,
              title: "✅ Pesanan Telah Selesai",
              message: `Terima kasih! Pesanan ${updatedOrder.nama} telah dinyatakan selesai. Selamat berbelanja kembali!`,
            },
          });
        }
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
