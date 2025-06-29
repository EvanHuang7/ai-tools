import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/clerk-react";
import { ClerkPricingTable } from "@/components/billing/pricing-table";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Zap,
  Crown,
  ExternalLink,
} from "lucide-react";

export function Settings() {
  const { user } = useUser();

  // Check subscription status using publicMetadata
  const userPlan = (user?.publicMetadata?.plan as string) || "free";
  const hasPro = userPlan === "pro" || userPlan === "enterprise";
  const hasEnterprise = userPlan === "enterprise";

  const currentPlan = hasEnterprise ? "Enterprise" : hasPro ? "Pro" : "Free";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="grid gap-8">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        {user?.firstName || "Not set"}
                      </div>
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        {user?.lastName || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      {user?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              {/* Subscription Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription & Billing
                  </CardTitle>
                  <CardDescription>
                    Manage your subscription and billing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Plan Status */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{currentPlan} Plan</h3>
                        <Badge
                          variant={
                            currentPlan === "Free" ? "secondary" : "default"
                          }
                        >
                          {currentPlan === "Free" ? "Current" : "Active"}
                        </Badge>
                        {currentPlan !== "Free" && (
                          <Badge variant="secondary" className="text-amber-600">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentPlan === "Free"
                          ? "100 credits per month"
                          : currentPlan === "Pro"
                          ? "Unlimited credits and premium features"
                          : "Enterprise features with priority support"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {currentPlan === "Free"
                            ? "53 credits left"
                            : "Unlimited"}
                        </span>
                      </div>
                      {currentPlan === "Free" && (
                        <p className="text-xs text-muted-foreground">
                          Resets in 12 days
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Billing Management */}
                  {currentPlan !== "Free" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Billing Portal</h4>
                          <p className="text-sm text-muted-foreground">
                            Manage your subscription, update payment methods,
                            and view invoices
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Portal
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Pricing Table for Plan Changes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Change Plan</h4>
                      {currentPlan !== "Free" && (
                        <Badge variant="outline">Current: {currentPlan}</Badge>
                      )}
                    </div>
                    <ClerkPricingTable />
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription>Customize your interface</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <Select defaultValue="light">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Control your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Processing Complete</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when AI processing is done
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-semibold">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your active login sessions
                      </p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div>
                      <h3 className="font-semibold text-destructive">
                        Delete Account
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
