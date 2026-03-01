export function Card({ className = "", children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
