import type { Metadata } from "next"
import { getShipments } from "@/actions/shipment-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Package, Truck, CheckCircle, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipments | Acme Patient Dashboard",
  description: "Track your medication shipments",
}

function getStatusIcon(status: string) {
  switch (status) {
    case "processing":
      return <Package className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default async function ShipmentsPage() {
  const shipments = await getShipments()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Medication Shipments</h2>
        <p className="text-muted-foreground">Track your medication shipments and delivery status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Medication</CardTitle>
            <CardDescription>Your prescribed medication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Medication Type</h3>
                <p>Semaglutide</p>
              </div>
              <div>
                <h3 className="font-medium">Current Dosage</h3>
                <p>0.5mg weekly</p>
              </div>
              <div>
                <h3 className="font-medium">Prescription Date</h3>
                <p>June 1, 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Next Shipment</CardTitle>
            <CardDescription>Details about your upcoming medication delivery</CardDescription>
          </CardHeader>
          <CardContent>
            {shipments.find((s) => s.status === "processing" || s.status === "shipped") ? (
              <div className="space-y-4">
                {shipments
                  .filter((s) => s.status === "processing" || s.status === "shipped")
                  .slice(0, 1)
                  .map((shipment) => (
                    <div key={shipment.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {shipment.medicationType} {shipment.dosage}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {shipment.status === "shipped" ? "Shipped on " : "Processing since "}
                            {shipment.shippedDate
                              ? format(new Date(shipment.shippedDate), "MMMM d, yyyy")
                              : format(new Date(shipment.createdAt), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <Badge className={getStatusColor(shipment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(shipment.status)}
                            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                          </span>
                        </Badge>
                      </div>

                      {shipment.trackingNumber && (
                        <div>
                          <h3 className="font-medium">Tracking Number</h3>
                          <p>{shipment.trackingNumber}</p>
                        </div>
                      )}

                      {shipment.estimatedDelivery && (
                        <div>
                          <h3 className="font-medium">Estimated Delivery</h3>
                          <p>{format(new Date(shipment.estimatedDelivery), "MMMM d, yyyy")}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground">No upcoming shipments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment History</CardTitle>
          <CardDescription>Past and upcoming medication shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Medication</th>
                  <th className="px-4 py-2 text-left font-medium">Dosage</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {shipments.length > 0 ? (
                  shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b">
                      <td className="px-4 py-2">
                        {shipment.shippedDate
                          ? format(new Date(shipment.shippedDate), "MMM d, yyyy")
                          : format(new Date(shipment.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-2">{shipment.medicationType}</td>
                      <td className="px-4 py-2">{shipment.dosage}</td>
                      <td className="px-4 py-2">
                        <Badge className={getStatusColor(shipment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(shipment.status)}
                            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-4 py-2">{shipment.trackingNumber || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center">
                      No shipments found
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
