import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TOKEN_COOKIE_NAME = "eventforge_token";

export type AuthPayload = {
  userId: string;
  email: string;
};

export function signToken(payload: AuthPayload) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export const tokenCookieConfig = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export { TOKEN_COOKIE_NAME };
