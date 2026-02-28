"use client";

import { cn } from "@/lib/utils";

export function ChatbotMessage({ message, isUser }: { message: string; isUser: boolean }) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] rounded-2xl px-4 py-2 text-sm", isUser ? "bg-primary text-primary-foreground" : "bg-white border")}>{message}</div>
    </div>
  );
}
