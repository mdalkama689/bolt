"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import signInSchema from "@/types/signin-schema";

function Signin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { handleSubmit, register } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (response?.error) {
        return toast.error(response.error);
      }
      if (response?.ok) {
        toast.success("signin successfully!");
        router.push("/");
      }
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =  error?.response?.data?.message || "Somthing went wrong during signin!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your details below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="text"
                  className="pl-10 py-2"
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 py-2"
                  placeholder="*******"
                  {...register("password")}
                  disabled={isLoading}
                />
              </div>
            </div>

            {!isLoading ? (
              <Button className="w-full cursor-pointer">Signup</Button>
            ) : (
              <Loader className="animate-spin w-full" />
            )}
          </CardContent>
        </form>

        <div className="flex justify-center gap-1 items-center">
          <div className="text-gray-700 text-sm">Don’t have an account?</div>
          <Link
            href="/signup"
            className="text-blue-500 hover:underline font-medium text-sm"
          >
            Signup
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Signin;
