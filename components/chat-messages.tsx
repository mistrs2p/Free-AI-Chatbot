"use client";
import { useChatStore } from "@/app/store/chat-store";
import ChatMessage from "./chat-message";
import { useRef } from "react";
import { useScrollToLastUserMsg } from "@/hooks/use-scroll-to-last-user-msg";

function ChatMessages() {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const { outerDivRef, msgsDivRef, lastUserMsgRef } =
    useScrollToLastUserMsg(activeChat);

  const lastUserMsgIndex = activeChat?.messages.findLastIndex(
    (msg) => msg.role === "user",
  );

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
        {activeChat?.messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === lastUserMsgIndex ? lastUserMsgRef : null}
          >
            <ChatMessage role={message.role}>{message.content}</ChatMessage>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatMessages;
