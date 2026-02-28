"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatbotMessage } from "@/components/chatbot/chatbot-message";
import { ChatbotInput } from "@/components/chatbot/chatbot-input";
import { chatbotService } from "@/lib/services/chatbot.service";
import { Spinner } from "@/components/shared/loading";

type Message = { id: string; text: string; isUser: boolean };

export default function StudentChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([{ id: "welcome", text: "Hello! Ask me anything about complaints and campus issues.", isUser: false }]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const onSend = async (text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text, isUser: true }]);
    setLoading(true);
    try {
      const response = await chatbotService.ask(text);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: response.reply || "No response", isUser: false }]);
    } catch {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: "Failed to reach chatbot.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto flex h-[75vh] max-w-3xl flex-col">
      <CardHeader><CardTitle>Student Chatbot Assistant</CardTitle></CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => <ChatbotMessage key={message.id} message={message.text} isUser={message.isUser} />)}
          {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner />Assistant is typing...</div>}
          <div ref={bottomRef} />
        </div>
        <ChatbotInput onSend={onSend} loading={loading} />
      </CardContent>
    </Card>
  );
}
