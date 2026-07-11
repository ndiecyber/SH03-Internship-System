"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

// Route mapping per role — search akan navigate ke halaman yang relevan
const SEARCH_ROUTES: Record<string, { label: string; href: string }[]> = {
  ADMIN: [
    { label: "Dashboard",          href: "/admin/dashboard" },
    { label: "Interns",            href: "/admin/interns" },
    { label: "Mentors",            href: "/admin/mentors" },
    { label: "Applicants",         href: "/admin/applicants" },
    { label: "Programs",           href: "/admin/internship-programs" },
    { label: "Reports",            href: "/admin/reports" },
    { label: "Monitoring",         href: "/admin/monitoring" },
    { label: "Settings",           href: "/admin/settings" },
  ],
  INTERN: [
    { label: "Dashboard",          href: "/intern/dashboard" },
    { label: "Pendaftaran Magang", href: "/intern/internship-registration" },
    { label: "Logbook",            href: "/intern/logbook" },
    { label: "Progress",           href: "/intern/progress" },
    { label: "Sertifikat",         href: "/intern/certificate" },
    { label: "Profil",             href: "/intern/profile" },
  ],
  MENTOR: [
    { label: "Dashboard",          href: "/mentor/dashboard" },
    { label: "Assigned Interns",   href: "/mentor/assigned-interns" },
    { label: "Logbook Review",     href: "/mentor/logbook-review" },
    { label: "Evaluasi",           href: "/mentor/evaluation" },
    { label: "Profil",             href: "/mentor/profile" },
  ],
};

export function SearchBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const role = (session?.user?.role as string) || "INTERN";
  const routes = SEARCH_ROUTES[role] ?? [];

  const filtered = query.trim().length > 0
    ? routes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (href: string) => {
    setQuery("");
    setIsFocused(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      handleSelect(filtered[0].href);
    }
    if (e.key === "Escape") {
      setQuery("");
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm w-40 sm:w-56 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
      <Search className="h-4 w-4 text-slate-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder="Search anything..."
        className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none min-w-0"
      />

      {/* Dropdown hasil search */}
      {isFocused && filtered.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white shadow-lg z-50 overflow-hidden">
          {filtered.map((item) => (
            <button
              key={item.href}
              onMouseDown={() => handleSelect(item.href)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition text-left"
            >
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isFocused && query.trim().length > 0 && filtered.length === 0 && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white shadow-lg z-50 px-4 py-3 text-sm text-slate-400">
          Tidak ditemukan
        </div>
      )}
    </div>
  );
}
