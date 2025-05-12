import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const user = await getSession()
  if (user) redirect("/dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Acme Health</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid items-center gap-6 py-12 md:py-24 lg:grid-cols-2 lg:py-32">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Track Your Weight Loss Journey
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Monitor your progress, track your medication shipments, and achieve your weight loss goals with Acme
              Health.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="/placeholder.svg?height=500&width=500"
              alt="Dashboard Preview"
              className="rounded-lg object-cover"
              width={500}
              height={500}
            />
          </div>
        </section>

        <section className="container mx-auto py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Features</h2>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Everything you need to track your weight loss journey
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Weight Tracking</h3>
              <p className="text-center text-muted-foreground">
                Log your weight and track your progress over time with visual charts.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                  <path d="M4 12H2" />
                  <path d="M10 12H8" />
                  <path d="M16 12h-2" />
                  <path d="M22 12h-2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Shipment Tracking</h3>
              <p className="text-center text-muted-foreground">
                Monitor your medication shipments and get updates on delivery status.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Progress Insights</h3>
              <p className="text-center text-muted-foreground">
                Get insights into your weight loss journey with detailed analytics.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Acme Health. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
