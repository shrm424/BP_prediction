import { useEffect, useState } from "react";
import { isUserLoggedIn } from "./authUtils";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const loggedIn = isUserLoggedIn();

  useEffect(() => {
    if (loggedIn) {
      const prefersDark =
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(prefersDark);
    }
  }, [loggedIn]);

  useEffect(() => {
    const root = document.documentElement;
    if (loggedIn) {
      if (isDark) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, loggedIn]);

  if (!loggedIn) return null;

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-gray-600 transition"
      title="Toggle Theme"
    >
      {isDark ? (
        <Sun className="text-yellow-400 w-6 h-6" />
      ) : (
        <Moon className="text-gray-800 dark:text-white w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;
