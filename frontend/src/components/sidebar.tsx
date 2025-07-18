import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Image,
  Wand2,
  Video,
  Mic,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Image Editor", href: "/image-editor", icon: Image },
  { name: "Text to Image", href: "/text-to-image", icon: Wand2 },
  { name: "Audio Chat", href: "/audio-chat", icon: Mic },
  { name: "Video Generator", href: "/video-generator", icon: Video },
];

export function Sidebar() {
  const location = useLocation();
  const { openUserProfile } = useClerk();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // sm breakpoint
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-2 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full transition-all duration-200",
                    isActive && "bg-secondary",
                    isCollapsed ? "justify-center px-2" : "justify-start"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-3")}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-3">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            onClick={() => openUserProfile()}
            title={isCollapsed ? "Account Settings" : undefined}
          >
            <Settings
              className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-3")}
            />
            {!isCollapsed && (
              <>
                <span className="truncate">Account Settings</span>
                <ExternalLink className="ml-auto h-3 w-3" />
              </>
            )}
          </Button>
        </nav>
      </div>
    </div>
  );
}
