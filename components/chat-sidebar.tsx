"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "./ui/sidebar";
import { useChatStore } from "@/app/store/chat-store";

type ModalState =
  | { type: "rename"; chatId: string }
  | { type: "delete"; chatId: string }
  | null;

export default function ChatSidebar() {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const createChat = useChatStore((s) => s.createChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const renameChat = useChatStore((s) => s.renameChat);

  const [modal, setModal] = useState<ModalState>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  const modalChat = modal
    ? chats.find((chat) => chat.id === modal.chatId)
    : undefined;

  useEffect(() => {
    if (!modal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  useEffect(() => {
    if (modal?.type === "rename") {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [modal]);

  const openRenameModal = (chatId: string, title: string) => {
    setRenameValue(title);
    setModal({ type: "rename", chatId });
  };

  const openDeleteModal = (chatId: string) => {
    setModal({ type: "delete", chatId });
  };

  const closeModal = () => {
    setModal(null);
    setRenameValue("");
  };

  const handleRename = () => {
    if (!modal || modal.type !== "rename") return;

    const title = renameValue.trim();
    if (!title) return;

    renameChat(modal.chatId, title);
    closeModal();
  };

  const handleDelete = () => {
    if (!modal || modal.type !== "delete") return;

    deleteChat(modal.chatId);
    closeModal();
  };

  return (
    <>
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
                  <span className="truncate flex-1 text-left">
                    {chat.title}
                  </span>

                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Rename ${chat.title}`}
                      className="rounded p-1 hover:bg-muted"
                      onClick={(event) => {
                        event.stopPropagation();
                        openRenameModal(chat.id, chat.title);
                      }}
                    >
                      <Pencil className="size-4" />
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${chat.title}`}
                      className="rounded p-1 hover:bg-destructive/10"
                      onClick={(event) => {
                        event.stopPropagation();
                        openDeleteModal(chat.id);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </span>
                </Button>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {modal && modalChat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-modal-title"
            className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="chat-modal-title" className="text-lg font-semibold">
                  {modal.type === "rename" ? "Rename chat" : "Delete chat"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {modal.type === "rename"
                    ? "Choose a new name for this conversation."
                    : "This action cannot be undone."}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={closeModal}
              >
                <X className="size-4" />
              </button>
            </div>

            {modal.type === "rename" ? (
              <div className="mt-5 space-y-4">
                <Input
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(event) => setRenameValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleRename();
                    }
                  }}
                  placeholder="Chat name"
                  aria-label="Chat name"
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRename}
                    disabled={!renameValue.trim()}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <span className="font-medium">{modalChat.title}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
