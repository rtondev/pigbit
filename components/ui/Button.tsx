import { forwardRef } from "react";

type ButtonVariant = "primary" | "gray" | "dark" | "failure" | "success" | "outline";
type ButtonSize = "xs" | "sm" | "md" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
  gray: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
  dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-600",
  failure: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-3 py-2 text-xs",
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3 text-sm",
  xl: "px-8 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-full font-semibold cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
