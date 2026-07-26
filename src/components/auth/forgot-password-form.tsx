"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { publicAuthApi } from "@/lib/public-auth-api";
import { AuthField } from "./auth-field";
import { AuthShell } from "./auth-shell";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "").trim().toLowerCase();
    setPending(true);
    try {
      await publicAuthApi.forgotPassword(email);
      toast.success("If the account exists, a reset OTP has been sent.");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send OTP.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell narrow>
      <h1 className="text-[30px] font-bold leading-[1.15] text-[#24463d]">
        Forgot Password
      </h1>
      <p className="mt-2 text-[15px] leading-[1.45] text-[#8c8780]">
        Please enter the email address linked to your account. We&apos;ll send a
        one-time password (OTP) to your email for verification.
      </p>

      <form className="mt-6 space-y-5" onSubmit={submit}>
        <AuthField
          id="forgot-email"
          label="Email Address"
          name="email"
          type="email"
          required
          placeholder="hello@example.com"
          icon={<Mail className="size-4" />}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-14 w-full items-center justify-center bg-[#cfac36] px-6 text-[13px] font-bold uppercase tracking-[0.64px] text-white transition hover:bg-[#24463d] disabled:opacity-50"
        >
          {pending ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[#8c8780]">
        Back to{" "}
        <Link
          href="/"
          className="font-semibold text-[#cfac36] transition hover:text-[#24463d]"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
