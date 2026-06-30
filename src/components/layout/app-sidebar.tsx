import Link from "next/link";
import { roleNavigation } from "@/lib/navigation/role-navigation";

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-background lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link className="text-sm font-semibold" href="/">
          LEXA IMS
        </Link>
      </div>
      <nav className="space-y-6 px-4 py-5">
        {roleNavigation.map((section) => (
          <div key={section.role} className="space-y-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
