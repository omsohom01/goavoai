import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { TOKEN_COOKIE_NAME, signToken, tokenCookieConfig } from "@/lib/jwt";
import { fail } from "@/lib/response";
import { loginSchema } from "@/lib/validation";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid payload", 422);
    }

    await connectDb();
    const user = await User.findOne({ email: parsed.data.email });

    if (!user) {
      return fail("Invalid credentials", 401);
    }

    const matched = await bcrypt.compare(parsed.data.password, user.password);
    if (!matched) {
      return fail("Invalid credentials", 401);
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set(TOKEN_COOKIE_NAME, token, tokenCookieConfig);
    return response;
  } catch {
    return fail("Unable to login", 500);
  }
}
