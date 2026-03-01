type BadgeVariant = "info" | "success" | "warning" | "failure";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  info: "bg-primary/20 text-secondary",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  failure: "bg-red-100 text-red-800",
};

export function Badge({ variant = "info", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
