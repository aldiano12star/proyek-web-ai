// Login route (Server Component). Reads the post-login destination from
// ?redirect=, and if the visitor already has a valid session it skips the form
// and sends them straight to the dashboard. The form itself is the client
// LoginForm. Rendered dynamically (it depends on cookies/search params).

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/insforge-server";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo =
    redirectParam?.startsWith("/admin") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/admin/dashboard";

  // Already signed in? Don't show the login form — go to the destination.
  const user = await getSessionUser();
  if (user) redirect(redirectTo);

  return <LoginForm redirectTo={redirectTo} />;
}
