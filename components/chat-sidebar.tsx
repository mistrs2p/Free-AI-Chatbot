"use client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "./ui/sidebar";
import { useChatStore } from "@/app/store/chat-store";

export default function ChatSidebar() {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const createChat = useChatStore((s) => s.createChat);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Button onClick={createChat}>
          <Plus />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent chats</SidebarGroupLabel>
          <SidebarGroupContent>
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => setActiveChat(chat.id)}
                className={`w-full flex justify-start gap-2 ${
                  chat.id === activeChatId ? "bg-gray-200" : ""
                }`}
              >
                <MessageSquare />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
