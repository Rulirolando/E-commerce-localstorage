import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      include: {
        products: {
          include: {
            variations: {
              include: {
                images: true,
                sizes: true,
              },
            },
          },
        },
        orders: {
          include: {
            produk: {
              include: { images: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        loves: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengambil data user" },
      { status: 500 },
    );
  }
}
