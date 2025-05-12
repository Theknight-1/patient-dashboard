import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getSession()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Acme Health</h1>
          </div>
          <UserNav user={user} />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-gray-50 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <DashboardNav />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
