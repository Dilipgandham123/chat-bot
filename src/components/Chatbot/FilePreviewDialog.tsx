"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode } from "react";

interface FileItem {
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "pdf" | "doc" | string;
}

interface FilePreviewDialogProps {
  file: FileItem;
  children: ReactNode;
}

export function FilePreviewDialog({ file, children }: FilePreviewDialogProps) {
  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <Image
            src={file.url}
            alt={file.name}
            width={600}
            height={400}
            className="w-full h-auto rounded-md object-contain"
          />
        );
      case "video":
        return (
          <video
            src={file.url}
            controls
            className="w-full h-[400px] rounded-md"
          />
        );
      case "audio":
        return <audio src={file.url} controls className="w-full mt-2" />;
      case "pdf":
        return (
          <iframe
            src={file.url}
            className="w-full h-[500px] rounded-md border"
          />
        );
      case "doc":
      default:
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              file.url
            )}&embedded=true`}
            className="w-full h-[500px] rounded-md border"
            title={file.name}
          />
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderPreview()}</div>
      </DialogContent>
    </Dialog>
  );
}
