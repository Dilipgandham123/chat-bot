"use client";

import { useEffect, useRef, useState } from "react";
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({
  url: "http://192.168.0.156:8000/api/chat",
});

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const subscription = agent.subscribe({
      onTextMessageStartEvent: ({ event }: any) => {
        const id = event.messageId ?? crypto.randomUUID();
        currentMessageIdRef.current = id;
        setMessages((prev) => [...prev, { id, role: "assistant", content: "" }]);
      },
      onTextMessageContentEvent: ({ event }: any) => {
        const id = event.messageId ?? currentMessageIdRef.current;
        if (!id) return;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, content: msg.content + (event.delta || "") }
              : msg
          )
        );
      },
      onTextMessageEndEvent: () => {
        currentMessageIdRef.current = null;
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSend = async () => {
  const userMessage = input.trim();
  if (!userMessage) return;

  setError(null);

  const id = crypto.randomUUID();
  setMessages((prev) => [...prev, { id, role: "user", content: userMessage }]);
  setInput("");

  try {
    agent.setMessages([
      {
        id : id,
        role: "user",
        content: userMessage,
      },
    ]);

    await agent.runAgent({
      tools: [],
    });
  } catch (err) {
    console.error("Failed to send:", err);
    setError("Failed to send message. Try again.");
  }
};

  return (
    <div className="flex flex-col h-screen p-4 bg-white">
      <div className="flex-1 overflow-y-auto bg-gray-50 shadow-sm space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] whitespace-pre-wrap px-4 py-2 rounded-xl ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-900 self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {error && <div className="text-red-500">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 justify-center mt-4">
        <input
          type="text"
          className="flex-1 border w-[500px] rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
