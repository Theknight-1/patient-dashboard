"use client"

import { useState } from "react"
import { addWeightEntry } from "@/actions/weight-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function WeightForm() {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)

    const result = await addWeightEntry(formData)

    setIsPending(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Weight entry added successfully",
      })

      // Reset form
      const form = document.getElementById("weight-form") as HTMLFormElement
      form.reset()
    }
  }

  return (
    <form id="weight-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input id="weight" name="weight" type="number" step="0.1" required placeholder="Enter your weight" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" placeholder="Add any notes about this weight entry" className="resize-none" />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Save Weight Entry"}
      </Button>
    </form>
  )
}
