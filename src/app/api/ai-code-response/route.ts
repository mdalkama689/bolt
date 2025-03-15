import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/option";
import { codeChatSession } from "@/utils/gemini";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({
                success: false,
                message: 'unauthenticated, plaese login to response!'
            })
        }

const {prompt, roomId}: {prompt: string, roomId: string} = await req.json()
if(!prompt.trim() || !roomId){
    return NextResponse.json({
        success: false,
        message: "Please provide the prompt and roomId !" 
    })
}

const room = await prisma.chat.findFirst({
    where: {roomId}
})

if(!room){
    return NextResponse.json({
        success: false,
        message: "Room not found! !" 
    })

}


const response = await codeChatSession.sendMessage(prompt)
const result = response.response.text()

const paresedResult = JSON.parse(result)
console.log('result : ', paresedResult.files)

// add current code in db 
await prisma.chat.update({
    where: {
        id: room.id
    },
    data: {
        files: paresedResult.files,
        dependencies: paresedResult.dependencies
    }
})

return NextResponse.json({
    success: true,
    message: "get code response successfully!",
    result, 
    room
})
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Error while getting response from gemini for code"
        })
    }
}