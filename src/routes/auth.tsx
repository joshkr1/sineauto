import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Sine Autos" },
      { name: "description", content: "Sign in or create your Sine Autos account." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ev = emailSchema.safeParse(email);
    const pv = passwordSchema.safeParse(password);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    if (!pv.success) return toast.error(pv.error.issues[0].message);

    setSubmitting(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: ev.data,
        password: pv.data,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: displayName || ev.data.split("@")[0] },
        },
      });
      setSubmitting(false);
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: ev.data, password: pv.data });
      setSubmitting(false);
      if (error) toast.error(error.message);
      else toast.success("Welcome back.");
    }
  };

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-sm bg-gradient-gold">
            <span className="font-display text-2xl font-bold text-charcoal">S</span>
          </div>
          <div className="mt-3 font-display text-xl tracking-wide text-foreground">SINE AUTOS</div>
        </Link>

        <div className="rounded-sm bg-gradient-card p-8 shadow-luxury">
          <h1 className="font-display text-3xl text-foreground text-balance">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to manage your inquiries and bookings." : "Join Sine Autos in under a minute."}
          </p>

          <button onClick={signInGoogle} type="button"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-sm border border-border bg-background py-3 text-sm font-medium text-foreground transition-all hover:border-gold">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" maxLength={100}
                className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required maxLength={255}
              className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required minLength={6} maxLength={72}
              className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
            <button type="submit" disabled={submitting}
              className="w-full rounded-sm bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-all hover:shadow-gold-glow disabled:opacity-60">
              {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>New here? <button onClick={() => setMode("signup")} className="text-gold hover:underline">Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode("signin")} className="text-gold hover:underline">Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1S8.7 5.9 12 5.9c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.1-1.6H12z" /></svg>
  );
}
