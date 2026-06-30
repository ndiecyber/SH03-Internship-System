import Link from "next/link";

type AuthCardProps = {
  mode: "login" | "register";
};

export function AuthCard({ mode }: Readonly<AuthCardProps>) {
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-lg border bg-card p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{isLogin ? "Login" : "Register"}</h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Access your internship workspace." : "Create an internship account."}
          </p>
        </div>
        <div className="mt-6 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Form implementation placeholder
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <Link className="font-medium text-primary" href={isLogin ? "/register" : "/login"}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </section>
    </main>
  );
}
