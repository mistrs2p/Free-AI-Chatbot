import ChatArea from "@/components/chat-area";
import ChatSidebar from "@/components/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <ChatSidebar />
        <ChatArea />
      </div>
    </SidebarProvider>
  );
}
