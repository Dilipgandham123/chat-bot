"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import { FilePreviewDialog } from "./FilePreviewDialog";

interface FileItem {
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "pdf" | "doc" | string;
}

interface MessageProps {
  text: string;
  sender: "user" | "assistant" | string;
  files?: FileItem[];
}

export function Message({ text, sender, files = [] }: MessageProps) {
  const isUser = sender === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-[75%] ${
          isUser
            ? "bg-blue-100 ml-auto text-right"
            : "bg-gray-100 mr-auto text-left"
        }`}
      >
        <p className="text-sm mb-1">{text}</p>

        {files.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap justify-start">
            {files.map((file, i) => (
              <FilePreviewDialog key={i} file={file}>
                {file.type === "image" ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    width={80}
                    height={80}
                    className="rounded-md cursor-pointer"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center border rounded-md bg-muted cursor-pointer">
                    <FileText size={20} />
                  </div>
                )}
              </FilePreviewDialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
