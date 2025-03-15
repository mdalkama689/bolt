"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import axios from "axios";
import { v4 } from "uuid";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function LandingPage() {
  const { status, data } = useSession();
  const firstChar = data?.user?.email?.charAt(0).toUpperCase();
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

  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <h1 className="font-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Bolt
        </h1>
        {status === "unauthenticated" ? (
          <Link
            href="/signin"
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer transition duration-300 hover:bg-blue-600"
          >
            Sign In
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleLogout}
              className="bg-white  text-black px-4 py-2 rounded-md cursor-pointer transition duration-300 hover:bg-gray-200"
            >
              Logout
            </Button>
            <p className="bg-gradient-to-r from-blue-500 to-purple-500 h-10 w-10 text-white text-xl cursor-pointer font-semibold flex items-center justify-center rounded-full">
              {firstChar}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center h-[calc(100vh-76px)] px-4 text-center">
        <div className="max-w-3xl">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Build Apps with AI
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto ">
            Prompt, run, edit and deploy full-stack web applications with the
            power of AI
          </p>

          {status === "authenticated" && (
            <Button
              size="lg"
              className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              disabled={isloading}
              onClick={handleCreateRoom}
            >
              <MessageSquarePlus className="mr-2 h-5 w-5" />
              Start New Chat
            </Button>
          )}

          <div className="mt-16 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Powered by advanced AI to build your next project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
