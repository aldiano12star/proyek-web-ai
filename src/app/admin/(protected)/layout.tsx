// Admin layout — sidebar + protected shell for all /admin/* routes except login.
//
// Defense-in-depth: the proxy already checked for an access token cookie, but
// cookies can be forged client-side. This layout runs getSessionUser to verify
// the JWT signature server-side before rendering any admin content.

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/insforge-server";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin CMS — Sapa Exploit",
  description: "Dasbor manajemen konten Sapa Exploit",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Real JWT check. If the proxy let a forged cookie through, this catches it.
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh bg-canvas-black">
      <AdminSidebar userEmail={user.email ?? "Admin"} />

      {/* Main content area */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
