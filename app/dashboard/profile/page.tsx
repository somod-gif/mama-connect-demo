"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Edit3,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { chewService } from "@/services/chew.service";
import { FadeInUp } from "@/app/components/animations";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const editSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid Nigerian phone number")
    .regex(/^(\+234|0)[789]\d{9}$/, "Please enter a valid Nigerian phone number"),
  preferredLanguage: z.string().min(1, "Please select your preferred language"),
});

type EditFormData = z.infer<typeof editSchema>;

const LANGUAGES = ["English", "Pidgin", "Yoruba", "Hausa", "Igbo"];

function EditProfileModal({
  profile,
  onClose,
}: {
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    preferredLanguage?: string;
  };
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: EditFormData) => chewService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chew", "profile"] });
      toast.success("Profile updated");
      onClose();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      preferredLanguage: profile.preferredLanguage || "English",
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Edit Personal Information</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-background-soft">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <input {...register("firstName")} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input {...register("lastName")} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
            <input {...register("phone")} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Language</label>
            <select {...register("preferredLanguage")} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.preferredLanguage && <p className="mt-1 text-xs text-red-500">{errors.preferredLanguage.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["chew", "profile"],
    queryFn: () => chewService.getProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const normalizeLga = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") return (val as { name: string }).name || "—";
    return "—";
  };

  const normalizeState = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") return (val as { name: string }).name || "—";
    if (profile?.lga && typeof profile.lga === "object") return (profile.lga as { state: { name: string } }).state?.name || "—";
    return "—";
  };

  const display = profile || user;

  const verificationBadge = () => {
    const status = display?.verificationStatus || "PENDING";
    if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
    if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Shield className="w-3 h-3" /> Pending</span>;
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">Your professional information</p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary bg-primary-light rounded-xl hover:bg-primary/20 transition-all sm:self-start"
        >
          <Edit3 className="w-4 h-4" />
          Edit Personal Information
        </button>
      </div>

      <FadeInUp>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {display?.firstName?.charAt(0)}{display?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {display?.firstName} {display?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{display?.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary-light text-primary-dark">
                  <Shield className="w-3 h-3" /> Community Health Extension Worker
                </span>
                {verificationBadge()}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Mail, label: "Email", value: display?.email },
              { icon: Phone, label: "Phone", value: display?.phone || "—" },
              { icon: MapPin, label: "State", value: normalizeState(profile?.state || profile?.lga) },
              { icon: MapPin, label: "LGA", value: normalizeLga(profile?.lga) },
              { icon: Building2, label: "Primary Healthcare Centre", value: profile?.primaryHealthcareCentre || "—" },
              { icon: Globe, label: "Preferred Language", value: profile?.preferredLanguage || "English" },
            ].map((field) => (
              <div key={field.label} className="flex items-start gap-3 p-4 rounded-xl bg-background-soft">
                <field.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>

      {showEdit && (
        <EditProfileModal
          profile={{
            firstName: display?.firstName,
            lastName: display?.lastName,
            phone: display?.phone,
            preferredLanguage: profile?.preferredLanguage,
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
