'use client'

import { useEffect, useState } from 'react'
import { updateProfile } from '@/actions/weight-actions'
import { getUserProfile } from '@/actions/weight-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        targetWeight: '',
        height: '',
        currentMedication: '',
        dosage: '',
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getUserProfile()
            if (data) {
                setProfile({
                    targetWeight: data.targetWeight?.toString() || '',
                    height: data.height?.toString() || '',
                    currentMedication: data.currentMedication || '',
                    dosage: data.dosage || '',
                })
            }
            setLoading(false)
        }

        fetchProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()
        formData.set('targetWeight', profile.targetWeight)
        formData.set('height', profile.height)
        formData.set('currentMedication', profile.currentMedication)
        formData.set('dosage', profile.dosage)

        const result = await updateProfile(formData)

        if ('error' in result) {
            toast.error(result.error)
        } else {
            toast.success('Profile updated successfully')
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
            <p className="text-muted-foreground">Manage your personal information and weight goals</p>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>You can update your personal information below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input
                                    id="height"
                                    name="height"
                                    type="number"
                                    value={profile.height}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                                <Input
                                    id="targetWeight"
                                    name="targetWeight"
                                    type="number"
                                    value={profile.targetWeight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="currentMedication">Current Medication</Label>
                                <Input
                                    id="currentMedication"
                                    name="currentMedication"
                                    value={profile.currentMedication}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input
                                    id="dosage"
                                    name="dosage"
                                    value={profile.dosage}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit">Update Profile</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
