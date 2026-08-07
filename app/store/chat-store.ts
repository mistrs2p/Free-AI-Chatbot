import { create } from "zustand";

export type MessageRole = "user" | "bot";

export type Message = {
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
  addChatMessage: (content: string) => void;
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
    set({ activeChatId: id });
  },

  addChatMessage: (content: string) => {
    const { chats, activeChatId } = get();

    const updatedChats = chats.map((chat: Chat) => {
      if (chat.id !== activeChatId) return chat;

      const userMsg: Message = {
        role: "user",
        content,
      };

      const botMsg: Message = {
        role: "bot",
        content: `You said: "${content}" (AI will reply later)`,
      };

      return {
        ...chat,
        messages: [...chat.messages, userMsg, botMsg],
        title: chat.messages.length === 0 ? content : chat.title,
      };
    });
    set({ chats: updatedChats });
  },
}));
