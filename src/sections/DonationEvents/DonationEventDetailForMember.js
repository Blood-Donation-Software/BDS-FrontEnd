'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { MapPin, CalendarDays, Clock, Droplet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

// Mock data matching exactly your DonationEventDto
const mockEvent = {
  name: "Blood Donation Drive 2024",
  location: "City Hospital",
  address: "123 Street",
  ward: "1 Ward",
  district: "Binh Thanh District",
  city: "Ho Chi Minh City",
  donationDate: "10-10-2025",
  totalMemberCount: 6,
  status: "PENDING",
  donationType: "WHOLE_BLOOD",
  timeSlotDtos: [
    {
      startTime: "09:00",
      endTime: "10:00",
      maxCapacity: 4
    },
    {
      startTime: "10:00",
      endTime: "11:00",
      maxCapacity: 2
    }
  ]
}

const statusMap = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  ONGOING: { label: 'Ongoing', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' }
}

const donationTypeMap = {
  WHOLE_BLOOD: 'Whole Blood',
  PLASMA: 'Plasma',
  PLATELETS: 'Platelets',
  DOUBLE_RED_CELLS: 'Double Red Cells'
}

export default function EventDetailPage() {
  const router = useRouter()
  const event = mockEvent // Using our mock data directly

  const formattedDate = event.donationDate 
    ? format(new Date(event.donationDate.split('-').reverse().join('-')), 'MMMM do, yyyy')
    : 'Not specified'

  const fullAddress = `${event.address}, ${event.ward}, ${event.district}, ${event.city}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Badge variant={statusMap[event.status]?.variant || 'secondary'}>
          {statusMap[event.status]?.label || event.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-red-500" />
                <span>Event Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">{event.location}</p>
                  <p className="text-muted-foreground text-sm">{fullAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CalendarDays className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p className="text-muted-foreground">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Droplet className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Donation Type</h3>
                  <p className="text-muted-foreground">
                    {donationTypeMap[event.donationType] || event.donationType}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Time Slots</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.timeSlotDtos?.map((slot, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </h3>
                      <Badge variant="outline">
                        Capacity: {slot.maxCapacity}
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Register
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Event Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Slots:</span>
                <span className="font-medium">{event.totalMemberCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                Register as Donor
              </Button>
              <Button variant="outline" className="w-full">
                Share Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CardFooter className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push('/blood-donation-events')}>
          Back to Events
        </Button>
      </CardFooter>
    </div>
  )
}