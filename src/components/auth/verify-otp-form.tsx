"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { publicAuthApi } from "@/lib/public-auth-api";
import { AuthShell } from "./auth-shell";

export function VerifyOtpForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") || "";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const otp = digits.join("");
    if (!email || otp.length !== 6) return toast.error("Enter the complete 6-digit OTP.");
    setPending(true);
    try {
      await publicAuthApi.verifyPasswordResetOtp(email, otp);
      toast.success("OTP verified.");
      router.push(`/new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid OTP.");
    } finally { setPending(false); }
  }

  async function resend() {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      await publicAuthApi.resendPasswordReset(email);
      setCooldown(60);
      toast.success("A new OTP has been sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to resend OTP.");
    } finally { setResending(false); }
  }

  return (
    <AuthShell narrow>
      <h1 className="text-[30px] font-bold leading-[1.15] text-[#24463d]">
        Enter OTP
      </h1>
      <p className="mt-2 text-[15px] leading-[1.45] text-[#8c8780]">
        An OTP has been sent to your email address. Please verify it below.
      </p>

      <form className="mt-8" onSubmit={verify}>
        <div className="grid grid-cols-6 gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              aria-label={`OTP digit ${index + 1}`}
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(-1);
                setDigits((current) =>
                  current.map((item, position) =>
                    position === index ? value : item,
                  ),
                );
                if (value) inputs.current[index + 1]?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index]) {
                  inputs.current[index - 1]?.focus();
                }
              }}
              className="h-16 min-w-0 border border-[#e7dfd2] bg-[#fbf9f4] text-center text-[24px] font-bold text-[#24463d] outline-none transition focus:border-[#cfac36]"
            />
          ))}
        </div>
        <p className="mt-4 text-center text-[13px] text-[#8c8780]">
          Didn&apos;t Receive OTP?{" "}
          <button
            type="button"
            disabled={cooldown > 0 || resending || !email}
            onClick={resend}
            className="font-semibold text-[#cfac36] transition hover:text-[#24463d] disabled:text-[#aaa]"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
                ? "Sending..."
                : "Resend OTP"}
          </button>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 flex h-14 w-full items-center justify-center bg-[#cfac36] px-6 text-[13px] font-bold uppercase tracking-[0.64px] text-white transition hover:bg-[#24463d] disabled:opacity-50"
        >
          {pending ? "Verifying..." : "Verify"}
        </button>
      </form>
    </AuthShell>
  );
}
