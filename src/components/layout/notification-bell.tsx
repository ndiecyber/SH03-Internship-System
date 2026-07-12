"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, FileText, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface NotifItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "approval" | "logbook";
}

interface NotificationBellProps {
  count: number;
  items: NotifItem[];
}

export function NotificationBell({ count, items }: Readonly<NotificationBellProps>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-500" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white leading-none">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-100 bg-white shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">Notifications</span>
            {count > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                {count} new
              </span>
            )}
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <CheckCircle className="h-8 w-8 text-slate-300" />
              <p className="text-xs text-slate-400 font-medium">All caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    item.icon === "approval" ? "bg-amber-100" : "bg-blue-100"
                  }`}>
                    {item.icon === "approval"
                      ? <FileText className="h-3.5 w-3.5 text-amber-600" />
                      : <Clock className="h-3.5 w-3.5 text-blue-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2.5">
            <Link
              href="/admin/reports"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              View all activity →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
