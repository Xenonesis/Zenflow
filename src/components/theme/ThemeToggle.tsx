
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-500 border-health-primary/20 hover:border-health-primary/40"
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun 
        className={`h-5 w-5 transition-all duration-500 ${
          theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
        } absolute text-health-primary`} 
      />
      <Moon 
        className={`h-5 w-5 transition-all duration-500 ${
          theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        } absolute`} 
      />
    </Button>
  );
}
