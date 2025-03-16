"use client";

import { CHAT_GENERATE_PROMPT } from "@/utils/prompt";
import axios from "axios";
import { Loader2, SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { MessageContext } from "@/context/MessageContext";

function ChatView({ roomId }: { roomId: string }) {
  const { data } = useSession();

  const firstChar = data?.user.email?.charAt(0).toUpperCase();
  const router = useRouter();
  const [isGeneratingResponse, setIsGeneratingResponse] =
    useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const messageBottomRef = useRef<HTMLDivElement | null>(null);
  const [isPreviousChatLoading, setIsPreviousChatLoading] =
    useState<boolean>(true);

  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    toast.error("Error: messageContext is missing!");
    return null;
  }

  const { messages, setMessages } = messageContext;

  useEffect(() => {
    messageBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getRoomData = useCallback(async () => {
    try {
      setIsPreviousChatLoading(true);
      const response = await axios.post("/api/room", { roomId });

      if (response.data.success) {
        setMessages(response.data.room.message);
      } else {
        toast.info(response.data.message);
        router.push("/");
        return;
      }
    } catch (error: unknown) {
      const errroMessage =
        error?.response?.data?.message || "Something went wrong";

      toast.error(errroMessage);
    } finally {
      setIsPreviousChatLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    getRoomData();
  }, [getRoomData]);

  const handleSendMessage = useCallback(async () => {
    try {
      if (!prompt.trim()) {
        return toast.error("Please give the prompt!");
      }
      setIsGeneratingResponse(true);
      setPrompt("");
      const usermMsg = {
        role: "user",
        content: prompt,
      };

      setMessages((prev) => [...prev, usermMsg]);

      const combinedMessage = [...messages, usermMsg];

      const combinedPrompt =
        JSON.stringify(combinedMessage) + " " + CHAT_GENERATE_PROMPT;

      const response = await axios.post("/api/ai-chat-response", {
        prompt,
        roomId,
        combinedPrompt,
      });

      if (response.data.success) {
        const aiResponse = response.data.result
          ?.replaceAll("*", " ")
          ?.replaceAll("`", " ");
        const aiMessage = {
          role: "ai",
          content: aiResponse,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error: unknown) {
      const errroMessage =
        error?.response?.data?.message || "Something went wrong";

      toast.error(errroMessage);
    } finally {
      setIsGeneratingResponse(false);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black text-white w-full pt-10 ">
      {/* Chat Messages - Takes Remaining Space */}
      <div className="flex-1 flex flex-col overflow-y-auto mt-5 px-4 pb-2 gap-3 ">
        {isPreviousChatLoading && (
          <div className="flex items-center justify-center h-screen w-full">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {!isPreviousChatLoading &&
          (messages.length > 0 ? (
            messages.map((message, index) => {
              const item =
                typeof message === "string" ? JSON.parse(message) : message;

              return (
                <div
                  key={index}
                  className="flex items-center justify-start gap-4 bg-zinc-700 px-4 py-3 rounded-lg"
                >
                  {item.role === "user" && (
                    <span className="bg-black rounded-full h-9 w-9 flex items-center justify-center">
                      {firstChar}
                    </span>
                  )}
                  <p>{item.content}</p>
                </div>
              );
            })
          ) : (
            <div className="h-screen  flex items-center justify-center w-full">
              <p className="text-gray-500">Please start the conversation</p>
            </div>
          ))}
        {isGeneratingResponse && (
          <div className="flex items-center gap-3 mt-5">
            <Loader2
              className="w-5 h-5 animate-spin text-white"
              aria-label="Loading..."
            />
            <p>Generating response...</p>
          </div>
        )}

        <div ref={messageBottomRef}></div>
      </div>

      {/* Input Box - No absolute positioning */}
      <div className="w-full p-4 bg-black border-t border-gray-700">
        <div className="relative">
          <textarea
            placeholder="How can we help you?"
            className="w-full resize-none px-5 py-4 border border-gray-600 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          ></textarea>
          <Button
            className="absolute bottom-4 right-4 cursor-pointer bg-transparent hover:bg-transparent"
            onClick={handleSendMessage}
            disabled={isGeneratingResponse}
          >
            <SendHorizonal className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
