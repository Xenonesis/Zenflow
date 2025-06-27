
import { cn } from "@/lib/utils";
import { Dumbbell, Heart } from "lucide-react";

interface ModeToggleProps {
  mode: "physical" | "mental";
  onModeChange: (mode: "physical" | "mental") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center rounded-full border p-1">
      <button
        onClick={() => onModeChange("physical")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          mode === "physical"
            ? "bg-health-physical text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <Dumbbell className="h-4 w-4" />
        <span>Physical</span>
      </button>
      <button
        onClick={() => onModeChange("mental")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          mode === "mental"
            ? "bg-health-mental text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <Heart className="h-4 w-4" />
        <span>Mental</span>
      </button>
    </div>
  );
}
