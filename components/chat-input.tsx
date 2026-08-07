"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

function ChatInput() {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    setValue("");
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 flex gap-2">
      <Input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
      <Button type="submit"><Send />Send</Button>
    </form>
  );
}

export default ChatInput;
