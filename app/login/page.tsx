"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, HeartPulse, CheckCircle2, Sparkles, AlertCircle, Smartphone, KeyRound, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/errors";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState("/dashboard");
  const [authError, setAuthError] = useState<string | null>(null);
  const [mode, setMode] = useState<"password" | "phone">("password");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { login, loginWithOtp, isLoading, user, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  useEffect(() => {
    if (redirecting && isAuthenticated && user) {
      const timer = setTimeout(() => router.replace(redirectTarget), 800);
      return () => clearTimeout(timer);
    }
  }, [redirecting, isAuthenticated, user, router, redirectTarget]);

  const completeRedirect = () => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")) {
      setRedirectTarget(redirectParam);
    }
    setRedirecting(true);
  };

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await login(data);
      // Honour the redirect the middleware set (e.g. /community when the
      // session expired mid-browse) instead of always dumping on the dashboard.
      completeRedirect();
    } catch (error) {
      setAuthError(extractErrorMessage(error));
    }
  };

  const normalizePhoneInput = (value: string): string =>
    value.replace(/[^+0-9]/g, "");

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setAuthError(null);
    const phone = normalizePhoneInput(otpPhone);
    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      setAuthError("Enter a valid phone number, e.g. +234 800 000 0123");
      return;
    }
    setSendingOtp(true);
    try {
      const result = await authService.requestOtp(phone);
      setOtpSent(true);
      toast.success(result.devCode ? "Demo code shown in server console" : result.message);
    } catch (error) {
      setAuthError(extractErrorMessage(error));
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const phone = normalizePhoneInput(otpPhone);
    if (!/^[0-9]{6}$/.test(otpCode.trim())) {
      setAuthError("Enter the 6-digit code you received");
      return;
    }
    try {
      await loginWithOtp(phone, otpCode.trim());
      completeRedirect();
    } catch (error) {
      setAuthError(extractErrorMessage(error));
    }
  };

  const switchMode = (next: "password" | "phone") => {
    setMode(next);
    setAuthError(null);
    setOtpCode("");
  };

  const isPending = isLoading || isSubmitting;

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-primary-light/30 to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.02] blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,181,171,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,181,171,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="w-full max-w-md px-4 sm:px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/10 rounded-2xl blur-md group-hover:bg-primary/20 transition-all duration-500" />
              <Image
                src="/logo.png"
                alt="MamaConnect"
                width={56}
                height={56}
                priority
                className="relative rounded-2xl transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              Mama<span className="text-primary">Connect</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-10 shadow-xl shadow-primary/5"
        >
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-background-soft p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode("password")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                mode === "password"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Password
            </button>
            <button
              type="button"
              onClick={() => switchMode("phone")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                mode === "phone"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Phone code
            </button>
          </div>

          {mode === "password" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-foreground mb-1.5">
                Email or Phone Number
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="Email or phone number"
                autoComplete="username"
                spellCheck={false}
                autoCapitalize="none"
                aria-invalid={!!errors.identifier || !!authError}
                {...register("identifier")}
                disabled={isPending}
                className={inputClass}
              />
              {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  disabled={isPending}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-700">{authError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => toast.info("Password reset will be available soon")}
                className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartPulse className="w-4 h-4" />}
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
          ) : (
          <div className="space-y-5">
            {!otpSent ? (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label htmlFor="otp-phone" className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="otp-phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    autoComplete="tel"
                    inputMode="tel"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    disabled={sendingOtp}
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Mamas sign in with the number they use on WhatsApp. We&apos;ll send a 6-digit code to it.
                  </p>
                </div>

                <AnimatePresence>
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                      <p className="text-xs font-medium text-red-700">{authError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                >
                  {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                  {sendingOtp ? "Sending code..." : "Send code"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtpSubmit} className="space-y-5">
                <div className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <p className="text-xs font-medium text-green-700">
                    Code sent to {normalizePhoneInput(otpPhone)}. It expires in 10 minutes.
                  </p>
                </div>

                <div>
                  <label htmlFor="otp-code" className="block text-sm font-medium text-foreground mb-1.5">
                    6-Digit Code
                  </label>
                  <input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••••"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={isPending}
                    className={`${inputClass} text-center text-lg tracking-[0.5em] font-mono`}
                  />
                </div>

                <AnimatePresence>
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                      <p className="text-xs font-medium text-red-700">{authError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartPulse className="w-4 h-4" />}
                  {isPending ? "Signing in..." : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendingOtp}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-primary hover:text-primary-dark disabled:opacity-60 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${sendingOtp ? "animate-spin" : ""}`} />
                  {sendingOtp ? "Sending..." : "Resend code"}
                </button>
              </form>
            )}
          </div>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not a CHEW?{" "}
            <Link href="/mothers" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Mothers register via WhatsApp
            </Link>{" "}
            — then use{" "}
            <button type="button" onClick={() => switchMode("phone")} className="font-medium text-primary hover:text-primary-dark transition-colors">
              phone code sign-in
            </button>
          </p>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary/95 via-primary-dark/95 to-background/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                Login Successful
              </p>
              <p className="text-sm text-white/70">
                Redirecting to{" "}
                {redirectTarget === "/admin"
                  ? "Admin Panel"
                  : redirectTarget.startsWith("/community")
                    ? "Mama Circle"
                    : redirectTarget.startsWith("/passport")
                      ? "Your Passport"
                      : "Dashboard"}
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-white/50" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
