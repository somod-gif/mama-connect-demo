"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Check, ArrowRight, ArrowLeft, HeartPulse } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { geographyService } from "@/lib/services/geography.service";
import { chewService } from "@/lib/services/chew.service";
import { toast } from "sonner";
import Image from "next/image";

const ROLES = [
  "Community Health Extension Worker (CHEW)",
  "Supervisor",
  "Healthcare Staff",
];

const LANGUAGES = [
  "English",
  "Pidgin",
  "Yoruba",
  "Hausa",
  "Igbo",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    state: "",
    lga: "",
    ward: "",
    primaryHealthcareCentre: "",
    role: "",
    preferredLanguage: "English",
  });

  const { data: states = [] } = useQuery({
    queryKey: ["geography", "states"],
    queryFn: () => geographyService.getStates(),
  });

  const { data: lgas = [], isFetching: lgasLoading } = useQuery({
    queryKey: ["geography", "lgas", form.state],
    queryFn: () => geographyService.getLGAs(form.state),
    enabled: !!form.state,
  });

  const { data: wards = [], isFetching: wardsLoading } = useQuery({
    queryKey: ["geography", "wards", form.lga],
    queryFn: () => geographyService.getWards(form.lga),
    enabled: !!form.lga,
  });

  const canContinue = () => {
    if (step === 1) {
      return !!(form.state && form.lga && form.ward && form.primaryHealthcareCentre && form.role);
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await chewService.updateProfile({
        state: form.state,
        lga: form.lga,
        ward: form.ward,
        primaryHealthcareCentre: form.primaryHealthcareCentre,
        role: form.role,
        preferredLanguage: form.preferredLanguage,
      });
      toast.success("Profile completed");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const setSelectedState = (id: string) => {
    setForm((prev) => ({ ...prev, state: id, lga: "", ward: "" }));
  };

  const setSelectedLGA = (id: string) => {
    setForm((prev) => ({ ...prev, lga: id, ward: "" }));
  };

  const steps = [
    {
      title: "Welcome to MamaConnect",
      content: (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
            <HeartPulse className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Welcome, {user?.firstName || "CHEW"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Let&apos;s set up your profile so you can start managing mothers in your community.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            This will only take a minute.
          </p>
        </div>
      ),
    },
    {
      title: "Professional Information",
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
            <select
              value={form.state}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select state</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">LGA</label>
            <select
              value={form.lga}
              onChange={(e) => setSelectedLGA(e.target.value)}
              disabled={!form.state || lgasLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">{lgasLoading ? "Loading..." : "Select LGA"}</option>
              {lgas.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Ward</label>
            <select
              value={form.ward}
              onChange={(e) => setForm((prev) => ({ ...prev, ward: e.target.value }))}
              disabled={!form.lga || wardsLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">{wardsLoading ? "Loading..." : "Select Ward"}</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Primary Healthcare Centre
            </label>
            <input
              type="text"
              value={form.primaryHealthcareCentre}
              onChange={(e) => setForm((prev) => ({ ...prev, primaryHealthcareCentre: e.target.value }))}
              placeholder="e.g. General Hospital, Gwagwalada"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Preferred Language
            </label>
            <select
              value={form.preferredLanguage}
              onChange={(e) => setForm((prev) => ({ ...prev, preferredLanguage: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="MamaConnect"
            width={48}
            height={48}
            className="rounded-xl mx-auto"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step
                    ? "bg-primary text-white"
                    : i === step
                    ? "bg-primary text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue()}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !canContinue()}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {submitting ? "Saving..." : "Go to Dashboard"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
