'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPin, CalendarDays, Clock, Droplet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

// Mock data matching your DonationEventDto
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
    { startTime: "09:00", endTime: "10:00", maxCapacity: 4 },
    { startTime: "10:00", endTime: "11:00", maxCapacity: 2 }
  ]
}

const statusMap = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  ONGOING: { label: 'Ongoing', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' }
}

export default function StaffEventDetailPage() {
  const router = useRouter()
  const event = mockEvent

  const formattedDate = format(
    new Date(event.donationDate.split('-').reverse().join('-')), 
    'MMMM do, yyyy'
  )

  const fullAddress = `${event.address}, ${event.ward}, ${event.district}, ${event.city}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex gap-4">
          <Badge variant={statusMap[event.status].variant}>
            {statusMap[event.status].label}
          </Badge>
          <Button 
            variant="outline"
            onClick={() => router.push('/staff/events')}
          >
            Back to Events
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Location</h3>
                <p>{event.location}</p>
                <p className="text-muted-foreground text-sm">{fullAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CalendarDays className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Date</h3>
                <p>{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Droplet className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Donation Type</h3>
                <p>{event.donationType.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Total Capacity</h3>
                <p>{event.totalMemberCount} donors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Management */}
        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Edit Event Details
            </Button>
            <Button variant="outline" className="w-full">
              View Donor List
            </Button>
            {event.status === 'PENDING' && (
              <Button variant="destructive" className="w-full">
                Cancel Event
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Scheduled Time Slots</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {event.timeSlotDtos.map((slot, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </h3>
                    <Badge variant="outline">
                      Capacity: {slot.maxCapacity}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Duration: 1 hour</span>
                    <span>0/{slot.maxCapacity} registered</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}