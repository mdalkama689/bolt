import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/option";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthenticated, please login to continue!",
        },
        { status: 400 }
      );
    }
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide prompt!",
        },
        { status: 400 }
      );
    }

    const userMessage = {
      content: prompt,
      role: "user",
    };

    const chat = await prisma.chat.create({
      data: {
        message: [userMessage],
        userId: Number(session.user.id),
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully!",
        data: {roomId: chat.id},
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error during generating response!",
      },
      { status: 400 }
    );
  }
}
