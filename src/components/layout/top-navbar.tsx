import Link from "next/link";

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur lg:px-8">
      <Link className="text-sm font-semibold lg:hidden" href="/">
        LEXA IMS
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Account</span>
      </div>
    </header>
  );
}
