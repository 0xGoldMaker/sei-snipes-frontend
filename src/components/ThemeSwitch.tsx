"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div onClick={toggleTheme}>
      {theme === "dark" ? (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </>
      ) : (
        <>
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </>
      )}
    </div>
  );
}
