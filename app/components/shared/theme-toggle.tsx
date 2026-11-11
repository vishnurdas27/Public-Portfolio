import { Moon, Sun } from "lucide-react";
import { applyTheme } from "~/lib/theme";

// both icons are always rendered and swapped with css, so server and client html match
export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark", true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className={`no-print inline-grid size-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-fg hover:bg-surface ${className}`}
    >
      <span className="hidden dark:block"><Sun size={17} aria-hidden /></span>
      <span className="dark:hidden"><Moon size={17} aria-hidden /></span>
    </button>
  );
}
