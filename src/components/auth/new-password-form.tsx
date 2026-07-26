"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { publicAuthApi } from "@/lib/public-auth-api";
import { AuthShell } from "./auth-shell";
import { PasswordField } from "./password-field";

export function NewPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== form.get("confirmPassword")) return toast.error("Passwords do not match.");
    const email = params.get("email");
    const otp = params.get("otp");
    if (!email || !otp) return router.push("/forgot-password");
    setPending(true);
    try {
      await publicAuthApi.resetPassword(email, otp, password);
      toast.success("Password updated. You can now sign in.");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset password.");
    } finally { setPending(false); }
  }

  return (
    <AuthShell narrow>
      <h1 className="text-[30px] font-bold leading-[1.15] text-[#24463d]">
        New Password
      </h1>
      <p className="mt-2 text-[15px] leading-[1.45] text-[#8c8780]">
        Please create your new password.
      </p>

      <form className="mt-8 space-y-5" onSubmit={submit}>
        <PasswordField
          id="new-password"
          label="Create a password"
          name="password"
          placeholder="Create a password"
        />
        <PasswordField
          id="new-password-confirm"
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-14 w-full items-center justify-center bg-[#cfac36] px-6 text-[13px] font-bold uppercase tracking-[0.64px] text-white transition hover:bg-[#24463d] disabled:opacity-50"
        >
          {pending ? "Updating..." : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}
