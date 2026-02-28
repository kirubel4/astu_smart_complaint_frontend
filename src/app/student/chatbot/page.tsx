"use client";

import { useState } from "react";
import { ChatbotInput } from "../../../components/chatbot/chatbot-input";
import { ChatbotMessage } from "../../../components/chatbot/chatbot-message";
import { getChatbotResponse } from "../../../components/chatbot/engine";

export default function StudentChatbotPage() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);

  const sendMessage = async (msg: string) => {
    setMessages((prev) => [...prev, { text: msg, isUser: true }]);

    const response = await getChatbotResponse(msg);

    setMessages((prev) => [...prev, { text: response, isUser: false }]);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-muted/20">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((m, i) => (
          <ChatbotMessage key={i} message={m.text} isUser={m.isUser} />
        ))}
      </div>

      <ChatbotInput onSend={sendMessage} loading={false} />
    </div>
  );
}