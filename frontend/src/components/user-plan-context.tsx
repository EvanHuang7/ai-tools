import React, { createContext, useContext, useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { UserPlanProviderProps } from "@/types/props";
import { UserPlan, UserPlanContextType } from "@/types";

const UserPlanContext = createContext<UserPlanContextType | undefined>(
  undefined
);

export function UserPlanProvider({ children }: UserPlanProviderProps) {
  const [userPlan, setUserPlan] = useState<UserPlan>("Free");
  const [isLoading, setIsLoading] = useState(true);
  const { billing } = useClerk();

  const refreshUserPlan = async () => {
    setIsLoading(true);

    // Move this logic section out of try block, so that
    // isLoading won't be set to false when billing is not available.
    if (!billing || !billing.getSubscriptions) {
      console.warn("Billing is not available");
      return;
    }

    try {
      const userSubscriptions = await billing.getSubscriptions({
        initialPage: 1,
        pageSize: 10,
      });

      if (userSubscriptions.data && userSubscriptions.data.length > 0) {
        const activeSubscription = userSubscriptions.data.find(
          (subscription) => subscription.status === "active"
        );

        const planName = activeSubscription
          ? activeSubscription.plan.name
          : "Free";

        // Map Clerk plan names to our standardized plan types
        switch (planName.toLowerCase()) {
          case "standard":
          case "standard plan":
            setUserPlan("Standard");
            break;
          case "pro":
          case "pro plan":
          case "professional":
            setUserPlan("Pro");
            break;
          default:
            setUserPlan("Free");
        }
      } else {
        setUserPlan("Free");
      }
    } catch (err) {
      console.error("Failed to fetch user plan:", err);
      setUserPlan("Free");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserPlan();
  }, [billing]);

  const value: UserPlanContextType = {
    userPlan,
    isLoading,
    refreshUserPlan,
  };

  return (
    <UserPlanContext.Provider value={value}>
      {children}
    </UserPlanContext.Provider>
  );
}

export function useUserPlan() {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error("useUserPlan must be used within a UserPlanProvider");
  }
  return context;
}
