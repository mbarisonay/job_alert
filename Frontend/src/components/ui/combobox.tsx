import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";

type ComboboxProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Allow selecting multiple values (comma-separated display) */
  multiple?: boolean;
  multipleValues?: string[];
  onMultipleChange?: (values: string[]) => void;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Ara...",
  className,
  multiple = false,
  multipleValues = [],
  onMultipleChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")),
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const displayValue = multiple
    ? multipleValues.join(", ")
    : value;

  function handleSelect(item: string) {
    if (multiple && onMultipleChange) {
      const exists = multipleValues.includes(item);
      if (exists) {
        onMultipleChange(multipleValues.filter((v) => v !== item));
      } else {
        onMultipleChange([...multipleValues, item]);
      }
      setQuery("");
    } else {
      onChange(item);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors text-left",
          "border-slate-300 bg-white text-slate-900 hover:border-slate-400",
          "dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-600",
          open && "border-emerald-500 ring-1 ring-emerald-500 dark:border-emerald-500",
        )}
      >
        <span className={cn("truncate", !displayValue && "text-slate-400")}>
          {displayValue || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Aramak için yazın..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-center text-xs text-slate-400">
                Sonuç bulunamadı
              </p>
            ) : (
              filtered.map((item) => {
                const isSelected = multiple
                  ? multipleValues.includes(item)
                  : item === value;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                    )}
                  >
                    {multiple && (
                      <span
                        className={cn(
                          "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                          isSelected
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 dark:border-slate-600",
                        )}
                      >
                        {isSelected && "✓"}
                      </span>
                    )}
                    {item}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
