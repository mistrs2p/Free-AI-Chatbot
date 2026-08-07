"use client";
import { useChatStore } from "@/app/store/chat-store";
import ChatMessage from "./chat-message";
import { useEffect, useRef } from "react";

function ChatMessages() {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const msgsDivRef = useRef<HTMLDivElement>(null);
  const outerDivRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);

  const lastUserMsgIndex = activeChat?.messages.findLastIndex(
    (msg) => msg.role === "user",
  );

  useEffect(() => {
    const isLastMsgFromUser = activeChat?.messages.at(-1)?.role === "user";
    if (!outerDivRef.current || !msgsDivRef.current || !lastUserMsgRef.current)
      return;

    const msgsDivRect = msgsDivRef.current.getBoundingClientRect();
    const outerDivRect = outerDivRef.current.getBoundingClientRect();
    const lastUserMsgRect = lastUserMsgRef.current.getBoundingClientRect();

    msgsDivRef.current.style.minHeight =
      outerDivRect.height + (lastUserMsgRect.top - msgsDivRect.top) - 20 + "px";

    msgsDivRef.current.scrollIntoView({
      behavior: isLastMsgFromUser ? "smooth" : "auto",
      block: "end",
    });
  }, [activeChat?.messages]);

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
