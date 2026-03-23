import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID diperlukan" },
        { status: 400 },
      );
    }

    const sekarang = new Date();
    const duaHariLalu = new Date(sekarang);
    duaHariLalu.setDate(sekarang.getDate() - 2);

    // 1. CEK: Apakah ada pesanan yang HARUSNYA SUDAH TIBA?
    const ordersHarusTiba = await prisma.order.findMany({
      where: {
        buyerId: userId,
        status: "Dikirim",
        estimasiTiba: { not: null, lte: sekarang.toISOString() },
      },
    });

    for (const order of ordersHarusTiba) {
      const notifExist = await prisma.notification.findFirst({
        where: { orderId: order.id, title: { contains: "Tiba" } },
      });

      if (!notifExist) {
        await prisma.notification.create({
          data: {
            userId: userId,
            orderId: order.id,
            title: "🔔 Pesanan Sudah Tiba?",
            message: `Menurut estimasi, paket ${order.nama} sudah sampai. Silakan konfirmasi jika sudah diterima.`,
          },
        });
      }
    }

    // 2. CEK: Apakah sudah LEWAT 2 HARI dari estimasi? (Auto-Selesai)
    const expiredOrders = await prisma.order.findMany({
      where: {
        buyerId: userId,
        status: "Dikirim",
        estimasiTiba: { not: null, lte: duaHariLalu.toISOString() },
      },
    });

    for (const order of expiredOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "Selesai" },
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID diperlukan" },
        { status: 400 },
      );
    }

    await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ message: "Notifikasi diperbarui" });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui data" },
      { status: 500 },
    );
  }
}
