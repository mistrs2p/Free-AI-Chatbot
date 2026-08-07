import React from "react";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import Header from "./header";

function ChatArea() {
  return (
    <main className="flex flex-col flex-1">
      <Header />
      <ChatMessages />
      <ChatInput />
    </main>
  );
}

export default ChatArea;
