"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LogOut, Shield, Save, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { showApiError } from "@/lib/error-handler";

export default function AdminSettingsPage() {
  const { user, logout, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim());
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const profileMutation = useMutation({
    mutationFn: () => authService.updateProfile({ name: name || undefined, email: email || undefined, phone: phone || undefined }),
    onSuccess: (updatedUser) => {
      updateUser({ name: updatedUser.name || name, firstName: updatedUser.name?.split(" ")[0] || name.split(" ")[0], lastName: updatedUser.name?.split(" ").slice(1).join(" ") || name.split(" ").slice(1).join(" ") || "", email: updatedUser.email, phone: updatedUser.phone });
      toast.success("Profile updated");
    },
    onError: (err) => showApiError(err),
  });

  const passwordMutation = useMutation({
    mutationFn: () => authService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (err) => showApiError(err),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Admin account settings</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{user ? `${user.firstName} ${user.lastName}` : "Admin"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-[10px] font-medium rounded-full bg-primary-light text-primary-dark">
              <Shield className="w-3 h-3" /> Administrator
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50">
            {profileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        <div className="border-t border-border pt-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button onClick={() => passwordMutation.mutate()} disabled={passwordMutation.isPending || !currentPassword || !newPassword}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50">
            {passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            Update Password
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <button onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
