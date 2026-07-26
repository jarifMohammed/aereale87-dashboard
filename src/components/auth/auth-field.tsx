import type { InputHTMLAttributes, ReactNode } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function AuthField({
  id,
  label,
  icon,
  action,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className={`block ${className ?? ""}`}>
      <span className="text-[13px] font-semibold text-[#24463d]">{label}</span>
      <span className="mt-2 flex h-12 items-center border border-[#e7dfd2] bg-[#fbf9f4] px-3 transition focus-within:border-[#cfac36]">
        {icon ? (
          <span className="mr-3 text-[#8c8780]">{icon}</span>
        ) : null}
        <input
          id={id}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#24463d] outline-none placeholder:text-[#8c8780]"
          {...props}
        />
        {action}
      </span>
    </label>
  );
}
