"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import {  staterCode, tailwindCDN } from "@/utils/boilerPlateCode";
import axios from "axios";
import { ApiResponse } from "@/utils/types";
import { useRouter } from "next/navigation";
import { MessageContext } from "@/context/MessageContext";
import { toast } from "sonner";
import { CODE_GENERATE_PROMPT } from "@/utils/prompt";

function CodeView() {
  const router = useRouter()
  const messageContext = useContext(MessageContext)

  if(!messageContext) {
    toast.error('Something went wrong!')
router.push('/')
return
  }
 const  {messages}  = messageContext
  const [isActive, setIsActive] = useState<string>("code");
  const [file, setFile] = useState(staterCode);
const [dependencies, setDependencies] = useState()

  useEffect(() => {
    const lastMessage = messages.length > 0 && messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "user") {
getCode()
    }
  }, [messages]);
;

  const getCode = async () => {
    try {
   toast.info('start')
      const PROMPT = JSON.stringify(messages) + " " + CODE_GENERATE_PROMPT
   
      const res = await axios.post<ApiResponse<string>>(
        "/api/ai-code-response",
        {
          prompt: PROMPT
        }
      );

      if (res.data.success && res.data.data) {
    const parsedResponse = JSON.parse(res.data.data)
        const mergedFile = { ...staterCode, ...parsedResponse.files }
        setFile(mergedFile);
        console.log(parsedResponse)
        setDependencies(parsedResponse.dependencies)
        toast.success('success')
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("done");
    }
  };
  return (
    <div className="mt-6 ">
      <div className="flex items-center  px-1 py-2 justify-start gap-2 border bg-zinc-800  rounded-lg w-fit">
        <p
          onClick={() => setIsActive("code")}
          className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
            isActive === "code"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Code
        </p>
        <p
          onClick={() => setIsActive("preview")}
          className={`px-2 py-0.5  rounded-md cursor-pointer transition ${
            isActive === "preview"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Preview
        </p>
      </div>
      <SandpackProvider
        template="react"
        theme={"dark"}
        files={file}
        customSetup={{
          dependencies: {
            ...dependencies,
          },
        }}
        options={{
          externalResources: [tailwindCDN],
        }}
      >
        <SandpackLayout>
          {isActive === "code" && (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          )}
          {isActive === "preview" && (
            <SandpackPreview showNavigator={true} style={{ height: "80vh" }} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
