import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <Button className="w-full mb-4">New Chat</Button>
        <p className="font-bold text-center mb-4">Chat History</p>
        <ul>
          <li className="p-2 rounded hover:bg-gray-200">Chat 1</li>
          <li className="p-2 rounded hover:bg-gray-200">Chat 2</li>
        </ul>
      </aside>
      <main className="flex flex-col flex-1">
        <header className="border-b p-4">
          <h1 className="text-xl font-bold">My AI Chat</h1>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-4 py-2 rounded">
              Hello!
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded">
              Hi there! How can I help you today?
            </div>
          </div>
        </div>
        <footer className="border-t p-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border rounded"
          />
        </footer>
      </main>
    </div>
  );
}
