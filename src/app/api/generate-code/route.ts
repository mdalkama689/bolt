import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { getSystemPrompt } from "@/utils/prompt";

export async function POST(req: NextRequest) {
  try {
    const apiKey = "AIzaSyBy_oCUjW1UtpZ146LxuGiacVr51JVi3Ic";

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    
    // const generationConfig = {
    //   temperature: 1,
    //   topP: 0.95,
    //   topK: 40,
    //   maxOutputTokens: 8192,
    //   responseMimeType: "text/plain",
    // };
    
    async function run() {
   const {prompt }= await req.json()
   const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ]
  });

  let result = await chat.sendMessage("Based on user prompt please return either node or react as a tech stack. if you not undestand please do no return  ");
console.log(result.response.text());
    }
    
    run();
    
    return NextResponse.json(
      {
        success: true,
        message: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "fail",
      },
      { status: 400 }
    );
  }
}


const prompt1 = "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos. \n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n"
const prompt2 = "Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n - .gitignore\n package-lock.json\n - .bolt/prompt"
const prompt3 ="create a to do"


// async function run() {
    //   const chatSession = model.startChat({
    //     generationConfig,
    //     history: [
    //         {role: "user", parts:[{text: prompt1}]},
    //         {role: "user", parts:[{text: prompt2}]},
    //         {role: 'user',parts:[{text: prompt3}]}
    //     ],
    //     systemInstruction: {role: 'sysytem', parts: [{text: getSystemPrompt()}]}
    //   });
    
     
  
    //   let result = await chatSession.sendMessageStream("Generate a response based on the above prompts.");
    //   for await (const chunk of result.stream) {
    //     const chunkText = chunk.text();
    //     process.stdout.write(chunkText);
    //   }