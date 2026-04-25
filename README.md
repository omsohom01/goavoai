<div align="center">
  
  # ✨ EventForge SaaS ✨
  
  *The ultimate production-ready Event Management SaaS platform built with Next.js.*

  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

<br />

## 🌟 Overview

EventForge is a high-performance Event Management platform designed for seamless event creation, capacity automation, and intelligent attendee management. It delivers a premium experience for both organizers and attendees through a clean, modern interface and robust automated workflows.

---

## 👥 User Workflow

The EventForge experience is optimized for two distinct roles.

### 💼 1. Organizer Experience
> Manage events with precision and ease.

- **Secure Access**: Register and log in to a private, premium dashboard.
- **Dynamic Creation**: Build events with rich metadata, custom capacities, and optional **WhatsApp integrations**.
- **Live Monitoring**: Track registration trends and attendee metrics in real-time.
- **Intelligent Moderation**:
  - **Open RSVP**: Instant approval for high-velocity events.
  - **Shortlisted RSVP**: Manual vetting of attendee profiles for exclusive gatherings.
- **Mass Communication**: Automatically notify all attendees via email when event details change or cancellations occur.

### 🎟️ 2. Attendee Experience
> A frictionless journey from discovery to confirmation.

- **SEO Landing Pages**: Access beautifully rendered event pages via unique shareable links.
- **Smart Forms**: Fill out adaptive registration forms that validate inputs (like WhatsApp numbers) in real-time.
- **Automated Alerts**:
  - Receive "Application Received" or "Registration Confirmed" emails instantly.
  - Get notified of approval/rejection decisions via professionally designed templates.
- **Capacity Safeguards**: The system automatically closes registrations once limits are reached or if the event is cancelled.

---

## ⚙️ Technical Workflow & Architecture

EventForge follows a modern **Full-Stack Monolith** architecture powered by the Next.js App Router.

### 🏗️ Core Architecture
- **Unified Repository**: Frontend and Backend (Node.js/Next.js API Routes) live together for seamless development.
- **Data Layer**: MongoDB & Mongoose handle complex relationships between Users, Events, and Registrations.
- **Security**: 
  - **Bcrypt.js** for password hashing.
  - **JWT** for stateless sessions, delivered via secure **HTTP-only cookies**.
  - **Middleware**-level route protection for all sensitive dashboard and API paths.

### 🔄 Automated Logic Flow
1. **Capacity Engine**: A server-side utility that re-calculates `isFull` status by comparing approved registrations against the event's defined limit.
2. **Notification Pipeline**: 
   - Uses **Resend** and **React Email** for transactional emails.
   - Triggers are hooked into DB operations (e.g., `onUpdate` or `onStatusChange`).
3. **External Sync**: Communicates with a dedicated **Go backend** for reliable WhatsApp delivery and Meta webhook processing.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14+ (App Router) |
| **Styling** | Tailwind CSS (Glassmorphism & Dark Mode) |
| **Database** | MongoDB & Mongoose |
| **Auth** | JWT & HTTP-only Cookies |
| **Validation** | Zod (End-to-end Type Safety) |
| **Mailing** | Resend & React Email |

---

## 🚀 Getting Started

1. **Install Deps**: `npm install`
2. **Config Environment**: Copy `.env.example` to `.env.local` and fill in your keys.
3. **Launch**: `npm run dev`

---

<div align="center">
  <p>Crafted with precision for the modern event organizer.</p>
</div>
