// Sidebar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash,
} from "lucide-react";

interface ChatItem {
  conversation_id: string;
  messages: { content: string }[];
}

interface SidebarProps {
  chats: ChatItem[];
}

export default function Sidebar({ chats }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>(chats);

  const router = useRouter();
  const pathname = usePathname();
  const currentId = pathname.split("/")[1];

  const handleNewChat = async () => {
    router.push(`/auto`);
  };

  const handleChatClick = (id: string) => {
    router.push(`/${id}`);
  };

const handleDeleteChat = async (id: string) => {
  try {
    const res = await fetch(`http://192.168.0.156:8000/api/chat/history/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete chat");
    }

    setChatHistory((prev) =>
      prev.filter((chat) => chat.conversation_id !== id)
    );

    if (currentId === id && chatHistory.length > 1) {
      const nextChat = chatHistory.find((c) => c.conversation_id !== id);
      if (nextChat) {
        router.push(`/${nextChat.conversation_id}`);
      } else {
        router.push("/auto");
      }
    }

  } catch (err) {
    console.error("Delete failed:", err);
    alert("Could not delete chat.");
  }
};


  const filteredChats = chatHistory.filter((chat) =>
    chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col h-full border-r bg-white ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h1 className="font-bold text-sm">Open GPT</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <div className="p-2">
        <Button
          variant="outline"
          className={`w-full ${isCollapsed ? "px-2" : "px-4"}`}
          onClick={handleNewChat}
        >
          <Plus size={16} className="mr-2" />
          {!isCollapsed && "New chat"}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-2 top-2.5 text-muted-foreground"
            />
            <input
              placeholder="Search chats"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-sm rounded-md border border-input bg-background"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {filteredChats.map((chat) => {
          const firstMessage = chat.messages?.[0]?.content ?? "Untitled";
          const isActive = currentId === chat.conversation_id;

          return (
            <div
              key={chat.conversation_id}
              className="flex items-center justify-between group hover:bg-muted/60 rounded-md px-2"
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="flex-1 justify-start truncate text-left"
                onClick={() => handleChatClick(chat.conversation_id)}
              >
                {firstMessage}
              </Button>
              <button
                onClick={() => handleDeleteChat(chat.conversation_id)}
                className="invisible group-hover:visible text-muted-foreground hover:text-destructive px-1"
              >
                <Trash size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t text-xs text-muted-foreground">
          Access to the best models
        </div>
      )}
    </div>
  );
}
