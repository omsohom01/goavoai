# EventForge SaaS (Next.js Full Stack)

Production-ready Event Management SaaS platform built entirely in Next.js App Router with no separate backend server.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- MongoDB + Mongoose
- JWT authentication with HTTP-only cookies

## Core Features

- Organizer authentication
	- POST `/api/auth/register`
	- POST `/api/auth/login`
	- GET `/api/auth/me`
- Event management CRUD
	- POST `/api/events`
	- GET `/api/events`
	- GET `/api/events/:id`
	- PUT `/api/events/:id`
	- DELETE `/api/events/:id`
- Public event page + registration
	- Route `/event/[id]`
	- POST `/api/registrations`
- Attendee dashboard flows
	- GET `/api/registrations/:eventId`
	- PUT `/api/registrations/:id`
	- Approve / reject / revoke
	- Search + filter
- Capacity automation
	- Blocks registration when event is cancelled/full
	- Dynamically recomputes `isFull` based on approved attendee count
- WhatsApp integration (via Go backend service)
	- `whatsappEnabled` toggle on event
	- Phone field required when WhatsApp is enabled
	- Real WhatsApp send attempts with Sent/Failed logs
	- Meta webhook verify/callback support from `gbackend`

## Project Structure

- Frontend + backend in one repository
- API routes: `app/api/*`
- Models: `models/*`
- Utilities: `lib/*`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy and configure environment variables:

```bash
cp .env.example .env.local
```

3. Update `.env.local` values:

- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `WHATSAPP_BACKEND_URL` (for example `https://your-gbackend.onrender.com`)
- `WHATSAPP_BACKEND_API_KEY` (must match `WHATSAPP_SERVICE_API_KEY` in gbackend if configured)

Email behavior:

- Registration confirmation email is sent after attendee registers.
- Open RSVP events send instant confirmation messaging.
- Shortlisted RSVP events send application received messaging.
- Approval or rejection by organizer sends attendee decision email.
- Any event edit (including cancellation) sends event update email to registered attendees.

4. Run development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Security

- Passwords hashed with `bcryptjs`
- JWT stored in HTTP-only cookie
- Middleware route protection for dashboard + protected APIs
- Zod validation for auth/event/registration payloads
