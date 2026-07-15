import Link from "next/link";
import Image from "next/image";

const publicLinks = [
  { href: "/internship-information", label: "Program Information" },
  { href: "/login", label: "Login" },
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link className="flex items-center gap-2" href="/">
          <Image 
            src="/logo-lexa.png" 
            alt="Lexa Logo" 
            width={120} 
            height={40} 
            className="object-contain"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6">
          {publicLinks.map((link) => (
            <Link className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link 
            href="/register" 
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Apply Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
