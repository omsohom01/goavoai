import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { TOKEN_COOKIE_NAME, signToken, tokenCookieConfig } from "@/lib/jwt";
import { fail } from "@/lib/response";
import { registerSchema } from "@/lib/validation";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid payload", 422);
    }

    await connectDb();

    const existingUser = await User.findOne({ email: parsed.data.email });
    if (existingUser) {
      return fail("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
    });

    const token = signToken({ userId: user._id.toString(), email: user.email });

    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );

    response.cookies.set(TOKEN_COOKIE_NAME, token, tokenCookieConfig);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return fail("Unable to register organizer", 500);
  }
}
