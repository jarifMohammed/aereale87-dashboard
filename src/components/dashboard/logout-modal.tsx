"use client";

import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoggingOut}
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Header Icon */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <LogOut className="size-7" />
        </div>

        {/* Modal Content */}
        <div className="mt-5 text-center">
          <h3 className="text-xl font-bold text-zinc-900">Confirm Logout</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Are you sure you want to log out of your account? You will need to
            sign in again to access your dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="w-1/2 rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            className="w-1/2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
