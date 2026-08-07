import React from "react";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "./ui/sidebar";
import { MessageSquare, Plus } from "lucide-react";

const chats = [
  { id: "c1", title: "Project ideas" },
  { id: "c2", title: "Ideas for new features" },
  { id: "c3", title: "Bug reports" },
];
function ChatSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Button>
          <Plus />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full flex justify-start gap-2"
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

export default ChatSidebar;
