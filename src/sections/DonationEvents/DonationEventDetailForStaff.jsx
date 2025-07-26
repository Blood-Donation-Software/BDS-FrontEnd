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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, CalendarDays, Clock, Droplet, User, Building2, Loader2, Edit, Trash2, Users, Phone, Search, FileText, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getEventById, deleteEventRequest, getEventDonors, recordDonations } from '@/apis/bloodDonation'
import { convertBloodType } from '@/utils/utils'

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
  const [donorListModal, setDonorListModal] = useState(false)
  const [donors, setDonors] = useState([])
  const [filteredDonors, setFilteredDonors] = useState([])
  const [donorSearchTerm, setDonorSearchTerm] = useState('')
  const [donorsLoading, setDonorsLoading] = useState(false)
  const [donorsPagination, setDonorsPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })
  // Report donation states
  const [reportModal, setReportModal] = useState(false)
  const [reportDonors, setReportDonors] = useState([])
  const [reportLoading, setReportLoading] = useState(false)

  // Report modal pagination and filtering
  const [filteredReportDonors, setFilteredReportDonors] = useState([])
  const [reportFilter, setReportFilter] = useState('ALL') // ALL, NO_VOLUME, HAS_VOLUME
  const [reportSearchTerm, setReportSearchTerm] = useState('')
  const [reportPagination, setReportPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })

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

  // Filter donors based on search term
  useEffect(() => {
    if (!donorSearchTerm.trim()) {
      setFilteredDonors(donors)
    } else {
      const filtered = donors.filter(donor => {
        const searchLower = donorSearchTerm.toLowerCase()
        return (
          donor.name?.toLowerCase().includes(searchLower) ||
          donor.phone?.toLowerCase().includes(searchLower) ||
          donor.address?.toLowerCase().includes(searchLower) ||
          donor.city?.toLowerCase().includes(searchLower) ||
          donor.district?.toLowerCase().includes(searchLower) ||
          donor.ward?.toLowerCase().includes(searchLower)
        )
      })
      setFilteredDonors(filtered)
    }
  }, [donors, donorSearchTerm])

  // Filter report donors based on search term and volume status
  useEffect(() => {
    let filtered = [...reportDonors]

    // Apply search filter
    if (reportSearchTerm.trim()) {
      const searchLower = reportSearchTerm.toLowerCase()
      filtered = filtered.filter(donor => {
        return (
          donor.name?.toLowerCase().includes(searchLower) ||
          donor.phone?.toLowerCase().includes(searchLower) ||
          donor.address?.toLowerCase().includes(searchLower) ||
          donor.city?.toLowerCase().includes(searchLower) ||
          donor.district?.toLowerCase().includes(searchLower) ||
          donor.ward?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Apply volume filter
    if (reportFilter === 'NO_VOLUME') {
      filtered = filtered.filter(donor => !donor.volume || donor.volume <= 0)
    } else if (reportFilter === 'HAS_VOLUME') {
      filtered = filtered.filter(donor => donor.volume && donor.volume > 0)
    }

    setFilteredReportDonors(filtered)

    // Update pagination
    setReportPagination(prev => ({
      ...prev,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.size),
      page: 0 // Reset to first page when filter changes
    }))
  }, [reportDonors, reportSearchTerm, reportFilter])

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
      router.push('/staffs/donation-event/list')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to submit delete request. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle view donor list
  const handleViewDonors = () => {
    setDonorListModal(true)
    fetchDonors()
  }  // Fetch donors for the event
  const fetchDonors = async (page = 0, size = 10) => {
    if (!params?.id) return

    try {
      setDonorsLoading(true)
      const response = await getEventDonors(params.id, page, size)

      console.log('Donors API response:', response) // Debug log
      if (response && response.content && Array.isArray(response.content)) {
        setDonors(response.content)
        setFilteredDonors(response.content) // Initialize filtered donors
        setDonorsPagination({
          page: response.number || 0,
          size: response.size || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0
        })
      } else {
        console.warn('Unexpected response structure:', response)
        setDonors([])
        setFilteredDonors([])
        setDonorsPagination({
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0
        })
      }
    } catch (error) {
      console.error('Error fetching donors:', error)
      toast.error('Failed to load donor list')
      setDonors([])
      setFilteredDonors([])
    } finally {
      setDonorsLoading(false)
    }
  }
  // Handle donor pagination
  const handleDonorPageChange = (newPage) => {
    fetchDonors(newPage, donorsPagination.size)
  }

  // Handle report finished event
  const handleReportFinishedEvent = async () => {
    try {
      setReportLoading(true)

      // Get all donors for the event
      const response = await getEventDonors(params.id, 0, 1000) // Get all donors
      const allDonors = response.content || []

      if (allDonors.length === 0) {
        toast.error('No registered donors found for this event')
        return
      }      // Initialize report donors with default volume
      const initialReportDonors = allDonors.map(donor => ({
        ...donor,
        volume: 0 // Default blood donation volume in ml
      }))

      setReportDonors(initialReportDonors)
      setFilteredReportDonors(initialReportDonors)

      // Initialize pagination
      setReportPagination({
        page: 0,
        size: 10,
        totalElements: initialReportDonors.length,
        totalPages: Math.ceil(initialReportDonors.length / 10)
      })

      // Reset filters
      setReportFilter('ALL')
      setReportSearchTerm('')

      setReportModal(true)
    } catch (error) {
      console.error('Error fetching donors for report:', error)
      toast.error('Failed to load donor list for reporting')
    } finally {
      setReportLoading(false)
    }
  }
  // Handle volume change for individual donor
  const handleVolumeChange = (donorId, volume) => {
    setReportDonors(prev =>
      prev.map(donor =>
        donor.id === donorId ? { ...donor, volume: parseFloat(volume) || 0 } : donor
      )
    )
  }

  // Handle report pagination
  const handleReportPageChange = (newPage) => {
    setReportPagination(prev => ({ ...prev, page: newPage }))
  }

  // Handle report page size change
  const handleReportPageSizeChange = (newSize) => {
    const size = parseInt(newSize)
    setReportPagination(prev => ({
      ...prev,
      size,
      page: 0,
      totalPages: Math.ceil(filteredReportDonors.length / size)
    }))
  }

  // Submit donation report
  const handleSubmitReport = async () => {
    try {
      setReportLoading(true)

      // Validate volumes
      const invalidDonors = reportDonors.filter(donor => !donor.volume || donor.volume <= 0)
      if (invalidDonors.length > 0) {
        toast.error('Please enter valid volumes for all donors (greater than 0)')
        return
      }

      // Create donation records
      const donationRecords = reportDonors.map(donor => ({
        profileId: donor.id,
        volume: donor.volume
      }))

      // Record the donations
      await recordDonations(params.id, donationRecords)

      toast.success(`Successfully recorded donations for ${reportDonors.length} donors`)

      // Close modal and refresh event data
      setReportModal(false)

      // Refresh event details
      const response = await getEventById(params.id)
      setEvent(response)

    } catch (error) {
      console.error('Error submitting donation report:', error)
      if (error.response?.data?.message) {
        toast.error(`Failed to record donations: ${error.response.data.message}`)
      } else {
        toast.error('Failed to record donations. Please try again.')
      }
    } finally {
      setReportLoading(false)
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
          onClick={() => router.push('/staffs/donation-event/list')}
        >
          Back to Events
        </Button>
      </div>
    )
  }
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

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'

    try {
      const birthDate = parseDate(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age
    } catch (error) {
      console.error('Error calculating age:', error)
      return 'N/A'
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
            onClick={() => router.push('/staffs/donation-event/list')}
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
                <h3 className="font-medium">Registration Status</h3>
                <p>
                  <span className="font-semibold text-red-600">{event.registeredMemberCount || 0}</span>
                  <span className="text-muted-foreground"> / {event.totalMemberCount} registered</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.totalMemberCount - (event.registeredMemberCount || 0)} spots remaining
                </p>
              </div>
            </div>

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

        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.status === 'AVAILABLE' &&  <Button className="w-full" onClick={handleEditEvent}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event Details
            </Button>}
            <Button variant="outline" className="w-full" onClick={handleViewDonors}>
              <Users className="h-4 w-4 mr-2" />
              View Donor List
            </Button>

            {event.status === 'AVAILABLE' && (event.registeredMemberCount || 0) > 0 && format(new Date(), 'dd/MM/yyyy') > event.donationDate && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleReportFinishedEvent}
                disabled={reportLoading}
              >
                <FileText className="h-4 w-4 mr-2" />
                {reportLoading ? 'Loading...' : 'Report Finished Event'}
              </Button>
            )}

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
                    </div>                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Available slots</span>
                      <span>{slot.currentRegistrations || 0}/{slot.maxCapacity} registered</span>
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

      {/* Delete Event Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
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
      {/* Donor List Modal */}
      <Dialog open={donorListModal} onOpenChange={setDonorListModal}>
        <DialogContent className="min-w-2/3 max-h-[80vh] overflow-hidden top-[25vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Registered Donors - {event?.name}
            </DialogTitle>
            <DialogDescription>
              {donorsPagination.totalElements} donors registered for this event
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            {donorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading donors...</span>
              </div>) : donors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No donors registered yet</p>
                  <p className="text-sm">Registered donors will appear here once they sign up for this event</p>
                </div>
              ) : (
              <>
                {/* Search bar for donors */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder="Search donors by name, phone, address, or location..."
                      value={donorSearchTerm}
                      onChange={(e) => setDonorSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {donorSearchTerm && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Showing {filteredDonors.length} of {donors.length} donors
                    </div>
                  )}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>
                          <div className="font-medium">
                            {donor.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {donor.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{donor.address || 'N/A'}</div>
                            {(donor.ward || donor.district || donor.city) && (
                              <div className="text-muted-foreground">
                                {[donor.ward, donor.district, donor.city].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {convertBloodType(donor.bloodType) || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {donor.gender || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {calculateAge(donor.dateOfBirth)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            {donor.status || 'Registered'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination for donors - hide when searching */}
                {!donorSearchTerm && donorsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {donorsPagination.page * donorsPagination.size + 1} to{' '}
                      {Math.min((donorsPagination.page + 1) * donorsPagination.size, donorsPagination.totalElements)} of{' '}
                      {donorsPagination.totalElements} donors
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDonorPageChange(donorsPagination.page - 1)}
                        disabled={donorsPagination.page === 0 || donorsLoading}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, donorsPagination.totalPages) }, (_, i) => {
                          let pageNumber
                          if (donorsPagination.totalPages <= 5) {
                            pageNumber = i
                          } else if (donorsPagination.page < 3) {
                            pageNumber = i
                          } else if (donorsPagination.page > donorsPagination.totalPages - 4) {
                            pageNumber = donorsPagination.totalPages - 5 + i
                          } else {
                            pageNumber = donorsPagination.page - 2 + i
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={pageNumber === donorsPagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDonorPageChange(pageNumber)}
                              disabled={donorsLoading}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber + 1}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDonorPageChange(donorsPagination.page + 1)}
                        disabled={donorsPagination.page >= donorsPagination.totalPages - 1 || donorsLoading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Report Donation Modal */}
      <Dialog open={reportModal} onOpenChange={setReportModal}>
        <DialogContent className="min-w-4/5 max-h-[80vh] overflow-hidden top-[20vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Finished Event - {event?.name}
            </DialogTitle>
            <DialogDescription>
              Enter the donation volume for each donor (in ml). You can filter by volume status and paginate through the list.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-auto">
            {reportDonors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No donors to report</p>
              </div>
            ) : (
              <>
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder="Search donors by name, phone, address..."
                      value={reportSearchTerm}
                      onChange={(e) => setReportSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={reportFilter} onValueChange={setReportFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Donors</SelectItem>
                      <SelectItem value="NO_VOLUME">No Volume Entered</SelectItem>
                      <SelectItem value="HAS_VOLUME">Volume Entered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={reportPagination.size.toString()}
                    onValueChange={handleReportPageSizeChange}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Summary */}
                <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                  <div>
                    Showing {Math.min(filteredReportDonors.length, reportPagination.size)} of {filteredReportDonors.length} donors
                    {reportFilter !== 'ALL' && ` (filtered from ${reportDonors.length} total)`}
                  </div>
                  <div>
                    {reportFilter === 'NO_VOLUME' && `${reportDonors.filter(d => !d.volume || d.volume <= 0).length} donors without volume`}
                    {reportFilter === 'HAS_VOLUME' && `${reportDonors.filter(d => d.volume && d.volume > 0).length} donors with volume`}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Volume (ml)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReportDonors
                      .slice(
                        reportPagination.page * reportPagination.size,
                        (reportPagination.page + 1) * reportPagination.size
                      )
                      .map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell>
                            <div className="font-medium">
                              {donor.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {donor.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {convertBloodType(donor.bloodType) || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {donor.gender || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {calculateAge(donor.dateOfBirth)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="1000"
                                step="50"
                                value={donor.volume || ''}
                                onChange={(e) => handleVolumeChange(donor.id, e.target.value)}
                                className="w-24"
                                placeholder="450"
                              />
                              {donor.volume > 0 && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {reportPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {reportPagination.page * reportPagination.size + 1} to{' '}
                      {Math.min((reportPagination.page + 1) * reportPagination.size, filteredReportDonors.length)} of{' '}
                      {filteredReportDonors.length} donors
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportPageChange(reportPagination.page - 1)}
                        disabled={reportPagination.page === 0}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, reportPagination.totalPages) }, (_, i) => {
                          let pageNumber
                          if (reportPagination.totalPages <= 5) {
                            pageNumber = i
                          } else if (reportPagination.page < 3) {
                            pageNumber = i
                          } else if (reportPagination.page > reportPagination.totalPages - 4) {
                            pageNumber = reportPagination.totalPages - 5 + i
                          } else {
                            pageNumber = reportPagination.page - 2 + i
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={pageNumber === reportPagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleReportPageChange(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber + 1}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportPageChange(reportPagination.page + 1)}
                        disabled={reportPagination.page >= reportPagination.totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Summary and Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div>Total donors: {reportDonors.length}</div>
                    <div>
                      Volumes entered: {reportDonors.filter(d => d.volume && d.volume > 0).length} / {reportDonors.length}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setReportModal(false)}
                      disabled={reportLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReport}
                      disabled={reportLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {reportLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Submit Report ({reportDonors.filter(d => d.volume && d.volume > 0).length} donors)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}