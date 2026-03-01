export function Table({ className = "", children, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className={`w-full text-left text-sm text-gray-600 ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ className = "", children, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead className={`bg-gray-50 text-xs uppercase text-gray-700 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableHeadRow({ className = "", children, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableBody({ className = "", children, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={className} {...props}>{children}</tbody>;
}

export function TableRow({ className = "", children, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ className = "", children, ...props }: React.ComponentProps<"td">) {
  return <td className={`px-6 py-4 ${className}`} {...props}>{children}</td>;
}

export function TableHeadCell({ className = "", children, ...props }: React.ComponentProps<"th">) {
  return <th className={`px-6 py-3 ${className}`} {...props}>{children}</th>;
}
