import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-8 px-6 py-16">
      <section className="max-w-3xl space-y-5">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">LEXA IMS</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Internship management for applicants, mentors, and administrators.
        </h1>
        <p className="text-lg text-muted-foreground">
          A scalable foundation for managing internship registration, mentoring, progress,
          evaluation, and certificates.
        </p>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/register">
          Register
        </Link>
        <Link className="rounded-md border px-4 py-2 text-sm font-medium" href="/internship-information">
          Internship Information
        </Link>
      </div>
    </main>
  );
}
