"use client";

import React, { useState } from "react";
import {
  SandpackProvider,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import staterCode from "@/utils/boilerPlateCode";
function CodeView() {
  const [isActive, setIsActive] = useState("code");

  return (
    <div className="mt-6 ">
      <div className="flex items-center  px-1 py-2 justify-start gap-2 border bg-zinc-800  rounded-lg w-fit">
        <p
          onClick={() => setIsActive("code")}
          className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
            isActive === "code"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Code
        </p>
        <p
          onClick={() => setIsActive("preview")}
          className={`px-2 py-0.5  rounded-md cursor-pointer transition ${
            isActive === "preview"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Preview
        </p>
      </div>
      <SandpackProvider
        template="react"
        theme={"dark"}
        files={{
          ...staterCode.htmlFile,
          ...staterCode.indexCssFile,
          ...staterCode.postCssFile,
          ...staterCode.tailwindConfigFile,
        }}
      >
        <SandpackLayout className="h-[80vh] w-[80%] ">
          {isActive === "code" && (
            <div className="flex w-full ">
              <div className="w-[20%] ">
                <SandpackFileExplorer  />
              </div>
              <p className="h-screen w-1  bg-white"></p>
              <div className="w-[80%]">
                <SandpackCodeEditor  />
              </div>
            </div>
          )}
          {isActive === "preview" && <SandpackPreview showNavigator={true} />}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
