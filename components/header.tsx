import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="border-b p-4 flex items-center gap-4">
        <SidebarTrigger />
      <h1 className="text-xl font-bold">My AI Chat</h1>
    </header>
  );
}
