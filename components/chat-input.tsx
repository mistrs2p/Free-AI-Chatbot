"use client";

import React, { useRef, useState } from "react";
import { Send, Square } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useChatStore } from "@/app/store/chat-store";

export type ChatRequestMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function streamChatResponse(
  messages: ChatRequestMessage[],
  onChunk: (content: string) => void,
  signal?: AbortSignal,
) {
  const res = await fetch("/api/chat", {
    signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    let message = "Failed to get AI response";

    try {
      const data = await res.json();
      if (typeof data?.error === "string") {
        message = data.error;
      }
    } catch {
      // Keep the fallback message when the response is not JSON.
    }

    throw new Error(message);
  }

  if (!res.body) {
    throw new Error("Response body is empty");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    fullText += decoder.decode(value, { stream: true });
    onChunk(fullText);
  }

  fullText += decoder.decode();
  if (fullText) {
    onChunk(fullText);
  }
}

function ChatInput() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const updateChatMessage = useChatStore((state) => state.updateChatMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = value.trim();

    if (!text || isLoading) return;

    addChatMessage(text, "user");

    setValue("");
    setIsLoading(true);

    let botMessageId: string | null = null;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const { activeChatId, chats } = useChatStore.getState();
      const activeChat = chats.find((chat) => chat.id === activeChatId);

      if (!activeChat) {
        throw new Error("Active chat was not found");
      }

      const messages: ChatRequestMessage[] = activeChat.messages
        .filter((message) => message.content.trim().length > 0)
        .map((message) => ({
          role: message.role === "bot" ? "assistant" : "user",
          content: message.content,
        }));

      botMessageId = addChatMessage("", "bot");

      await streamChatResponse(
        messages,
        (fullText) => {
          updateChatMessage(botMessageId!, fullText);
        },
        abortController.signal,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the response.";

      if (botMessageId) {
        updateChatMessage(botMessageId, message);
      } else {
        addChatMessage(message, "bot");
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
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

        {isLoading ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleStop}
          >
            <Square />
            Stop
          </Button>
        ) : (
          <Button
            type="submit"
            variant="outline"
            disabled={!value.trim()}
          >
            <Send />
            Send
          </Button>
        )}
      </form>
    </div>
  );
}

export default ChatInput;
