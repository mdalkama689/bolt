'use client'
import React, { useState } from "react";
import { createContext } from "react";

interface IMessage {
  role: string;
  content: string;
}


interface IMessageContext {
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const MessageContext = createContext<IMessageContext | null>(null);

function MessageContextProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export { MessageContext, MessageContextProvider };
