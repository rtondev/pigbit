"use client";

import { useState } from "react";

interface TabsProps {
  children: React.ReactNode;
  defaultActive?: number;
}

export function Tabs({ children, defaultActive = 0 }: TabsProps) {
  const [active, setActive] = useState(defaultActive);
  const items = Array.isArray(children) ? children : [children];
  const titles = items.map((child) => {
    if (child && typeof child === "object" && "props" in child && child.props?.title) {
      return child.props.title;
    }
    return "";
  });
  const content = items[active] as React.ReactElement | undefined;

  return (
    <div>
      <div className="mb-4 border-b border-gray-200">
        <ul className="-mb-px flex flex-wrap gap-4">
          {titles.map((title, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`cursor-pointer border-b-2 py-2 text-sm font-medium ${
                  i === active
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>{(content?.props as { children?: React.ReactNode })?.children ?? content}</div>
    </div>
  );
}

interface TabItemProps {
  title: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
}

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}
