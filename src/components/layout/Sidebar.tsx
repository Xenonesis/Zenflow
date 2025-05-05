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
  Database
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
          size="icon"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Mobile overlay */}
        {isMobileExpanded && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
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
                  <Avatar className="h-8 w-8 border border-muted">
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
                  size="icon"
                  onClick={() => setIsMobileExpanded(false)}
                  className="rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <nav className="flex flex-1 flex-col gap-2 p-4 overflow-y-auto">
                <NavItem icon={Home} label="Dashboard" path="/" collapsed={false} active={isActive('/')} />
                <NavItem icon={Calendar} label="Calendar" path="/calendar" collapsed={false} active={isActive('/calendar')} />
                <NavItem icon={History} label="History" path="/history" collapsed={false} active={isActive('/history')} />
                <NavItem icon={Dumbbell} label="Workouts" path="/workouts" collapsed={false} active={isActive('/workouts')} />
                <NavItem icon={Heart} label="Mental Health" path="/mental-health" collapsed={false} active={isActive('/mental-health')} />
                <NavItem icon={Brain} label="AI Insights" path="/ai-insights" collapsed={false} active={isActive('/ai-insights')} />
                <NavItem icon={Info} label="About" path="/about" collapsed={false} active={isActive('/about')} />
                <NavItem icon={Settings} label="Settings" path="/settings" collapsed={false} active={isActive('/settings')} />
                <NavItem icon={Database} label="Data Manager" path="/data-manager" collapsed={false} active={isActive('/data-manager')} />
              </nav>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Regular desktop sidebar */}
        <div
          className={cn(
            "hidden md:flex h-screen flex-col border-r bg-background dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 sticky top-0 left-0",
            collapsed ? "w-16" : "w-64",
            className
          )}
        >
          <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
            {!collapsed ? (
              <Link to="/settings" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border border-muted">
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
            ) : (
              <Link to="/settings">
                <Avatar className="h-8 w-8 border border-muted">
                  <AvatarImage 
                    src={avatarUrl} 
                    alt={displayName} 
                  />
                  <AvatarFallback className="bg-health-tertiary text-white font-medium">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "rounded-full hover:bg-muted transition-all",
                collapsed ? "ml-0" : "ml-auto"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  collapsed ? "rotate-0" : "rotate-180"
                )}
              />
            </Button>
          </div>

          <nav className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto">
            <NavItem icon={Home} label="Dashboard" path="/" collapsed={collapsed} active={isActive('/')} />
            <NavItem icon={Calendar} label="Calendar" path="/calendar" collapsed={collapsed} active={isActive('/calendar')} />
            <NavItem icon={History} label="History" path="/history" collapsed={collapsed} active={isActive('/history')} />
            <NavItem icon={Dumbbell} label="Workouts" path="/workouts" collapsed={collapsed} active={isActive('/workouts')} />
            <NavItem icon={Heart} label="Mental Health" path="/mental-health" collapsed={collapsed} active={isActive('/mental-health')} />
            <NavItem icon={Brain} label="AI Insights" path="/ai-insights" collapsed={collapsed} active={isActive('/ai-insights')} />
            <NavItem icon={Info} label="About" path="/about" collapsed={collapsed} active={isActive('/about')} />
            <NavItem icon={Settings} label="Settings" path="/settings" collapsed={collapsed} active={isActive('/settings')} />
            <NavItem icon={Database} label="Data Manager" path="/data-manager" collapsed={collapsed} active={isActive('/data-manager')} />
          </nav>
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
    <div className="w-full">
      <Link 
        to={path} 
        className={cn(
          "flex justify-start gap-3 transition-all hover:scale-105 w-full rounded-md text-sm py-2",
          collapsed ? "px-2" : "px-3",
          active 
            ? "bg-health-primary text-white hover:bg-health-primary hover:text-white" 
            : "hover:bg-accent"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    </div>
  );
}
