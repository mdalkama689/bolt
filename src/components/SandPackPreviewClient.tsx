import {
  SandpackPreview,
  SandpackPreviewRef,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

function SandPackPreviewClient({ actionType }: { actionType: string }) {
  useEffect(() => {
    handleSandboxAction();
  }, [actionType]);
  const previewRef = useRef<SandpackPreviewRef>(null);

  const handleSandboxAction = async () => {
    try {
      if (!previewRef.current) return;
      const client = previewRef.current.getClient();
      if (client) {
        const result = await client.getCodeSandboxURL();

        if (actionType === "deploy") {
          if (result.sandboxId) {
            const url = `https://${result.sandboxId}.csb.app`;
            window.open(url, "_blank", "noopener,noreferrer");
          }
        } else if (actionType === "export") {
          if (result.editorUrl) {
            const url = result.editorUrl;
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = error?.message || "Somthing went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <SandpackPreview
      style={{
        height: "80vh",
      }}
      ref={previewRef}
      showNavigator={true}
    />
  );
}

export default SandPackPreviewClient;
