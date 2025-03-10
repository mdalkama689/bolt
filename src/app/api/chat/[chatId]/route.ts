import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "unauthenticated, please login to continue!",
      });
    }
    const { chatId } = await params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(chatId),
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "success",
        data: chat?.message,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "eroro",
      },
      { status: 400 }
    );
  }
}
