"use client";

interface NumpadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ",", "0", "←"];

export function Numpad({ value, onChange, placeholder = "0,00", disabled }: NumpadProps) {
  function press(key: string) {
    if (disabled) return;
    if (key === "←") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "," && value.includes(",")) return;
    if (key === "," && value === "") {
      onChange("0,");
      return;
    }
    if (key !== "," && value === "0" && key !== "0") {
      onChange(key);
      return;
    }
    if (value === "0" && key === "0") return;
    onChange(value + key);
  }

  const displayValue = value || placeholder;

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-2xl text-gray-900 tabular-nums">
        R$ {displayValue}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => press(key)}
            className="flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white font-mono text-lg font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
