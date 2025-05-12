"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
    return (
        <div className="h-[300px]">
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
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
    )
}
