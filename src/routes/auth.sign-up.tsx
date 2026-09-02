import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { deliveryLocations } from "@/lib/data";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState(deliveryLocations[0]);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success("Account created! Welcome to aQross.");
    navigate({ to: "/" });
  }

  return (
    /* items-start + pt-10 so content isn't clipped when virtual keyboard opens */
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pb-10 pt-10 sm:justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-12" />
        </div>

        <div className="neu rounded-3xl p-6 sm:p-8">
          <h1 className="mb-1 text-2xl font-bold">Create account</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Join aQross and start shopping in minutes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className="neu-pressed w-full rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

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

            {/* Institution */}
            <div>
              <label htmlFor="institution" className="mb-1.5 block text-sm font-semibold">
                Institution / Campus
              </label>
              <select
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="neu-pressed w-full rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
              >
                {deliveryLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/sign-in" className="font-semibold text-brand">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
