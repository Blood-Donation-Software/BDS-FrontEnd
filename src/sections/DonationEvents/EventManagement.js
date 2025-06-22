'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Search, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { getAllEvents, getEventsByDateRange, getEventDonors } from '@/apis/bloodDonation'

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' }
]

const donationTypeOptions = [
  { value: 'ALL', label: 'All Types' },
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PLASMA', label: 'Plasma' },
  { value: 'PLATELETS', label: 'Platelets' }
]

// Status badge styling
const getStatusBadge = (status) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200'
  }
  return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Format donation type for display
const formatDonationType = (type) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function EventManagement() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    donationType: 'ALL'
  })
  const [sortConfig, setSortConfig] = useState({
    key: 'donationDate',
    direction: 'asc'
  })

  // Fetch events from API
  const fetchEvents = async (page = 0, size = 10) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getAllEvents(page, size, sortConfig.key, sortConfig.direction === 'asc')

      if (response.content) {
        setEvents(response.content)
        setPagination({
          page: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        })
      } else {
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to load events. Please try again.')
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(pagination.page, pagination.size)
  }, [sortConfig])

  useEffect(() => {
    let result = [...events]

    // Search filter
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(ev =>
        ev.name?.toLowerCase().includes(term) ||
        ev.hospital?.toLowerCase().includes(term) ||
        ev.city?.toLowerCase().includes(term) ||
        ev.address?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(ev => ev.status === filters.status)
    }

    // Donation Type filter
    if (filters.donationType && filters.donationType !== 'ALL') {
      result = result.filter(ev => ev.donationType === filters.donationType)
    }

    setFiltered(result)
  }, [events, filters])
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchEvents(newPage, pagination.size)
  }

  const handlePageSizeChange = (newSize) => {
    const size = parseInt(newSize)
    setPagination(prev => ({ ...prev, size, page: 0 }))
    fetchEvents(0, size)
  }
  const handleRefresh = () => {
    fetchEvents(pagination.page, pagination.size)
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      // Handle both "dd-MM-yyyy" and ISO date formats
      if (dateString.includes('-') && dateString.length === 10 && dateString.includes('/') === false) {
        const [day, month, year] = dateString.split('-')
        return format(new Date(year, month - 1, day), 'MMM dd, yyyy')
      }
      return format(parseISO(dateString), 'MMM dd, yyyy')
    } catch (error) {
      return dateString
    }
  }

  // Return the component JSX
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Blood Donation Events
              </CardTitle>
              <CardDescription>
                Manage and view all blood donation events ({pagination.totalElements} total)
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-row mb-4 space-x-4">
            <div className="relative w-2xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={value => setFilters(f => ({ ...f, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.donationType}
              onValueChange={value => setFilters(f => ({ ...f, donationType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Donation Type" />
              </SelectTrigger>
              <SelectContent>
                {donationTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Selector */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              {pagination.totalElements > 0 && (
                `Showing ${Math.min(filtered.length, pagination.size)} of ${pagination.totalElements} events`
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Events per page:</span>
              <Select
                value={pagination.size.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20">
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('name')}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('hospital')}>
                    Location <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('donationDate')}>
                    Date <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('totalMemberCount')}>
                    Capacity <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>                
                <TableHead>Time Slots</TableHead>
                <TableHead>Organizer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>              
              {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading events...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (<TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="text-muted-foreground">
                  {events.length === 0 ? 'No events found' : 'No events match your filters'}
                </div>
              </TableCell>
            </TableRow>) : (
              filtered.map((event) => (
                <TableRow
                  key={event.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/staffs/donation-event/${event.id}`)}
                >
                  <TableCell>
                    <div className="font-medium text-primary">
                      {event.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">{event.hospital}</div>
                        <div className="text-muted-foreground">
                          {event.address && `${event.address}, `}
                          {event.ward && `${event.ward}, `}
                          {event.district && `${event.district}, `}
                          {event.city}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(event.donationDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatDonationType(event.donationType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-red-600">{event.registeredMemberCount || 0}</span>
                      <span className="text-muted-foreground">/{event.totalMemberCount}</span>
                      <span className="text-xs text-muted-foreground ml-1">registered</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {event.timeSlotDtos?.map((slot, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                          <Badge variant="outline" className="text-xs">
                            {slot.maxCapacity}
                          </Badge>
                        </div>
                      )) || <span className="text-muted-foreground">No slots</span>}
                    </div>
                  </TableCell>                      
                  <TableCell>
                    {event.organizer ? (
                      <div className="text-sm">
                        <div className="font-medium">{event.organizer.organizationName}</div>
                        <div className="text-muted-foreground">{event.organizer.contactPersonName}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No organizer</span>
                    )}
                  </TableCell>                      
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Actions can be added here if needed */}
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.page * pagination.size + 1} to{' '}
                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                {pagination.totalElements} events
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0 || loading}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber
                    if (pagination.totalPages <= 5) {
                      pageNumber = i
                    } else if (pagination.page < 3) {
                      pageNumber = i
                    } else if (pagination.page > pagination.totalPages - 4) {
                      pageNumber = pagination.totalPages - 5 + i
                    } else {
                      pageNumber = pagination.page - 2 + i
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={loading}
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
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1 || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}