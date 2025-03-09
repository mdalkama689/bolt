import signUpSchema from "@/types/signup-schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const safeParse = signUpSchema.safeParse(body)

    console.log(safeParse)
    if(!safeParse.success){
        console.log(safeParse.error.issues)
    }
        return NextResponse.json({
            success: true,
            message:'sucecss'
        }, {status: 200})

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Somthing went wrong during signup!"
        }, {status: 400})
    }
}