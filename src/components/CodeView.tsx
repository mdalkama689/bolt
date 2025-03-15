"use client";

import React, {  useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import { staterCode, tailwindCDN } from "@/utils/boilerPlateCode";
import { MessageContext } from "@/context/MessageContext";
import { toast } from "sonner";
import axios from "axios";
import { CODE_GENERATE_PROMPT } from "@/utils/prompt";
import { Button } from "./ui/button";
import { FileUp, Rocket } from "lucide-react";
import SandPackPreviewClient from "./SandPackPreviewClient";

function CodeView({ roomId }: { roomId: string }) {
  const [isActive, setIsActive] = useState<string>("code");
  const [files, setFiles] = useState(staterCode);
  const [dependencies, setDependencies] = useState({});
  const [actionType, setActionType] = useState<string>("");

  const messageContext = useContext(MessageContext);


  const  messages  = messageContext?.messages ?? [];

  useEffect(() => {
    const lastMessage = messages && messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "user") {
      getCodeResponse();
    }
  }, [messages]);

  useEffect(() => {
    getRoomData();
  }, []);

  const getRoomData = async () => {
    try {
      const response = await axios.post("/api/room", { roomId });
      if (response.data.success) {
        const responseFiles = response.data.room.files;
        const responseDependencies = response.data.room.dependencies;

        const combinedCode = { ...staterCode, ...responseFiles };
        setFiles(combinedCode);
        setDependencies(responseDependencies);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error?.response?.data?.message || "Something webt wrong!";
      toast.error(errorMessage);
    }
  };

  const getCodeResponse = async () => {
    const codeGenerationToastId = toast.loading("Generating code...");
    try {
      setIsActive("code");
      const PROMPT = JSON.stringify(messages) + " " + CODE_GENERATE_PROMPT;
      const response = await axios.post("/api/ai-code-response", {
        prompt: PROMPT,
        roomId,
      });

      if (response.data.success) {
        const parsedResponse = JSON.parse(response.data.result);
        const combinedCode = { ...staterCode, ...parsedResponse.files };
        setFiles(combinedCode);
        setDependencies(parsedResponse.dependencies);
        toast.success("Code generated successfully!", {
          id: codeGenerationToastId,
        });
      } else {
        toast.error(response.data.message, { id: codeGenerationToastId });
      }
    } catch (error: unknown) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { id: codeGenerationToastId });
    }
  };

  useEffect(() => {
    setIsActive("preview");
  }, [actionType]);

  if (!messageContext) {
   toast.error("Error: messageContext is missing!");
   return null
  }

  const handleAction = (type: string) => {
    setActionType(type);
  };

  return (
    <div className="mt-6 w-full">
      <div className="absolute right-3 top-2 flex gap-4 text-white">
        <Button
          onClick={() => handleAction("export")}
          className="bg-gray-700 hover:bg-gray-600 text-white transition duration-300 cursor-pointer"
        >
          <FileUp className="w-5 h-5 mr-2 text-white" /> Export
        </Button>
        <Button
          onClick={() => handleAction("deploy")}
          className="bg-blue-500 hover:bg-blue-400 text-white transition duration-300 cursor-pointer"
        >
          <Rocket className="w-5 h-5 mr-2 text-white" /> Deploy
        </Button>
      </div>
      <div className="flex items-center  px-1 py-2 mb-3 justify-start gap-2 border bg-zinc-800  rounded-lg w-fit">
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
        files={files}
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
            <SandPackPreviewClient actionType={actionType} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
