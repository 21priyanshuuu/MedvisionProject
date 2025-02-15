import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const loggedIn = await isAuthenticated();
  const user = loggedIn ? await getUser() : null;

  return Response.json({ isAuthenticated: loggedIn, user });
}
