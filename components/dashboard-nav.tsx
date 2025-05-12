"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, LineChart, Package, User, Settings } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Weight Progress",
    href: "/dashboard/weight",
    icon: LineChart,
  },
  {
    title: "Shipments",
    href: "/dashboard/shipments",
    icon: Package,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium",
            pathname === item.href
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
