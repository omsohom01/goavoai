import { NextRequest } from "next/server";
import { TOKEN_COOKIE_NAME, verifyToken } from "@/lib/jwt";

export function getAuthUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
