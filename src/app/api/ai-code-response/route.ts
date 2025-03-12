import { codeChatSession } from "@/utils/ai-chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {

    const {prompt }: {prompt: string} = await req.json()
    console.log('prompt : ', prompt)
    const response = await codeChatSession.sendMessage(prompt)
    const result = response.response.text() 
    console.log(result)
    return NextResponse.json(
      {
        success: true,
        message: "succeess",
        data: result 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Error during getting response from the gemini",
      },
      { status: 400 }
    );
  }
}
