import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const redisKey = `ecom:search:${q.toLowerCase()}`;

    const cachedData = await redis.get(redisKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), {
        status: 200,
      });
    }

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
        variations: {
          include: {
            images: { select: { img: true } },
            sizes: {
              select: { size: true },
            },
          },
        },
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

    await redis.set(redisKey, JSON.stringify(products), "EX", 3600);

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
