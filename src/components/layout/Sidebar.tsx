import { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Home,
  Settings,
  User,
  Dumbbell,
  Heart,
  History,
  Menu,
  Calendar,
  Brain,
  X,
  Info,
  LayoutDashboard,
  LineChart,
  Database,
  HeartPulse,
  ChevronLeft
} from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userData } from "@/lib/supabase";
import { buttonVariants } from "@/components/ui/button";

// Safe wrapper for useAuth to prevent crashes
function useSafeAuth() {
  try {
    return useAuth();
  } catch (error) {
    // Return a default auth object if the hook fails
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => { throw new Error("Auth context not available"); },
      logout: () => {},
      register: async () => { throw new Error("Auth context not available"); }
    };
  }
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const [hasError, setHasError] = useState(false);
  const { user } = useSafeAuth();
  const [profileData, setProfileData] = useState<any>(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        // Get profile data from localStorage first for immediate display
        const cachedProfile = localStorage.getItem('user_profile');
        if (cachedProfile) {
          setProfileData(JSON.parse(cachedProfile));
        }
        
        // Mock profile data if we're in demo mode
        if (user.email === "demo@example.com") {
          const mockProfile = {
            full_name: user.name || "Demo User",
            avatar_url: user.avatar || "https://ui-avatars.com/api/?name=Demo+User&background=8B5CF6&color=fff"
          };
          setProfileData(mockProfile);
          localStorage.setItem('user_profile', JSON.stringify(mockProfile));
          return;
        }
        
        // Then fetch fresh data from Supabase
        const { data } = await userData.getUserProfile(user.id);
        if (data) {
          setProfileData(data);
          // Cache the profile data
          localStorage.setItem('user_profile', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Use fallback data on error
        const fallbackProfile = {
          full_name: user.name || "User",
          avatar_url: user.avatar
        };
        setProfileData(fallbackProfile);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  // Get name and avatar from profile or user data
  const displayName = profileData?.full_name || user?.name || "User";
  const avatarUrl = profileData?.avatar_url || user?.avatar || `https://ui-avatars.com/api/?name=${displayName}&background=8B5CF6&color=fff`;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileExpanded(false);
  }, [location.pathname]);

  // Add overflow hidden to body when mobile sidebar is expanded
  useEffect(() => {
    if (isMobileExpanded) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileExpanded]);

  // If sidebar has an error, render a simplified version
  if (hasError) {
    return (
      <div className="hidden md:flex h-screen w-16 flex-col border-r bg-background dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 sticky top-0 left-0">
        <div className="flex items-center justify-center border-b p-4 dark:border-slate-700">
          <Avatar className="h-8 w-8 border border-muted">
            <AvatarFallback className="bg-health-tertiary text-white font-medium">
              U
            </AvatarFallback>
          </Avatar>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    );
  }

  try {
    return (
      <>
        {/* Mobile hamburger menu - visible only on small screens */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="fixed top-4 left-4 z-50 md:hidden bg-background/90 backdrop-blur-sm border shadow-sm rounded-full"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Mobile overlay */}
        {isMobileExpanded && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in"
            onClick={() => setIsMobileExpanded(false)}
          />
        )}
        
        <Collapsible
          open={isMobileExpanded}
          onOpenChange={setIsMobileExpanded}
          className="md:hidden"
        >
          <CollapsibleContent className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r shadow-lg animate-slide-in-right dark:border-slate-700 overflow-y-auto">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
                {/* User avatar and name in mobile sidebar */}
                <Link to="/settings" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border border-muted ring-2 ring-primary/20">
                    <AvatarImage 
                      src={avatarUrl} 
                      alt={displayName} 
                    />
                    <AvatarFallback className="bg-health-tertiary text-white font-medium">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{displayName}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsMobileExpanded(false)}
                  className="rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <NavItem
                  icon={Home}
                  label="Dashboard"
                  path="/"
                  collapsed={false}
                  active={isActive("/")}
                />
                <NavItem
                  icon={Calendar}
                  label="Calendar"
                  path="/calendar"
                  collapsed={false}
                  active={isActive("/calendar")}
                />
                <NavItem
                  icon={Dumbbell}
                  label="Workouts"
                  path="/workouts"
                  collapsed={false}
                  active={isActive("/workouts")}
                />
                <NavItem
                  icon={Heart}
                  label="Health Metrics"
                  path="/health-metrics"
                  collapsed={false}
                  active={isActive("/health-metrics")}
                />
                <NavItem
                  icon={Brain}
                  label="Mental Health"
                  path="/mental-health"
                  collapsed={false}
                  active={isActive("/mental-health")}
                />
                <NavItem
                  icon={LineChart}
                  label="AI Insights"
                  path="/ai-insights"
                  collapsed={false}
                  active={isActive("/ai-insights")}
                />
                <NavItem
                  icon={History}
                  label="History"
                  path="/history"
                  collapsed={false}
                  active={isActive("/history")}
                />
                <NavItem
                  icon={Database}
                  label="Data Manager"
                  path="/data-manager"
                  collapsed={false}
                  active={isActive("/data-manager")}
                />
                <NavItem
                  icon={Settings}
                  label="Settings"
                  path="/settings"
                  collapsed={false}
                  active={isActive("/settings")}
                />
                <NavItem
                  icon={Info}
                  label="About"
                  path="/about"
                  collapsed={false}
                  active={isActive("/about")}
                />
              </nav>
              <div className="p-4 border-t dark:border-slate-700">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/test">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Test Page
                  </Link>
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Desktop sidebar */}
        <div
          className={cn(
            "hidden md:flex h-screen flex-col border-r bg-sidebar dark:bg-sidebar-background dark:border-sidebar-border transition-all duration-300 ease-in-out sticky top-0 left-0 z-30",
            collapsed ? "w-16" : "w-64",
            className
          )}
        >
          <div className="flex h-14 items-center justify-between border-b dark:border-sidebar-border p-4">
            {!collapsed && (
              <Link 
                to="/"
                className="flex items-center gap-2 font-semibold text-xl tracking-tight text-sidebar-foreground truncate"
              >
                <HeartPulse className="h-5 w-5 text-health-primary" />
                <span className="text-health-primary">Mindful</span>
              </Link>
            )}
            {collapsed && (
              <Link to="/" className="mx-auto">
                <HeartPulse className="h-6 w-6 text-health-primary" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "rounded-full hover:bg-sidebar-accent",
                collapsed && "mx-auto"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <NavItem
              icon={Home}
              label="Dashboard"
              path="/"
              collapsed={collapsed}
              active={isActive("/")}
            />
            <NavItem
              icon={Calendar}
              label="Calendar"
              path="/calendar"
              collapsed={collapsed}
              active={isActive("/calendar")}
            />
            <NavItem
              icon={Dumbbell}
              label="Workouts"
              path="/workouts"
              collapsed={collapsed}
              active={isActive("/workouts")}
            />
            <NavItem
              icon={Heart}
              label="Health Metrics"
              path="/health-metrics"
              collapsed={collapsed}
              active={isActive("/health-metrics")}
            />
            <NavItem
              icon={Brain}
              label="Mental Health"
              path="/mental-health"
              collapsed={collapsed}
              active={isActive("/mental-health")}
            />
            <NavItem
              icon={LineChart}
              label="AI Insights"
              path="/ai-insights"
              collapsed={collapsed}
              active={isActive("/ai-insights")}
            />
            <NavItem
              icon={History}
              label="History"
              path="/history"
              collapsed={collapsed}
              active={isActive("/history")}
            />
            <NavItem
              icon={Database}
              label="Data Manager"
              path="/data-manager"
              collapsed={collapsed}
              active={isActive("/data-manager")}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              path="/settings"
              collapsed={collapsed}
              active={isActive("/settings")}
            />
            <NavItem
              icon={Info}
              label="About"
              path="/about"
              collapsed={collapsed}
              active={isActive("/about")}
            />
          </nav>

          <div className={cn(
            "border-t p-3 dark:border-sidebar-border",
            collapsed ? "flex justify-center" : ""
          )}>
            {!collapsed ? (
              <Link
                to="/settings"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full justify-start px-2"
                )}
              >
                <Avatar className="h-6 w-6 mr-2 ring-1 ring-primary/20">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-health-tertiary text-white text-xs font-medium">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{displayName}</span>
              </Link>
            ) : (
              <Link to="/settings">
                <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-health-tertiary text-white text-xs font-medium">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    // If an error occurs during rendering, set the error state and render the simplified sidebar
    setHasError(true);
    return (
      <div className="hidden md:flex h-screen w-16 flex-col border-r bg-background dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 sticky top-0 left-0">
        <div className="flex items-center justify-center border-b p-4 dark:border-slate-700">
          <Avatar className="h-8 w-8 border border-muted">
            <AvatarFallback className="bg-health-tertiary text-white font-medium">
              U
            </AvatarFallback>
          </Avatar>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    );
  }
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed: boolean;
  active?: boolean;
}

function NavItem({ icon: Icon, label, path, collapsed, active }: NavItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors",
          isActive &&
            "bg-sidebar-accent text-sidebar-foreground font-medium before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary",
          collapsed && "justify-center px-0 before:left-0 before:w-0.5"
        )
      }
    >
      <Icon className={cn("h-4 w-4 flex-shrink-0", active && "text-primary")} />
      {!collapsed && (
        <span className="text-sm truncate">{label}</span>
      )}
      {collapsed && (
        <span className="sr-only">{label}</span>
      )}
    </NavLink>
  );
}
