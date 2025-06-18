"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center gap-4">
        <span
          className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Monthly
        </span>
        <Switch checked={billingCycle === "yearly"} onCheckedChange={toggleBillingCycle} />
        <span
          className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Yearly
          <span className="ml-1 text-xs text-green-500 font-normal">Save 20%</span>
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Free Plan */}
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-500 cursor-magnetic",
            "border-border"
          )}
        >
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For individuals and small projects</CardDescription>
            <div className="mt-4 text-4xl font-bold">$0</div>
            <p className="text-sm text-muted-foreground">Forever free</p>
          </CardHeader>
          <CardContent className="p-8 relative z-10">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Up to 3 projects</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Up to 10 tasks per project</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Basic document editor</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>1 team member</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Community support</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full cursor-magnetic transition-all duration-300">
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-500 cursor-magnetic",
            "border-purple-600 shadow-lg relative"
          )}
        >
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-gradient-to-r from-purple-600 to-cyan-400 text-white text-xs font-medium px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For professionals and teams</CardDescription>
            <div className="mt-4 text-4xl font-bold">${billingCycle === "monthly" ? "12" : "9.60"}</div>
            <p className="text-sm text-muted-foreground">
              per user / {billingCycle === "monthly" ? "month" : "month, billed yearly"}
            </p>
          </CardHeader>
          <CardContent className="p-8 relative z-10">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited tasks</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced document editor</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Up to 10 team members</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>AI task suggestions</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button
              className={cn(
                "w-full bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 cursor-magnetic transition-all duration-300 text-white"
              )}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-500 cursor-magnetic",
            "border-border"
          )}
        >
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For large organizations</CardDescription>
            <div className="mt-4 text-4xl font-bold">${billingCycle === "monthly" ? "29" : "23.20"}</div>
            <p className="text-sm text-muted-foreground">
              per user / {billingCycle === "monthly" ? "month" : "month, billed yearly"}
            </p>
          </CardHeader>
          <CardContent className="p-8 relative z-10">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited team members</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced AI features</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>SSO & advanced security</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full cursor-magnetic transition-all duration-300">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
