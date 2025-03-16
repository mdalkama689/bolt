import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "unauthenticated, plaese login to continue",
      });
    }

    const { roomId } = await params;
    console.log("get all title", roomId);
    if (!roomId) {
      return NextResponse.json({
        success: false,
        message: "Please provide room id",
      });
    }

    const roomData = await prisma.chat.findMany({
      where: { userId: Number(session.user.id) },
      select: {
        title: true,
        roomId: true,
      },
      orderBy: { creationTime: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "success!",
      roomData,
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
