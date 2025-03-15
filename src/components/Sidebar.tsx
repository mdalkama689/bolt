"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, MessageCircle, Twitter } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface IRoomData {
  title: string;
  roomId: string;
}

export function Sidebar({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<IRoomData[]>([]);

  const router = useRouter();

  const [isloading, setIsLoading] = useState<boolean>(false);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("New room is creating...");
    try {
      const roomId = v4();
      const response = await axios.post("/api/create-room", { roomId });

      if (response.data.success) {
        toast.success(response.data.message, { id: loadingToast });
        router.push(`/room/${roomId}`);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTitle();
  }, []);

  const getAllTitle = async () => {
    try {
      const response = await axios.get(`/api/get-all-title/${roomId}`);
      if (response.data.success) {
        setRoomData(response.data.roomData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleSignout = () => {
    signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-4">
        <SheetTitle className="text-2xl font-bold text-white tracking-wide">
          <span className="text-blue-500">B</span>olt
        </SheetTitle>

        <SheetDescription></SheetDescription>

        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleCreateRoom}
              disabled={isloading}
              className="flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle size={18} /> Start a new Chat
            </Button>

            <div className="">
              <p className=" text-center text-white py-2 bg-gray-800 rounded">
                Your Chat
              </p>
              <div className="my-2 max-h-[50vh]  overflow-y-auto  p-2 rounded-lg flex flex-col gap-1">
                {roomData ? (
                  roomData.map(
                    (item, ind) =>
                      item.title && (
                        <Link
                          href={`/room/${item.roomId}`}
                          key={ind}
                          className=" text-gray-300 text-lg font-normal p-2  transition duration-300  hover:bg-gray-800 hover:cursor-pointer hover:rounded"
                        >
                          {item.title.slice(0, 20)}
                        </Link>
                      )
                  )
                ) : (
                  <div className="text-center mt-20 text-gray-300">
                    No data is available
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 flex flex-col gap-2 p-4">
              <Link
                href="https://twitter.com/messages/compose?recipient_id=https://x.com/alkama_07"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex items-center gap-2 bg-gray-800 cursor-pointer text-gray-200 hover:bg-gray-700 border border-gray-600">
                  <Twitter size={18} /> Contact Us
                </Button>
              </Link>
              <Button
                onClick={handleSignout}
                className="flex cursor-pointer items-center gap-2 bg-red-600 text-white hover:bg-red-500 border border-red-500"
              >
                <LogOut size={18} /> Logout
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
