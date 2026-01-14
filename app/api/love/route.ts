import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId } = body;
    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const lovedExited = await prisma.love.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    if (lovedExited) {
      await prisma.love.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return NextResponse.json({
        message: "Love dihapus",
        loves: false,
      });
    }
    await prisma.love.create({
      data: {
        userId,
        productId,
        status: true,
      },
    });
    return NextResponse.json({
      message: "Love ditambahkan",
      loves: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses suka", error },
      { status: 500 }
    );
  }
}
