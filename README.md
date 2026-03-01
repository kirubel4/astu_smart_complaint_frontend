# Complaint Management System Frontend (Next.js)

## Overview

This frontend application is built using Next.js and provides the user-facing interface for a complete complaint management system. It includes user registration, user login, complaint creation, complaint tracking, category browsing, and administrative interfaces for managing categories, users, and submitted complaints. The frontend is designed to communicate with a backend API, render dynamic pages, and deliver a smooth and structured experience without requiring page reloads. Every page, component, utility, and service is structured to support clarity, maintainability, and long-term scalability.

---

## Features

### User Features

1. **User Login**
   Users log in using email and password. The system handles authentication tokens from the backend and stores them securely on the client side. After login, users are redirected to the correct dashboard based on their role.

2. **Complaint Submission**
   Users can create complaints by filling out a structured form with a title, description, and category. The system ensures that all required fields are provided before submission.

3. **Complaint Status Tracking**
   Users see a dashboard listing all their complaints with the current status. The dashboard allows filtering, detailed viewing, and real-time updates when statuses change.

4. **View Categories**
   Users can see all categories created by administrators. Categories help users understand how their complaint will be handled.

---

### Administrator Features

1. **Manage Categories**
   Admins can create, edit, and delete categories. Each category determines how complaints are classified, directing them to the correct administrative team.

2. **Manage Complaints**
   Admins can view all complaints, update statuses, add internal notes, request additional information, and resolve issues.

3. **Manage Users**
   Admins can view registered users, modify roles, activate or deactivate accounts, and search through the user list.

---

## Technology and Structure

The frontend uses Next.js, React server components, client components, dynamic API integration, global state management, and optimized bundling to ensure fast load times and high performance.

### Core Technologies

- Next.js 14 or later
- TypeScript
- CSS modules or Tailwind (depending on project setup)
- Fetch API or Axios for backend communication
- Session or token-based authentication workflows
- Form handling and validation using a custom validator or libraries such as React Hook Form

---

## Backend Integration

All frontend requests are routed to the backend API defined in `NEXT_PUBLIC_API_URL`. This includes authentication, category management, user management, and complaint operations. Each request uses secure token handling and follows consistent API conventions.

---

## Testing

Recommended tools include Jest, React Testing Library, and Playwright for UI automation. Tests should cover all pages, forms, components, and API service layers.

---

## Deployment

The application can be deployed on Vercel. Environment variables must be configured on the deployment platform.

