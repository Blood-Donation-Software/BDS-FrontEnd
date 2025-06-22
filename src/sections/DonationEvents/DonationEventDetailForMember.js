'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { MapPin, CalendarDays, Clock, Droplet, User, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { getEventById } from '@/apis/bloodDonation'
import { getOrganizerById } from '@/apis/organizer'
import { useDonationEvents } from '@/context/donationEvent_context'

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
  const params = useParams()
  const { selectedEvent, organizers, selectEventById, selectTimeSlot, selectedTimeSlot } = useDonationEvents()
  const [event, setEvent] = useState(selectedEvent)
  const [organizer, setOrganizer] = useState(null)
  const [loading, setLoading] = useState(!selectedEvent)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)
        const eventId = params?.id || selectedEvent?.id
        
        if (!eventId) {
          toast.error('No event ID provided')
          router.push('/blood-donation-events')
          return
        }

        let eventData = selectedEvent
        
        // If we don't have the selected event, fetch it from API
        if (!eventData) {
          try {
            eventData = await getEventById(eventId)
          } catch (error) {
            console.warn('API not available, using mock data:', error)
            // Fallback to mock data if API fails
            eventData = mockEvent
          }
        }
        
        setEvent(eventData)

        // Fetch organizer details
        if (eventData?.organizerId) {
          // First check if we already have the organizer in context
          if (organizers[eventData.organizerId]) {
            setOrganizer(organizers[eventData.organizerId])
          } else {            try {
              const organizerData = await getOrganizerById(eventData.organizerId)
              setOrganizer(organizerData)
            } catch (error) {
              console.error('Failed to fetch organizer:', error)
              // Don't set mock data, leave organizer as null
            }
          }
        }      } catch (error) {
        console.error('Failed to fetch event:', error)
        toast.error('Không thể tải thông tin sự kiện')
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [params?.id, selectedEvent, organizers, router, selectEventById])
  const handleRegister = async () => {
    if (selectedTimeSlot === null) {
      toast.error('Vui lòng chọn khung thời gian')
      return
    }

    try {
      setRegistering(true)
      selectTimeSlot(selectedTimeSlot)
      router.push(`/donation-events/${event.id}/register`)
    } catch (error) {
      console.error('Navigation failed:', error)
      toast.error('Có lỗi xảy ra khi chuyển trang')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading event details...</div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Event not found</div>
        </div>
      </div>
    )
  }

  const formattedDate = event.donationDate
    ? format(new Date(event.donationDate.split('-').reverse().join('-')), 'MMMM do, yyyy')
    : 'Not specified'

  const fullAddress = `${event.address}, ${event.ward}, ${event.district}, ${event.city}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <CardFooter className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => router.push('/blood-donation-events')}>
            Back to Events
          </Button>
        </CardFooter>
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
              </div>              <div className="flex items-start gap-4">
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
              </div>              {/* Organizer - Only show if organizer data exists */}
              {(organizer?.organizationName || 
                event.organizer?.organizationName || 
                event.organizationName) && (
                <div className="flex items-start gap-4">
                  <Building2 className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Organizer</h3>
                    <p className="text-muted-foreground">
                      {organizer?.organizationName || 
                       event.organizer?.organizationName || 
                       event.organizationName}
                    </p>
                    {(organizer?.contactNumber || 
                      event.organizer?.contactNumber || 
                      event.organizerContact) && (
                      <p className="text-muted-foreground text-sm">
                        Contact: {organizer?.contactNumber || 
                                  event.organizer?.contactNumber || 
                                  event.organizerContact}
                      </p>
                    )}
                    {(organizer?.email || 
                      event.organizer?.email || 
                      event.organizerEmail) && (
                      <p className="text-muted-foreground text-sm">
                        Email: {organizer?.email || 
                                event.organizer?.email || 
                                event.organizerEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Time Slots</span>
              </CardTitle>
            </CardHeader>            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.timeSlotDtos?.map((slot, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTimeSlot === index 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => selectTimeSlot(index)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </h3>
                      <Badge variant="outline">
                        {slot.maxCapacity} slots
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Click to select
                      </span>
                      {selectedTimeSlot === index && (
                        <Badge variant="default" className="text-xs bg-red-500">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedTimeSlot !== null && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-800">Selected Time Slot</h4>
                      <p className="text-sm text-red-600">
                        {event.timeSlotDtos[selectedTimeSlot].startTime} - {event.timeSlotDtos[selectedTimeSlot].endTime}
                      </p>
                    </div>
                    <Button 
                      onClick={handleRegister}
                      disabled={registering}
                      className="ml-4 bg-red-500 hover:bg-red-600"
                    >
                      {registering ? 'Đang xử lý...' : 'Đăng ký khung giờ này'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
            </CardHeader>            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-medium">
                    <span className="text-red-600">{event.registeredMemberCount || 0}</span>
                    <span className="text-muted-foreground">/{event.totalMemberCount}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Capacity:</span>
                  <span className="font-medium">{event.totalMemberCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time Slots:</span>
                  <span className="font-medium">{event.timeSlotDtos?.length || 0}</span>
                </div>
                {event.registeredMemberCount >= event.totalMemberCount && (
                  <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-red-700 font-medium text-center">
                      Event is fully booked
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {selectedTimeSlot !== null ? (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">Time slot selected!</p>
                    <p className="text-xs mt-1 text-green-600">
                      Click &quot;Register for This Slot&quot; to confirm your registration.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">How to register:</p>
                    <ol className="text-xs mt-2 text-blue-600 space-y-1">
                      <li>1. Select a time slot from the available options</li>
                      <li>2. Click the &quot;Register for This Slot&quot; button</li>
                      <li>3. You&apos;ll receive a confirmation email</li>
                    </ol>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/blood-donation-events')}
              >
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}