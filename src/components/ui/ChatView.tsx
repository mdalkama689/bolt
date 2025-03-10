"use client";
import { ApiResponse, Message } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "./input";
import { SendHorizonal } from "lucide-react";



function ChatView({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

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

  useEffect(() => {
    roomId && getAllChats();
  }, []);

  if (!messages) {
    return <div className="text-white">loading.............</div>;
  }

  console.log(messages);
  return (
    <div className="">
      <h1>You chat </h1>
    <div className="mt-7">
    {
      messages.length > 0 && messages.map((message) => (
       <div className="flex items-center justify-center gap-4 bg-zinc-700 ml-3 px-3 py-2 text-2xl font-normal rounded">
        {message.role === 'user' && (
          <span className="bg-black rounded-full h-9 w-9 flex items-center justify-center">A</span>
        )}
        <p>{message.content}</p>
       </div>
      ))
     }
    </div>

    <div className=" mt-6 absolute bottom-3 left-3">
          <textarea
            placeholder="How can we help you?"
            className="resize-none px-5 py-4 border border-gray-200 rounded "
            cols={70}
            rows={5}
          ></textarea>
          <div
            className="absolute bottom-3 right-3 cursor-pointer"
     
          >
            <SendHorizonal />
          </div>
        </div>
    </div>
  );
}

export default ChatView;
