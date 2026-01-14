import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const products = await prisma.product.findMany({
      where: {
        OR: q
          ? [
              { nama: { contains: q, mode: "insensitive" } },
              { kategori: { contains: q, mode: "insensitive" } },
              { deskripsi: { contains: q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        produk: true,
        loves: true,
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
