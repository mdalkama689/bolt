import { chatSession } from "@/utils/ai-chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt }: { prompt: string } = await req.json();
console.log('prompt : ', prompt)
    if (!prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          messsage: "Please provide prompt",
        },
        { status: 400 }
      );
    }

    const response = await chatSession.sendMessage(prompt);
console.log(response.response.text())
const result = response.response.text()
    return NextResponse.json(
      {
        success: true,
        message: "success",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: "success",
      },
      { status: 200 }
    );
  }
}
