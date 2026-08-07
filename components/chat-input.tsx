import React from "react";

function ChatInput() {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full px-4 py-2 border rounded"
      />
    </div>
  );
}

export default ChatInput;
