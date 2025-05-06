import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full bg-background/80 border shadow-sm"
    >
      <div className="relative h-4 w-4">
        {theme === "light" ? (
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.div>
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
