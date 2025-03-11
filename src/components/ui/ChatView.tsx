"use client";
import { ApiResponse, Message } from "@/utils/types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Loader2Icon,
  LoaderCircleIcon,
  SendHorizonal,
} from "lucide-react";
import CHAT_PROMPT from "@/utils/prompt";
import { toast } from "sonner";

function ChatView({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    roomId && getAllChats();
  }, []);

  useEffect(() => {
    const lastMessage = messages.length > 0 && messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "user") {
      getAiResponse();
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendInput = () => {
    const msg = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const getAllChats = async () => {
    try {
      const response = await axios.post<ApiResponse<Message[]>>(
        `/api/chat/${roomId}`
      );
      console.log(response.data.data);
      setMessages(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAiResponse = async () => {
    try {
      setIsLoading(true);
      const PROMPT = JSON.stringify(messages) + CHAT_PROMPT;
      const response = await axios.post<ApiResponse<string>>(
        "/api/ai-response",
        { prompt: PROMPT }
      );
      const msg = {
        role: "ai",
        content: response.data.data || "",
      };

      setMessages((prev) => [...prev, msg]);
      if (response.data.success) {
        setInput("");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response.data.message || "Error during fetching response";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <h1 className="text-2xl font-semibold p-4 border-b border-gray-700">
        Your Chat
      </h1>

      <div className="flex flex-col overflow-y-auto px-4 pb-2 gap-3 h-[70vh]">
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index}
              className="flex items-center justify-start gap-4 bg-zinc-700 px-4 py-3 rounded-lg"
            >
              {message.role === "user" && (
                <span className="bg-black rounded-full h-9 w-9 flex items-center justify-center">
                  A
                </span>
              )}
              <p>{message.content}</p>
            </div>
          ))}

        {isLoading && (
          <div className="flex items-center gap-3 mt-5">
            <Loader2
              className="w-5 h-5 animate-spin text-white"
              aria-label="Loading..."
            />
            <p>Generating response...</p>
          </div>
        )}

        <div ref={messageEndRef} className="pb-10"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-700">
        <div className="relative">
          <textarea
            placeholder="How can we help you?"
            className="w-full resize-none px-5 py-4 border border-gray-600 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          ></textarea>
          <div
            className="absolute bottom-4 right-4 cursor-pointer"
            onClick={sendInput}
          >
            <SendHorizonal className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
