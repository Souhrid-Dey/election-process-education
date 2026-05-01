/**
 * Button — reusable civic-themed button with variant support.
 *
 * TODO Phase 2:
 *  [ ] Variants: primary (blue), secondary (outlined), danger (red), ghost
 *  [ ] Sizes: sm, md, lg
 *  [ ] Loading state with spinner
 *  [ ] Full-width option
 */

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const VARIANT_STYLES = {
  primary: "bg-blue-700 text-white hover:bg-blue-800",
  secondary: "border-2 border-blue-700 text-blue-700 hover:bg-blue-50",
  ghost: "text-blue-700 hover:bg-blue-50",
};

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    >
      {/* TODO Phase 2: Add spinner when loading=true */}
      {children}
    </button>
  );
}
