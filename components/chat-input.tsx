"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChatStore } from "@/app/store/chat-store";

function ChatInput() {
  const [value, setValue] = useState("");
  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    addChatMessage(value, "user");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    });

    const data = await res.json();

    addChatMessage(data.message, "bot");

    setValue("");
  };
  return (
    <div className="w-full max-w-200 mx-auto">
      <form onSubmit={handleSubmit} className="p-4 flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <Button type="submit" variant={"outline"}>
          <Send />
          Send
        </Button>
      </form>
    </div>
  );
}

export default ChatInput;
