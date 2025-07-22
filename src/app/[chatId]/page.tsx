// app/chat/[id]/page.tsx
import Sidebar from "@/components/Chatbot/Sidebar";
import { ChatWindows } from "@/components/Chatbot/ChatWindows";

interface ChatPageProps {
  params: { id: string };
}

async function getChatHistory() {
  const res = await fetch("http://192.168.0.156:8000/api/chat/history", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.conversations;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chats = await getChatHistory();

  return (
    <div className="flex h-screen">
      <Sidebar chats={chats} />
      <ChatWindows />
    </div>
  );
}
