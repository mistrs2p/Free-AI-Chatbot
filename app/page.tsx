import ChatArea from "@/components/chat-area";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
