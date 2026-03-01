interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ className = "", children, ...props }: LabelProps) {
  return (
    <label className={`mb-1 block text-sm font-medium text-gray-900 ${className}`} {...props}>
      {children}
    </label>
  );
}
