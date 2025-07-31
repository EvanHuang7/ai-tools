import { Link } from "react-router-dom";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { useUserPlan } from "@/components/user-plan-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  LayoutDashboard,
  Image,
  Wand2,
  Video,
  Mic,
  DollarSign,
  Loader2,
} from "lucide-react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { userPlan, isLoading } = useUserPlan();

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 pl-4 items-center justify-between">
        {/* Left section, App Icon */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold hidden xl:inline">
            AI Tools Studio
          </span>
        </Link>

        {/* Middle Section */}
        <nav className="hidden lg:flex items-center space-x-6">
          {isSignedIn && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/image-editor"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Image className="h-4 w-4" />
                Image Editor
              </Link>
              <Link
                to="/image-generator"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Image Generator
              </Link>
              <Link
                to="/audio-chat"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Audio Chat
              </Link>
              <Link
                to="/video-generator"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Video Generator
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Pricing
              </Link>
            </>
          )}
        </nav>

        {/* Right section, App Icon */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Badge variant="secondary">{userPlan} plan</Badge>
              )}
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
