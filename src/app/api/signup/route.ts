import prisma from "@/lib/prisma";
import signUpSchema from "@/types/signup-schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const parseData = signUpSchema.safeParse(body);

    if (!parseData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect inputs!",
        },
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findFirst({
      where: {
        email: parseData.data.email,
      },
    });

    if (userExist) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists!",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parseData.data.password, 10);

   await prisma.user.create({
      data: {
        fullName: parseData.data.fullName,
        email: parseData.data.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Somthing went wrong during signup!",
      },
      { status: 400 }
    );
  }
}
