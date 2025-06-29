import { PricingTable } from '@clerk/clerk-react'

interface ClerkPricingTableProps {
  className?: string
}

export function ClerkPricingTable({ className }: ClerkPricingTableProps) {
  return (
    <div className={className}>
      <PricingTable />
    </div>
  )
}