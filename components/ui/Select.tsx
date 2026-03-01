import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    const base =
      "block w-full rounded-md border border-gray-300 bg-white pl-4 pr-10 py-3 text-sm text-gray-900 transition-colors " +
      "hover:border-primary/50 hover:bg-gray-50/80 " +
      "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none focus:bg-white " +
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white " +
      "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat";
    return (
      <select ref={ref} className={`${base} ${className}`} {...props}>
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
