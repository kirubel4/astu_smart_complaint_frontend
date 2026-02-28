"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatbotInput({ onSend, loading }: { onSend: (value: string) => Promise<void>; loading: boolean }) {
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const current = message;
    setMessage("");
    await onSend(current);
  };

  return (
    <form onSubmit={submit} className="flex gap-2 border-t bg-white p-3">
      <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask about complaint services..." />
      <Button type="submit" disabled={loading}>
        Send
      </Button>
    </form>
  );
}
