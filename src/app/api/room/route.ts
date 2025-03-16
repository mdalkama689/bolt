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
        message: "unauthenticated, please login to continue",
      });
    }
    const { roomId }: { roomId: string } = await req.json();

    if (!roomId) {
      return NextResponse.json({
        success: false,
        message: "Please provide room id",
      });
    }

    const room = await prisma.chat.findFirst({
      where: {
        roomId,
      },
    });

    if (!room) {
      return NextResponse.json({
        success: false,
        message: "Room not found!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Room chat fetch successfully!",
      room,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error during fetching the room ";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
