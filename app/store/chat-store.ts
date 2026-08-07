import { create } from "zustand";

export type MessageRole = "user" | "bot";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export type ChatState = {
  chats: Chat[];
  activeChatId: string | null;

  createChat: () => void;
  setActiveChat: (id: string) => void;

  addChatMessage: (content: string, role: MessageRole) => string;

  updateChatMessage: (messageId: string, content: string) => void;
};

const id = () => Math.random().toString(36).slice(2, 10);

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],

  activeChatId: null,

  createChat: () => {
    const newChat: Chat = {
      id: id(),
      title: "New Chat",
      messages: [],
    };

    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChatId: newChat.id,
    }));
  },

  setActiveChat: (id: string) => {
    set({
      activeChatId: id,
    });
  },

  addChatMessage: (content, role) => {
    const messageId = id();

    let { chats, activeChatId } = get();

    if (!activeChatId) {
      const newChat: Chat = {
        id: id(),
        title: role === "user" ? content : "New Chat",
        messages: [],
      };

      set({
        chats: [newChat, ...chats],
        activeChatId: newChat.id,
      });

      activeChatId = newChat.id;
      chats = get().chats;
    }

    const updatedChats = chats.map((chat) => {
      if (chat.id !== activeChatId) {
        return chat;
      }

      const message: Message = {
        id: messageId,
        role,
        content,
      };

      return {
        ...chat,
        messages: [...chat.messages, message],
        title:
          chat.messages.length === 0 && role === "user" ? content : chat.title,
      };
    });

    set({
      chats: updatedChats,
    });

    return messageId;
  },

  updateChatMessage: (messageId, content) => {
    const { activeChatId } = get();

    if (!activeChatId) return;

    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id !== activeChatId) {
          return chat;
        }

        return {
          ...chat,
          messages: chat.messages.map((message) => {
            if (message.id !== messageId) {
              return message;
            }

            return {
              ...message,
              content,
            };
          }),
        };
      }),
    }));
  },
}));
