import CodeView from "@/components/CodeView";
import ChatView from "@/components/ui/ChatView";
import { MessageContextProvider } from "@/context/MessageContext";
import React from "react";

async function Room({ params }: { params: { roomId: string } }) {
  const param = await params;
  const roomId = param.roomId;
  return (
    <MessageContextProvider>
      <div className="flex justify-start gap-12">
        <div className="w-1/5">
          <ChatView roomId={roomId} />
        </div>
        <div className="w-4/5">
          <CodeView />
        </div>
      </div>
    </MessageContextProvider>
  );
}

export default Room;
