import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "unauthenticated, plaese login to continue",
      });
    }

    const { roomId }: { roomId: string } = await req.json();
    if (!roomId) {
      return NextResponse.json({
        success: false,
        message: "Please provide room id",
      });
    }

    await prisma.chat.create({
      data: {
        roomId,
        userId: Number(session.user.id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Room created successfully!",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
