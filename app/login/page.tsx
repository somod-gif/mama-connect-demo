"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, HeartPulse } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not a CHEW?{" "}
            <Link href="/mothers" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Mothers register via WhatsApp
            </Link>
          </p>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
