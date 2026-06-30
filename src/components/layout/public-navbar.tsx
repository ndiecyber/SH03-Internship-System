import Link from "next/link";

const publicLinks = [
  { href: "/internship-information", label: "Internship Information" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" }
];

export function PublicNavbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link className="text-sm font-semibold" href="/">
          LEXA IMS
        </Link>
        <nav className="flex items-center gap-4">
          {publicLinks.map((link) => (
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
