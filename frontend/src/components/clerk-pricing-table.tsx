import { PricingTable } from "@clerk/clerk-react";
import { ClerkPricingTableProps } from "@/types/props";

export function ClerkPricingTable({ className }: ClerkPricingTableProps) {
  return (
    <div className={className}>
      <PricingTable />
    </div>
  );
}
