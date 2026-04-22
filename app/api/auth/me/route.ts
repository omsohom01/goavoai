import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { fail, ok } from "@/lib/response";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  await connectDb();
  const user = await User.findById(auth.userId).select("name email");

  if (!user) {
    return fail("User not found", 404);
  }

  return ok({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
}
