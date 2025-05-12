"use client"

import dynamic from "next/dynamic"

// Dynamic import with SSR disabled – this must be done in a client component
const WeightChart = dynamic(() => import("./weight-chart"), { ssr: false })

export default function WeightChartClientWrapper({ data }: { data: { date: string; weight: number }[] }) {
    return <WeightChart data={data} />
}
