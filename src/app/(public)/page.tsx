import Link from "next/link";
import { ArrowRight, Code2, Smartphone, BarChart3, CheckCircle, Users, Clock } from "lucide-react";

const programs = [
  {
    icon: Code2,
    title: "Web Development",
    tag: "Frontend & Backend",
    desc: "Build scalable web apps using modern frameworks like React, Next.js, and Node.js. Work on real products used by thousands.",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
    linkColor: "text-blue-600 dark:text-blue-400",
    tagColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    delay: "delay-400",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    tag: "iOS & Android",
    desc: "Design and ship cross-platform mobile apps. From UI/UX prototyping to deployment on the App Store and Google Play.",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-700",
    linkColor: "text-violet-600 dark:text-violet-400",
    tagColor: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
    delay: "delay-500",
  },
  {
    icon: BarChart3,
    title: "Data & Cloud",
    tag: "Analytics & Infra",
    desc: "Learn data pipelines, cloud deployment, and analytics. Work with AWS, GCP, and modern databases at production scale.",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderHover: "hover:border-indigo-300 dark:hover:border-indigo-700",
    linkColor: "text-indigo-600 dark:text-indigo-400",
    tagColor: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
    delay: "delay-600",
  },
];

const stats = [
  { icon: Users,        value: "50+", label: "Interns Annually" },
  { icon: CheckCircle,  value: "95%", label: "Placement Rate"   },
  { icon: Clock,        value: "3–6", label: "Months Duration"  },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col bg-background overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center lg:pt-28 lg:pb-20 overflow-hidden">

        {/* Dot-grid background */}
        <div className="pointer-events-none absolute inset-0 -z-20 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px] dark:[background-image:radial-gradient(#1f2937_1px,transparent_1px)] opacity-60" />

        {/* Animated colour blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 -z-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute top-10 -right-24 -z-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl animate-float-slow delay-300" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-60 w-96 -translate-x-1/2 rounded-full bg-indigo-400/15 blur-3xl animate-float-slow delay-500" />

        {/* Badge */}
        <div className="animate-fade-up mb-6">
          <span className="shimmer-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 ring-1 ring-blue-200 dark:ring-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse-ring" />
            Internship Program 2026 · Now Open
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100 max-w-4xl text-5xl font-extrabold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl text-foreground">
          Launch your tech career with{" "}
          <span className="text-gradient">Lexa Internship</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up delay-200 mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A hands-on, mentor-led program designed for ambitious students ready to build real-world products in Web, Mobile, and Data engineering.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up delay-300 mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Apply Now
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/internship-information"
            className="inline-flex h-12 items-center justify-center rounded-full border bg-background/80 px-8 text-sm font-medium backdrop-blur-sm transition-all duration-200 hover:bg-muted hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Learn More
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up delay-400 mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-extrabold tracking-tight text-foreground">{value}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl w-full px-6">
        <hr className="border-border/60" />
      </div>

      {/* ── PROGRAMS ─────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14 animate-fade-up delay-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
            Choose Your Track
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Internship Programs
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            Three specialised tracks. One goal — turning students into job-ready engineers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {programs.map(({ icon: Icon, title, tag, desc, iconBg, iconColor, borderHover, linkColor, tagColor, delay }) => (
            <div
              key={title}
              className={`animate-fade-up ${delay} group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${borderHover}`}
            >
              {/* Hover glow overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent" />

              <div>
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold mb-3 ${tagColor}`}>
                  {tag}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-muted/50">
                <Link
                  href="/internship-information"
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${linkColor} transition-all group-hover:gap-2`}
                >
                  View program details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
