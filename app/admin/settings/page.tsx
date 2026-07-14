"use client";

import { LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Admin account settings</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
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

        <div className="border-t border-border pt-6">
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
