"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, LockKeyhole, Mail, User } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import signUpSchema from "@/types/signup-schema";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/signup", data);
      console.log(response.data);
      if (response.data.success) {
        router.push("/signin");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response.data.message || "Somthing went wrong during signup!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onErrror = () => {
    if (errors.fullName) {
      return toast.error(errors.fullName.message);
    }

    if (errors.email) {
      return toast.error(errors.email.message);
    }

    if (errors.password) {
      return toast.error(errors.password.message);
    }
  };

  const handleGoogleSignin = () => {
    signIn("google", { callbackUrl: "/" });
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details below or sign up with Google.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit, onErrror)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  type="text"
                  className="pl-10 py-2"
                  {...register("fullName")}
                  disabled={isLoading}
                />
              </div>
            </div>

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
        <Button
          onClick={handleGoogleSignin}
          className="w-[90%]  m-auto flex items-center gap-2 cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
        >
          <FaGoogle className="h-5 w-5 " />
          Sign in with Google
        </Button>
        <div className="flex justify-center gap-1 items-center ">
          <div className="text-gray-700 text-sm">Already have an account?</div>

          <Link
            href="/signin"
            className="text-blue-500 hover:underline font-medium text-sm"
          >
            Signin
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Signup;
