import CodeView from "@/components/CodeView";
import { Sidebar } from "@/components/Sidebar";
import ChatView from "@/components/ui/ChatView";
import { MessageContextProvider } from "@/context/MessageContext";
import { toast } from "sonner";

async function Room({ params }: { params: { roomId: string } }) {
  const param = await params;
  const roomId = param.roomId;

  if (!roomId) {
    return toast.error("Please provide room id!");
  }

  return (
    <MessageContextProvider>
      <div className="flex justify-start gap-4 w-full h-screen">
        <div className="absolute top-3 left-2">
          <Sidebar roomId={roomId} />
        </div>
        <div className="w-[25%] ">
          <ChatView roomId={roomId} />
        </div>
        <div className="w-[70%] ">
          <CodeView roomId={roomId} />
        </div>
      </div>
    </MessageContextProvider>
  );
}

export default Room;
