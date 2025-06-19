'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MapPin, CalendarDays, Clock, Droplet, User, Building2, Loader2, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getEventById, deleteEventRequest } from '@/apis/bloodDonation'

const statusMap = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  APPROVED: { label: 'Approved', variant: 'default' },
  ONGOING: { label: 'Ongoing', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  REJECTED: { label: 'Rejected', variant: 'destructive' }
}

const donationTypeMap = {
  WHOLE_BLOOD: 'Whole Blood',
  PLATELET: 'Platelet',
  PLASMA: 'Plasma',
  RED_BLOOD_CELL: 'Red Blood Cell'
}

export default function StaffEventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!params?.id) {
        setError('Event ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getEventById(params.id)
        setEvent(response)
      } catch (error) {
        console.error('Error fetching event details:', error)
        setError('Failed to load event details')
        toast.error('Failed to load event details')
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [params?.id])

  // Handle edit event
  const handleEditEvent = () => {
    router.push(`/staffs/donation-event/${params.id}/edit`)
  }

  // Handle delete event
  const handleDeleteEvent = () => {
    setDeleteDialog(true)
  }

  // Confirm delete event
  const confirmDeleteEvent = async () => {
    if (!params?.id) return

    setIsDeleting(true)
    try {
      await deleteEventRequest(params.id)
      toast.success('Delete request has been submitted successfully!')
      setDeleteDialog(false)
      // Navigate back to events list
      router.push('/staffs/donation-event')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to submit delete request. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading event details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Event not found'}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/staffs/donation-event')}
        >
          Back to Events
        </Button>
      </div>
    )  }

  // Helper function to parse different date formats
  const parseDate = (dateString) => {
    if (!dateString) return new Date()
    
    // Try ISO format first (YYYY-MM-DD or full ISO string)
    if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        return parseISO(dateString)
      } catch (error) {
        console.warn('Failed to parse ISO date:', dateString)
      }
    }
    
    // Try DD-MM-YYYY format
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      try {
        const [day, month, year] = dateString.split('-')
        return new Date(year, month - 1, day) // month is 0-indexed
      } catch (error) {
        console.warn('Failed to parse DD-MM-YYYY date:', dateString)
      }
    }
    
    // Try MM/DD/YYYY format
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      try {
        return new Date(dateString)
      } catch (error) {
        console.warn('Failed to parse MM/DD/YYYY date:', dateString)
      }
    }
    
    // Fallback to Date constructor
    try {
      return new Date(dateString)
    } catch (error) {
      console.error('Failed to parse date:', dateString, error)
      return new Date() // Return current date as fallback
    }
  }
  const formattedDate = (() => {
    try {
      return format(parseDate(event.donationDate), 'MMMM do, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return event.donationDate || 'Date not available'
    }
  })()

  const fullAddress = [event.address, event.ward, event.district, event.city]
    .filter(Boolean)
    .join(', ')
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex gap-4">
          <Badge variant={statusMap[event.status]?.variant || 'secondary'}>
            {statusMap[event.status]?.label || event.status}
          </Badge>
          <Button 
            variant="outline"
            onClick={() => router.push('/staffs/donation-event')}
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
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="font-semibold">{event.hospital}</p>
                {fullAddress && (
                  <p className="text-muted-foreground text-sm">{fullAddress}</p>
                )}
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
                <p>{donationTypeMap[event.donationType] || event.donationType}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <User className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Total Capacity</h3>
                <p>{event.totalMemberCount} donors</p>
              </div>
            </div>

            {/* Organizer Information */}
            {event.organizer && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <Building2 className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="font-medium">Organizer Information</h3>
                    <div className="space-y-1">
                      <p className="font-semibold">{event.organizer.organizationName}</p>
                      <p className="text-sm">Contact: {event.organizer.contactPersonName}</p>
                      <p className="text-sm text-muted-foreground">Email: {event.organizer.email}</p>
                      <p className="text-sm text-muted-foreground">Phone: {event.organizer.phoneNumber}</p>
                      {event.organizer.websiteUrl && (
                        <p className="text-sm text-muted-foreground">
                          Website: <a href={event.organizer.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {event.organizer.websiteUrl}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Event Management */}
        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
          </CardHeader>          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleEditEvent}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event Details
            </Button>
            <Button variant="outline" className="w-full">
              <User className="h-4 w-4 mr-2" />
              View Donor List
            </Button>
            {(event.status === 'PENDING' || event.status === 'APPROVED') && (
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDeleteEvent}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Submitting...' : 'Request Deletion'}
              </Button>
            )}
          </CardContent>
        </Card>        {/* Time Slots */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Scheduled Time Slots</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.timeSlotDtos && event.timeSlotDtos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <span>Available slots</span>
                      <span>{slot.registeredCount || 0}/{slot.maxCapacity} registered</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time slots scheduled for this event</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Event Confirmation Dialog */}      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Delete Request</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to submit a delete request for "{event?.name}"? 
            This will create a deletion request that needs to be approved by an administrator.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteEvent} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Delete Request'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}