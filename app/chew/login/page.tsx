"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, HeartPulse } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function ChewLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Toast handles error display
    }
  };

  const isPending = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your CHEW workspace
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-foreground mb-1.5">
                Email or Phone Number
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="Email or phone number"
                {...register("identifier")}
                disabled={isPending}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.identifier && (
                <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>
              )}
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
                  {...register("password")}
                  disabled={isPending}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <HeartPulse className="w-4 h-4" />
              )}
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not a CHEW?{" "}
            <Link
              href="/mothers"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Mothers register via WhatsApp
            </Link>
          </p>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link
              href="/chew/register"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
