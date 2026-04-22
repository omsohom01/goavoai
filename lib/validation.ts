import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(10).max(3000),
  dateTime: z.string().datetime(),
  locationType: z.enum(["online", "offline"]),
  rsvpMode: z.enum(["open", "shortlisted"]),
  venue: z.string().min(3).max(220),
  capacity: z.number().int().positive().max(100000),
  status: z.enum(["draft", "published", "cancelled"]),
  templateType: z.string().min(2).max(40),
  whatsappEnabled: z.boolean(),
});

export const registrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(25).optional().or(z.literal("")),
});

export const registrationStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
