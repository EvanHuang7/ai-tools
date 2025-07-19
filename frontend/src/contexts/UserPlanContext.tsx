import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useClerk } from "@clerk/clerk-react";

export type UserPlan = "Free" | "Standard" | "Pro";

interface UserPlanContextType {
  userPlan: UserPlan;
  isLoading: boolean;
  refreshUserPlan: () => Promise<void>;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(
  undefined
);

interface UserPlanProviderProps {
  children: ReactNode;
}

export function UserPlanProvider({ children }: UserPlanProviderProps) {
  const [userPlan, setUserPlan] = useState<UserPlan>("Free");
  const [isLoading, setIsLoading] = useState(true);
  const { billing } = useClerk();

  const refreshUserPlan = async () => {
    setIsLoading(true);
    try {
      if (!billing || !billing.getSubscriptions) {
        console.warn("Billing is not available");
        return;
      }

      const result = await billing.getSubscriptions({
        initialPage: 1,
        pageSize: 10,
      });

      // TODO: remove test logs
      console.log("result", result);
      if (result.data && result.data.length > 0) {
        const planName = result.data[0].plan.name;
        console.log("planName", planName);

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
