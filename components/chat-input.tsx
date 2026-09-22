"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useChatStore } from "@/app/store/chat-store";

function ChatInput() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const updateChatMessage = useChatStore((state) => state.updateChatMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = value.trim();

    if (!text || isLoading) return;

    addChatMessage(text, "user");

    setValue("");
    setIsLoading(true);

    try {
      const { activeChatId, chats } = useChatStore.getState();
      const activeChat = chats.find((chat) => chat.id === activeChatId);

      if (!activeChat) {
        throw new Error("Active chat was not found");
      }

      const messages = activeChat.messages
        .filter((message) => message.content.trim().length > 0)
        .map((message) => ({
          role: message.role === "bot" ? "assistant" : "user",
          content: message.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      if (!res.body) {
        throw new Error("Response body is empty");
      }

      const botMessageId = addChatMessage("", "bot");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        fullText += chunk;

        updateChatMessage(botMessageId, fullText);
      }
    } catch (error) {
      console.error(error);

      addChatMessage(
        "Something went wrong while generating the response.",
        "bot",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-200 mx-auto">
      <form onSubmit={handleSubmit} className="p-4 flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border rounded"
        />

        <Button
          type="submit"
          variant="outline"
          disabled={isLoading || !value.trim()}
        >
          <Send />
          {isLoading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </div>
  );
}

export default ChatInput;
