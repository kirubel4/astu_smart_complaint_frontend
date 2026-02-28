import { axiosClient } from "@/lib/api/axiosClient";

const pickOne = (options: string[]) => options[Math.floor(Math.random() * options.length)];

const fallbackReply = (message: string) => {
  const q = message.toLowerCase().trim();

  if (q.includes("create complaint") || q.includes("submit complaint") || q.includes("new complaint")) {
    return pickOne([
      "Go to Student > Create Complaint, fill title, description, and category, then submit.",
      "Use the Create Complaint page: choose category, add details, and submit to send it to the system.",
      "From the student menu, open Create Complaint, enter the issue details, and submit.",
    ]);
  }

  if (q.includes("track") || q.includes("status") || q.includes("progress")) {
    return pickOne([
      "You can track each complaint from Student > My Complaints. Status flow is OPEN -> IN_PROGRESS -> RESOLVED.",
      "Complaint progress is shown in your complaints list and detail page. Watch for OPEN, IN_PROGRESS, and RESOLVED.",
      "Open the complaints page to follow status updates and staff remarks over time.",
    ]);
  }

  if (q.includes("assign") || (q.includes("admin") && q.includes("staff"))) {
    return pickOne([
      "Admins can assign complaints in Admin > Complaints by selecting a staff member and clicking Assign.",
      "Use the admin complaints screen to assign tickets to staff and rebalance workloads.",
      "In the admin complaints list, pick a staff member for a complaint and submit assignment.",
    ]);
  }

  if (q.includes("change status") || q.includes("in progress") || q.includes("resolved")) {
    return pickOne([
      "Admins and staff can update complaint status. Typical lifecycle: OPEN -> IN_PROGRESS -> RESOLVED.",
      "Use the status control in complaint management pages to move tickets through their lifecycle.",
      "Status updates should reflect actual work progress: OPEN, then IN_PROGRESS, and finally RESOLVED.",
    ]);
  }

  if (q.includes("staff") && (q.includes("dashboard") || q.includes("work") || q.includes("task"))) {
    return pickOne([
      "Staff dashboard shows assigned complaints. Staff can open details, add remarks, and update status.",
      "Staff users work from Assigned Complaints, where they investigate issues and post updates.",
      "The staff workflow is: review assigned ticket, set status, add remark, and close when resolved.",
    ]);
  }

  if (q.includes("admin") && q.includes("dashboard")) {
    return pickOne([
      "Admin dashboard displays totals, status counts, category distribution, and resolution metrics.",
      "You can monitor complaint trends and resolution performance from the admin analytics dashboard.",
      "Use the admin dashboard to review system-level complaint volume and outcomes.",
    ]);
  }

  if (q.includes("notification") || q.includes("alert")) {
    return pickOne([
      "Notifications appear in the bell menu and notifications page. You can mark items as read.",
      "Check your role-based notifications page to see new updates about complaints.",
      "Unread notifications are highlighted in the navbar bell icon.",
    ]);
  }

  if (q.includes("category")) {
    return pickOne([
      "Categories are managed by admins and used by students when filing complaints.",
      "Go to Admin > Categories to create or remove complaint categories.",
      "Each complaint belongs to a category for better filtering and reporting.",
    ]);
  }

  if (q.includes("profile") || q.includes("password") || q.includes("email")) {
    return pickOne([
      "You can update your profile information from the Student > Profile page.",
      "Profile page supports updating name, email, and optional password change.",
      "Use the profile form to keep your account details current.",
    ]);
  }

  return pickOne([
    "I can help with ASTU system usage: complaints, assignment, status flow, notifications, profile updates, and dashboards.",
    "Ask me about student complaints, staff workflow, admin management, notifications, or profile settings.",
    "I can explain how to use complaint creation, assignment, status tracking, and analytics pages.",
  ]);
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
