'use client'
import { Message } from "@/utils/types";
import React, { useState } from "react";
import { createContext } from "react";

interface IMessageContext {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageContext = createContext<IMessageContext | null>(null);

function MessageContextProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export { MessageContext, MessageContextProvider };
