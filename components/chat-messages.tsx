import React from "react";
import ChatMessage from "./chat-message";

function ChatMessages() {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      <ChatMessage role="user">Hello!</ChatMessage>
      <ChatMessage role="bot">Hi there! How can I help you today?</ChatMessage>
      <ChatMessage role="user">What can you do?</ChatMessage>
      <ChatMessage role="bot">I can answer questions, help with tasks, and have a conversation with you.</ChatMessage>
    </div>
  );
}

export default ChatMessages;
