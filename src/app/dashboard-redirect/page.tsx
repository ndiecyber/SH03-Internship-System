import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Halaman redirect pasca-login.
 * Membaca session di server (gratis — JWT sudah ada di cookie)
 * dan langsung redirect sesuai role tanpa round-trip tambahan dari client.
 */
export default async function DashboardRedirectPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (role === "MENTOR") {
    redirect("/mentor/dashboard");
  } else if (role === "INTERN") {
    redirect("/intern/dashboard");
  } else {
    // Fallback ke login jika session tidak valid
    redirect("/login");
  }
}
