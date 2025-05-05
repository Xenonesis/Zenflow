import { UserButtonWrapper } from "@/components/user/UserButtonWrapper";
import { ModeToggle } from "@/components/health/ModeToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  mode: "physical" | "mental";
  onModeChange: (mode: "physical" | "mental") => void;
}

// Simple user button that doesn't depend on auth context
const SimpleUserButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="relative h-8 w-8 rounded-full"
      onClick={() => navigate('/settings')}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </Button>
  );
};

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="flex h-16 items-center justify-between border-b bg-white dark:bg-slate-900 dark:border-slate-700 px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-health-dark dark:text-white">ZenFlow</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ModeToggle mode={mode} onModeChange={onModeChange} />
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Notifications"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-health-primary">
                3
              </Badge>
            </Button>
            <ThemeToggle />
            {/* Use a simpler implementation that doesn't need auth context */}
            <SimpleUserButton />
          </div>
        </div>
      </div>
      <Navbar />
    </header>
  );
}
