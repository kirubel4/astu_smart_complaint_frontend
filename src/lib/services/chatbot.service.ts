import { axiosClient } from "@/lib/api/axiosClient";

const fallbackReply = (message: string) => {
  const q = message.toLowerCase();

  if (q.includes("create complaint") || q.includes("submit complaint")) {
    return "Go to Student > Create Complaint, fill title, description, and category, then submit. You can attach a file name as reference.";
  }
  if (q.includes("track") || q.includes("status")) {
    return "You can track complaint status in Student > My Complaints. Status moves from OPEN to IN_PROGRESS to RESOLVED.";
  }
  if (q.includes("staff") && q.includes("work")) {
    return "Staff users open Staff > Assigned Complaints, review details, update status, and add remarks for progress updates.";
  }
  if (q.includes("admin") && q.includes("dashboard")) {
    return "Admin dashboard shows totals, open/in-progress/resolved counts, category distribution, and resolution rate from backend analytics.";
  }
  if (q.includes("notification")) {
    return "Notifications are shown in the bell icon and notifications page. You can mark each notification as read.";
  }
  if (q.includes("category")) {
    return "Admins manage categories from Admin > Categories. Categories are used when students submit complaints.";
  }

  return "I can help with ASTU system usage: creating complaints, tracking status, staff workflow, admin dashboard, categories, and notifications.";
};

export const chatbotService = {
  async ask(message: string) {
    try {
      const { data } = await axiosClient.post<{ reply?: string; data?: { reply?: string } }>("/chatbot/ask", { message });
      const reply = data?.reply ?? data?.data?.reply;
      if (reply) return { reply };
    } catch {
      // Backend chatbot endpoint is optional in the current backend; fallback is used.
    }

    return { reply: fallbackReply(message) };
  },
};
