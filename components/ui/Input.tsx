import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    const base =
      "block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors " +
      "placeholder:text-gray-400 " +
      "hover:border-primary/50 hover:bg-gray-50/80 " +
      "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none focus:bg-white " +
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white";
    return (
      <input ref={ref} className={`${base} ${className}`} {...props} />
    );
  }
);

Input.displayName = "Input";
