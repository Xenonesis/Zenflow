import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink, Bell, Search, Menu, Settings, ShieldCheck } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Activity, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  mode: "physical" | "mental";
  onModeChange: (mode: "physical" | "mental") => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  const { signOut, user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-health-primary">
              ZenFlow
            </h1>
          </div>
          
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) onModeChange(value as "physical" | "mental");
            }}
            className="hidden md:flex bg-muted/50 p-1 rounded-full"
          >
            <ToggleGroupItem 
              value="physical" 
              aria-label="Physical Health Mode"
              className="relative h-8 rounded-full data-[state=on]:shadow-none data-[state=on]:bg-transparent data-[state=on]:text-primary"
            >
              {mode === "physical" && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-white dark:bg-sidebar-accent shadow-sm dark:shadow-gray-800/40"
                  layoutId="modeBg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Activity className="h-4 w-4 mr-2" />
              <span className="text-sm">Physical</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="mental" 
              aria-label="Mental Health Mode"
              className="relative h-8 rounded-full data-[state=on]:shadow-none data-[state=on]:bg-transparent data-[state=on]:text-primary"
            >
              {mode === "mental" && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-white dark:bg-sidebar-accent shadow-sm dark:shadow-gray-800/40"
                  layoutId="modeBg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Heart className="h-4 w-4 mr-2" />
              <span className="text-sm">Mental</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex-1 px-2 mx-4">
          {showSearch ? (
            <div className="relative max-w-md mx-auto">
              <Input 
                placeholder="Search..."
                className="pr-8 h-9 focus-visible:ring-health-primary"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
              <Search className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            <div className="hidden sm:flex sm:justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground" 
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                <span>Search...</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative rounded-full h-8 w-8 flex items-center justify-center" 
                size="icon"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-health-primary">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className={`h-2 w-2 mt-1.5 rounded-full ${i === 1 ? 'bg-health-primary' : 'bg-mental-primary'}`} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {i === 1 ? 'Workout reminder' : i === 2 ? 'New milestone reached!' : 'Mindfulness session is due'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i === 1 ? "Don't forget your scheduled workout today" : i === 2 ? "You've reached 10 consecutive days of exercise" : "Your daily mindfulness session is waiting for you"}
                        </p>
                        <p className="text-xs text-muted-foreground">{i === 1 ? '10 minutes ago' : i === 2 ? '1 hour ago' : '2 hours ago'}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center">
                <Link to="/notifications" className="text-sm text-health-primary font-medium">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="rounded-full h-8 w-8 p-0" 
                size="icon"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.email || "User"} />
                  <AvatarFallback className="bg-health-primary text-white">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  <span>Admin</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile toggle group */}
      <div className="md:hidden px-4 pb-3">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) onModeChange(value as "physical" | "mental");
          }}
          className="w-full bg-muted/50 p-1 rounded-full"
        >
          <ToggleGroupItem 
            value="physical" 
            aria-label="Physical Health Mode"
            className={cn(
              "relative flex-1 h-9 rounded-full text-sm data-[state=on]:shadow-none data-[state=on]:text-primary",
              mode === "physical" ? "data-[state=on]:bg-white dark:data-[state=on]:bg-sidebar-accent" : ""
            )}
          >
            <Activity className="h-4 w-4 mr-2" />
            Physical
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="mental" 
            aria-label="Mental Health Mode"
            className={cn(
              "relative flex-1 h-9 rounded-full text-sm data-[state=on]:shadow-none data-[state=on]:text-primary",
              mode === "mental" ? "data-[state=on]:bg-white dark:data-[state=on]:bg-sidebar-accent" : ""
            )}
          >
            <Heart className="h-4 w-4 mr-2" />
            Mental
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
