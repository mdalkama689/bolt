import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/option";
import { chatSession } from "@/utils/gemini";
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

    interface IReqJson{
      prompt: string,
       roomId: string,
        combinedPrompt: string
    }
    const { prompt, roomId, combinedPrompt }: IReqJson = await req.json();

    if (!prompt.trim() || !roomId || !combinedPrompt) {
      return NextResponse.json({
        success: false,
        message: "Please provide the prompt and room id and combined prompt!",
      });
    }

    const room = await prisma.chat.findFirst({
        where: {
            roomId
        }
    })
 
if(!room){
    return NextResponse.json({
        success: false,
        message: "Room not found!"
    })
}

interface IMesssage {
  role: string,
  content: string 
}

const userMessage: IMesssage = {
    role: "user",
    content: prompt 
}

if(!room.title){
  await prisma.chat.update({
    where: {id: room.id},
    data: {
      title: prompt
    }
  })
}
 

await prisma.chat.update({
  where: {id: room.id},
  data: {
    message: {
      push: JSON.stringify(userMessage)
    }
  }
})


const response = await chatSession.sendMessage(combinedPrompt);
const result = response.response.text()

const aiMessage: IMesssage = {
    role: 'ai',
    content: result.replaceAll("*", " ").replaceAll("`", " ")
}


await prisma.chat.update({
  where: {id: room.id},
  data: {
    message: {
      push: JSON.stringify(aiMessage)
    }
  }
})

 
    return NextResponse.json({
      success: true,
      message: "Get chat response successfully from gemini!",
    result,
    room
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Error while fetching response from gemini!",
    });
  }
}
