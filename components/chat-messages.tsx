"use client";

import { useChatStore } from "@/app/store/chat-store";
import ChatMessage from "./chat-message";
import { streamChatResponse, type ChatRequestMessage } from "./chat-input";
import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useScrollToLastUserMsg } from "@/hooks/use-scroll-to-last-user-msg";
import { Button } from "./ui/button";

function ChatMessages() {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(
    null,
  );

  const removeChatMessage = useChatStore((state) => state.removeChatMessage);
  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const updateChatMessage = useChatStore((state) => state.updateChatMessage);

  const { outerDivRef, msgsDivRef, lastUserMsgRef } =
    useScrollToLastUserMsg(activeChat);

  const lastUserMsgIndex = activeChat?.messages.findLastIndex(
    (msg) => msg.role === "user",
  );

  const handleRetry = async (messageId: string) => {
    if (!activeChat || retryingMessageId) return;

    const lastMessage = activeChat.messages.at(-1);
    if (!lastMessage || lastMessage.id !== messageId || lastMessage.role !== "bot") {
      return;
    }

    const contextMessages: ChatRequestMessage[] = activeChat.messages
      .slice(0, -1)
      .filter((message) => message.content.trim().length > 0)
      .map((message) => ({
        role: message.role === "bot" ? "assistant" : "user",
        content: message.content,
      }));

    if (contextMessages.length === 0) return;

    setRetryingMessageId(messageId);
    removeChatMessage(messageId);

    try {
      const botMessageId = addChatMessage("", "bot");

      await streamChatResponse(contextMessages, (fullText) => {
        updateChatMessage(botMessageId, fullText);
      });
    } catch (error) {
      console.error(error);

      addChatMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the response.",
        "bot",
      );
    } finally {
      setRetryingMessageId(null);
    }
  };

  if (!(activeChat && activeChat.messages.length > 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-normal text-3xl">What can I help with?</p>
      </div>
    );
  }

  return (
    <div ref={outerDivRef} className="flex flex-col flex-1 overflow-y-auto">
      <div
        ref={msgsDivRef}
        className="flex-1 p-4 space-y-4 h-full w-full max-w-200 mx-auto"
      >
        {activeChat.messages.map((message, index) => {
          const isRetryableLastBot =
            message.role === "bot" &&
            index === activeChat.messages.length - 1;

          return (
            <div
              key={message.id}
              ref={index === lastUserMsgIndex ? lastUserMsgRef : null}
            >
              <ChatMessage role={message.role}>{message.content}</ChatMessage>

              {isRetryableLastBot && (
                <div className="mt-2 flex justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRetry(message.id)}
                    disabled={retryingMessageId !== null}
                  >
                    <RotateCcw />
                    {retryingMessageId === message.id
                      ? "Generating..."
                      : "Regenerate"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatMessages;
