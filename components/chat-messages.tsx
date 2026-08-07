"use client";
import { useChatStore } from "@/app/store/chat-store";
import ChatMessage from "./chat-message";

function ChatMessages() {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {activeChat?.messages.map((message) => (
        <ChatMessage key={activeChat.id} role={message.role}>
          {message.content}
        </ChatMessage>
      ))}
    </div>
  );
}

export default ChatMessages;
