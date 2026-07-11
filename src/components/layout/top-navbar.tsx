import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export async function TopNavbar() {
  const session = await auth();
  const userName = session?.user?.name || "User";
  const userRole = session?.user?.role || "INTERN";

  // Define badge colors for roles
  const badgeColors: Record<string, string> = {
    ADMIN: "bg-red-500/10 text-red-600 border-red-500/20",
    MENTOR: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    INTERN: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  };

  const currentBadgeColor = badgeColors[userRole] || badgeColors.INTERN;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-6 backdrop-blur lg:px-8 shadow-sm">
      <Link className="flex items-center gap-3 lg:hidden" href="/">
        <Image
          src="/logo-lexa.png"
          alt="LEXA Technology"
          width={90}
          height={30}
          priority
          className="object-contain"
        />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600 leading-tight">INTERNSHIP</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600 leading-tight">MANAGEMENT SYSTEM</span>
        </div>
      </Link>
      
      <div className="ml-auto flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Masuk sebagai:</span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${currentBadgeColor}`}>
            {userRole}
          </span>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-slate-200" />

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 hidden md:inline">
            {userName}
          </span>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition duration-200"
              type="submit"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
