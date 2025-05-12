"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { WeightForm } from "@/components/weight-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function WeightProgressPage() {
  const [weightEntries, setWeightEntries] = useState<{ date: string; weight: number; notes?: string; id: string }[]>([])
  const [profile, setProfile] = useState<{ height?: number } | null>(null)

  useEffect(() => {
    async function fetchData() {
      const [weightsRes, profileRes] = await Promise.all([
        fetch("/api/weights/entries"),
        fetch("/api/weights/profile"),
      ])

      const weights = await weightsRes.json()
      const profile = await profileRes.json()

      setWeightEntries(weights)
      setProfile(profile)
    }

    fetchData()
  }, [])

  const weightData = weightEntries.map((entry) => ({
    date: format(new Date(entry.date), "MMM dd"),
    weight: entry.weight,
  }))

  const startWeight = weightEntries.length > 0 ? weightEntries[0].weight : 0
  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0
  const weightLoss = startWeight - currentWeight
  const percentageLoss = startWeight > 0 ? (weightLoss / startWeight) * 100 : 0

  const heightInMeters = profile?.height ? profile.height / 100 : 0
  const bmi =
    heightInMeters > 0 && currentWeight > 0
      ? (currentWeight / (heightInMeters * heightInMeters)).toFixed(1)
      : "N/A"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Weight Progress</h2>
        <p className="text-muted-foreground">Track and monitor your weight loss journey</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Starting Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startWeight > 0 ? `${startWeight} kg` : "No data"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight > 0 ? `${currentWeight} kg` : "No data"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weight Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weightLoss > 0 ? `${weightLoss.toFixed(1)} kg (${percentageLoss.toFixed(1)}%)` : "No change"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bmi}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
            <CardDescription>Your weight tracking over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No weight data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Weight</CardTitle>
            <CardDescription>Record your current weight</CardDescription>
          </CardHeader>
          <CardContent>
            <WeightForm />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Weight (kg)</th>
                  <th className="px-4 py-2 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {weightEntries.length > 0 ? (
                  [...weightEntries].reverse().map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="px-4 py-2">{format(new Date(entry.date), "MMM dd, yyyy")}</td>
                      <td className="px-4 py-2">{entry.weight}</td>
                      <td className="px-4 py-2">{entry.notes || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center">
                      No weight entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
