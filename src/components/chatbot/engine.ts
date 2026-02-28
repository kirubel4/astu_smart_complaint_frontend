import data from "@/data/chatbot-knowledge.json";

export async function getChatbotResponse(message: string): Promise<string> {
  const text = message.toLowerCase().trim();

  // Check greetings
  for (const greet of data.greetings) {
    if (text.includes("hi") || text.includes("hello")) {
      return greet;
    }
  }

  // Match topics
  for (const topicKey in data.topics) {
    const topic = data.topics[topicKey as keyof typeof data.topics];

    if (topic.keywords.some((k: string) => text.includes(k))) {
      return topic.response;
    }
  }

  // Fallback random message
  const fallback = data.fallback[Math.floor(Math.random() * data.fallback.length)];
  return fallback;
}