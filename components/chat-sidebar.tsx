"use client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
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
  const deleteChat = useChatStore((s) => s.deleteChat);
  const renameChat = useChatStore((s) => s.renameChat);

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
                <span className="truncate flex-1 text-left">{chat.title}</span>
                <span className="flex items-center gap-1">
                  <span role="button" tabIndex={0} aria-label="Rename chat" className="rounded p-1 hover:bg-muted" onClick={(event) => { event.stopPropagation(); const title = window.prompt("Rename chat", chat.title); if (title) renameChat(chat.id, title); }}>
                    <Pencil className="size-4" />
                  </span>
                  <span role="button" tabIndex={0} aria-label="Delete chat" className="rounded p-1 hover:bg-destructive/10" onClick={(event) => { event.stopPropagation(); if (window.confirm("Delete this chat?")) deleteChat(chat.id); }}>
                    <Trash2 className="size-4" />
                  </span>
                </span>
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
