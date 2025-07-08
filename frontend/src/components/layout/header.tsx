import { Link } from "react-router-dom";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">AI Tools Studio</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {isSignedIn && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/image-editor"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Image Editor
              </Link>
              <Link
                to="/text-to-image"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Text to Image
              </Link>
              <Link
                to="/video-generator"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Video Generator
              </Link>
              <Link
                to="/audio-chat"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Audio Chat
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Badge variant="secondary" className="hidden sm:flex">
                Free Plan
              </Badge>
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
