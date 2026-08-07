"use client";
import { useChatStore } from "@/app/store/chat-store";
import ChatMessage from "./chat-message";

function ChatMessages() {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  if (!(activeChat && activeChat.messages.length > 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-normal text-3xl">What can I help with?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 p-4 space-y-4 h-full w-full max-w-200 mx-auto">
        {activeChat?.messages.map((message) => (
          <ChatMessage key={message.id} role={message.role}>
            {message.content}
          </ChatMessage>
        ))}
      </div>
    </div>
  );
}

export default ChatMessages;
