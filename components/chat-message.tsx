import { cn } from "@/lib/utils";
import React from "react";

type ChatMessageProps = {
  role: "user" | "bot";
  children: React.ReactNode;
};

function ChatMessage({ role, children }: ChatMessageProps) {
  const isUser = role === "user";

  const containerClasses = cn("flex", isUser ? "justify-end" : "justify-start");

  const bubbleClasses = cn(
    "px-4 py-2 rounded",
    isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800",
  );
  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>{children}</div>
    </div>
  );
}

export default ChatMessage;
