import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user: string }> },
) {
  const { user } = await params;

  const orders = await prisma.order.findMany({
    where: { author: user },
    include: {
      produk: {
        include: {
          images: true,
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
