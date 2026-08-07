import { cn } from "@/lib/utils";
import React from "react";
import ReactMarkdown from "react-markdown";
type ChatMessageProps = {
  role: "user" | "bot";
  children: React.ReactNode;
};

function ChatMessage({ role, children }: ChatMessageProps) {
  const isUser = role === "user";

  const containerClasses = cn("flex", isUser ? "justify-end" : "justify-start");

  const bubbleClasses = cn(
    "px-4 py-2 rounded-lg",
    isUser ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-800",
  );
  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        {isUser ? (
          children
        ) : (
            <div className="prose max-w-none">

                <ReactMarkdown>{children as string}</ReactMarkdown>
            </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
