import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  History, 
  Dumbbell, 
  Heart, 
  Settings, 
  Brain, 
  Info, 
  Bell,
  BookOpen
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainLinks = [
    { label: "Dashboard", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { label: "Calendar", path: "/calendar", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { label: "History", path: "/history", icon: <History className="h-4 w-4 mr-2" /> },
    { label: "Workouts", path: "/workouts", icon: <Dumbbell className="h-4 w-4 mr-2" /> },
    { label: "Mental Health", path: "/mental-health", icon: <Heart className="h-4 w-4 mr-2" /> },
  ];

  const updateLinks = [
    { label: "Latest Features", path: "/about?tab=updates", badge: "New" },
    { label: "Release Notes", path: "/about?tab=updates" },
    { label: "Roadmap", path: "/about?tab=updates" },
  ];

  return (
    <div className="sticky top-16 z-20 hidden md:flex justify-center items-center p-2 bg-white dark:bg-slate-800 border-b dark:border-slate-700 shadow-sm">
      <NavigationMenu>
        <NavigationMenuList>
          {mainLinks.map((link) => (
            <NavigationMenuItem key={link.path}>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center transition-all hover:text-health-primary",
                  isActive(link.path) 
                    ? "bg-health-soft dark:bg-slate-700 text-health-primary font-medium" 
                    : ""
                )}
              >
                <Link to={link.path}>
                  {link.icon}
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          
          <NavigationMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center transition-all hover:text-health-primary",
                      isActive("/ai-insights") 
                        ? "bg-health-soft dark:bg-slate-700 text-health-primary font-medium" 
                        : ""
                    )}
                  >
                    <Link to="/ai-insights">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Insights
                      <Badge variant="outline" className="ml-2 bg-health-primary text-white border-0 py-0 text-[10px]">
                        Beta
                      </Badge>
                    </Link>
                  </NavigationMenuLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Now with multiple AI model support!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className={
              isActive("/about") ? "bg-health-soft dark:bg-slate-700 text-health-primary font-medium" : ""
            }>
              <Info className="h-4 w-4 mr-2" />
              About
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[220px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className={cn(
                        "flex items-center select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive("/about") ? "bg-accent" : ""
                      )}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      <div className="text-sm font-medium">About ZenFlow</div>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {updateLinks.map((link, index) => (
                  <li key={index}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={link.path}
                        className="flex items-center select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium flex items-center">
                          {link.label}
                          {link.badge && (
                            <Badge variant="outline" className="ml-2 bg-health-primary text-white border-0 py-0 text-[10px]">
                              {link.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                "flex items-center transition-all hover:text-health-primary",
                isActive("/settings") ? "bg-health-soft dark:bg-slate-700 text-health-primary font-medium" : ""
              )}
            >
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
