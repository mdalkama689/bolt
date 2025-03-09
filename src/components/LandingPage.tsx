import React from "react";
import { Button } from "./ui/button";

function LandingPage() {
  return (
    <div>
      {/* navbar  */}
      <div className="flex items-center justify-between px-2 py-2">
        <h1 className="font-bold text-4xl ">Bolt </h1>
        <Button variant="default">Signin </Button>
      </div>

      {/* build main */}

      <div className="flex items-center justify-center h-screen w-[100%] flex-col">
        <h1 className="font-bold text-4xl">What do you want to build?</h1>
        <p className="mt-2 font-normal text-gray-400 ">
          Prompt, run, edit and deploy the full stack web app
        </p>
        {/* input form  */}
        <div className=" mt-6">
          <textarea
            placeholder="How can we help you?"
            className="resize-none px-5 py-4 border border-gray-200 rounded "
            cols={70}
            rows={5}
          ></textarea>
        </div>
        {/* suggestion */}

        <div className="flex items-center gap-4 mt-4">
          <p className="border border-gray-300 text-center w-fit px-2 py-1 rounded-full hover:bg-zinc-900 transition duration-300 cursor-pointer">
            Built a to do app
          </p>
          <p className="border border-gray-300 text-center w-fit px-2 py-1 rounded-full hover:bg-zinc-900 transition duration-300 cursor-pointer">
            Built a to do app using db
          </p>
          <p className="border border-gray-300 text-center w-fit px-2 py-1 rounded-full hover:bg-zinc-900 transition duration-300 cursor-pointer">
            Built a to do with login{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
