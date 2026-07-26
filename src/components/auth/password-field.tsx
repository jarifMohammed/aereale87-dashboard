"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { AuthField } from "./auth-field";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  name: string;
  minLength?: number;
};

export function PasswordField({
  id,
  label,
  placeholder = "••••••••",
  name,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      name={name}
      required
      minLength={minLength ?? 8}
      icon={<LockKeyhole className="size-4" />}
      action={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="ml-2 text-[#2f5a4d] transition-colors hover:text-[#cfac36]"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}
