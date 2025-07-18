import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useClerk,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
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
} from "lucide-react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [userPlan, setUserPlan] = useState("Free plan");

  // Test log for getting billing subscriptions info in frontend
  const { billing } = useClerk();
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await billing.getSubscriptions({
          initialPage: 1,
          pageSize: 10,
        });
        console.log("✅ subscriptionsResult in front-end", result);
        setUserPlan(result.data[0].plan.name);
      } catch (err) {
        console.error("❌ Failed to fetch subscriptions", err);
      }
    };
    fetch();
  }, [billing]); // include billing in deps

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold hidden xl:inline">
            AI Tools Studio
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
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
                to="/text-to-image"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Text to Image
              </Link>
              <Link
                to="/video-generator"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Video Generator
              </Link>
              <Link
                to="/audio-chat"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Audio Chat
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

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Badge variant="secondary" className="hidden sm:flex">
                {userPlan} plan
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
