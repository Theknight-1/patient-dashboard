"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Package, TrendingDown } from "lucide-react"
import { addMockShipments } from "@/actions/shipment-actions"
import WeightChart from "@/components/weight-chart"

export default function DashboardPage() {
  const [weightEntries, setWeightEntries] = useState<{ date: string; weight: number }[]>([])
  const [shipments, setShipments] = useState<{ status: string; medicationType: string }[]>([])

  useEffect(() => {
    async function fetchData() {
      const weightRes = await fetch("/api/weights/entries")
      const shipmentRes = await fetch("/api/shipments")

      const weights = await weightRes.json()
      const shipments = await shipmentRes.json()

      setWeightEntries(weights)
      setShipments(shipments)
    }

    fetchData()
  }, [])

  const handleAddMockData = async () => {
    await addMockShipments()
    // Optionally refetch data here
  }

  const weightData = weightEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    weight: entry.weight,
  }))

  const latestWeight = weightEntries.length > 0
    ? weightEntries[weightEntries.length - 1].weight
    : null

  const nextShipment = shipments.find(
    (shipment) => shipment.status === "processing" || shipment.status === "shipped"
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button variant="outline" size="sm" onClick={handleAddMockData}>
          Add Demo Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Weight Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestWeight ? `${latestWeight} kg` : "No data"}</div>
            <p className="text-xs text-muted-foreground">
              {weightEntries.length > 1
                ? `${latestWeight !== null ? (latestWeight - weightEntries[0].weight).toFixed(1) : "0"} kg since start`
                : "Add weight entries to track progress"}
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/weight" className="text-sm text-primary hover:underline">
              View weight history
            </Link>
          </CardFooter>
        </Card>

        {/* Next Shipment Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Shipment</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextShipment ? nextShipment.medicationType : "No upcoming shipments"}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextShipment ? `Status: ${nextShipment.status}` : "Check back later for updates"}
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/shipments" className="text-sm text-primary hover:underline">
              View all shipments
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/weight">
                <TrendingDown className="mr-2 h-4 w-4" />
                Log Weight
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/shipments">
                <Package className="mr-2 h-4 w-4" />
                Track Shipments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weight Progress Chart */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
          <CardDescription>Your weight tracking over time</CardDescription>
        </CardHeader>
        <CardContent>
          <WeightChart data={weightData} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto" asChild>
            <Link href="/dashboard/weight">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
