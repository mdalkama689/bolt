"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { Send, SendHorizonal, SendHorizonalIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiResponse, Message } from "@/utils/types";

function LandingPage() {
  const { status, data } = useSession();
  const firstChar = data?.user.email?.charAt(0).toUpperCase();
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");

  interface IRoomId {
    roomId: string;
  }
  const handlePrompt = async () => {
    try {
      if (!prompt.trim()) {
        return toast.error("Please provide the prompt!");
      }
      const response = await axios.post<ApiResponse<IRoomId>>(
        "/api/create-room",
        { prompt }
      );

      const roomId = response.data.data?.roomId;

      if (response.data.success) {
        router.push(`/room/${roomId}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || "Error while creating the room!";
      toast.error(errorMessage);
    }
  };
  return (
    <div>
      {/* navbar  */}
      <div className="flex items-center justify-between px-2 py-2">
        <h1 className="font-bold text-4xl ">Bolt </h1>
        {status === "unauthenticated" ? (
          <Button variant="default">Signin </Button>
        ) : (
          <p className="bg-white h-9 w-9 text-black text-xl cursor-pointer font-semibold flex items-center justify-center rounded-full">
            {firstChar}
          </p>
        )}
      </div>

      {/* build main */}

      <div className="flex items-center justify-center h-screen w-[100%] flex-col">
        <h1 className="font-bold text-4xl">What do you want to build?</h1>
        <p className="mt-2 font-normal text-gray-400 ">
          Prompt, run, edit and deploy the full stack web app
        </p>
        {/* input form  */}
        <div className=" mt-6 relative">
          <textarea
            placeholder="How can we help you?"
            className="resize-none px-5 py-4 border border-gray-200 rounded "
            cols={70}
            rows={5}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          ></textarea>
          <div
            className="absolute bottom-3 right-3 cursor-pointer"
            onClick={handlePrompt}
          >
            <SendHorizonal />
          </div>
        </div>
        {/* suggestion */}

        <div className="flex items-center gap-4 mt-4">
          <p className="border border-gray-300 text-center w-fit px-2 py-1 rounded-full hover:bg-zinc-900 transition duration-300 cursor-pointer">
            Built a to do app
          </p>
          <p className="border border-gray-300 text-center w-fit px-2 py-1 rounded-full hover:bg-zinc-900 transition duration-300 cursor-pointer">
            Built a to do app using db
          </p>
          <p className="border border-gray-300 text-center w-fit px-2 py-1 rounded-full hover:bg-zinc-900 transition duration-300 cursor-pointer">
            Built a to do with login{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
