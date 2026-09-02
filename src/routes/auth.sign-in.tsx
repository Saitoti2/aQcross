import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Welcome back!");
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo className="h-10" />
        </div>

        <div className="neu rounded-3xl p-6 sm:p-8">
          <h1 className="mb-1 text-2xl font-bold">Sign in</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Welcome back — let's get you shopping.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@campus.ac.ke"
                  className="neu-pressed w-full rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="neu-pressed w-full rounded-2xl py-3 pl-10 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-brand">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            New to aQross?{" "}
            <Link to="/auth/sign-up" className="font-semibold text-brand">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
