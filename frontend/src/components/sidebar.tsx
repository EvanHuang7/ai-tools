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

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
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
            className="w-full justify-start"
            onClick={() => openUserProfile()}
          >
            <Settings className="mr-3 h-4 w-4" />
            Account Settings
            <ExternalLink className="ml-auto h-3 w-3" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
