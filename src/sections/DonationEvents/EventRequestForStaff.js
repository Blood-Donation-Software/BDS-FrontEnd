'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowUpDown, Search, Calendar, MapPin, Users, Clock, Eye, FileText, RefreshCw } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getMyRequests, getMyRequestById } from '@/apis/bloodDonation'

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' }
]

const crudTypeOptions = [
  { value: 'ALL', label: 'All Request Types' },
  { value: 'CREATE', label: 'Create Event' },
  { value: 'UPDATE', label: 'Update Event' },
  { value: 'DELETE', label: 'Delete Event' }
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
  return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'
}

// Helper function to get display data based on CRUD type
const getDisplayData = (request) => {
  if (!request) return null

  switch (request.crudType) {
    case 'CREATE':
      return request.newDonationEventDto
    case 'UPDATE':
      // For update, show new data but indicate it's an update
      return request.newDonationEventDto
    case 'DELETE':
      // For delete, show the original event data from oldDonationEventDto
      return request.oldDonationEventDto
    default:
      return request.newDonationEventDto || request.oldDonationEventDto
  }
}

// Helper function to get original event data (for UPDATE requests)
const getOriginalData = (request) => {
  if (request.crudType === 'UPDATE') {
    return request.oldDonationEventDto
  }
  return null
}

// Helper function to get CRUD type badge styling
const getCrudTypeBadge = (crudType) => {
  const styles = {
    CREATE: 'bg-blue-100 text-blue-800 border-blue-200',
    UPDATE: 'bg-orange-100 text-orange-800 border-orange-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200'
  }
  return styles[crudType] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Helper function to format CRUD type for display
const formatCrudType = (crudType) => {
  const types = {
    CREATE: 'Create Event',
    UPDATE: 'Update Event',
    DELETE: 'Delete Event'
  }
  return types[crudType] || crudType
}

export default function EventRequestForStaff() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
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
    crudType: 'ALL'
  })
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'desc'
  })
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Fetch my event requests from API
  const fetchRequests = async (page = 0, size = 10) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMyRequests(page, size, sortConfig.key, sortConfig.direction === 'asc')

      if (response.content) {
        setRequests(response.content)
        setPagination({
          page: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        })
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      setError('Failed to load event requests. Please try again.')
      toast.error('Failed to load event requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests(pagination.page, pagination.size)
  }, [])

  useEffect(() => {
    fetchRequests(pagination.page, pagination.size)
  }, [sortConfig])

  useEffect(() => {
    let result = [...requests]

    // Search filter
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(req => {
        if (!req) return false

        const displayData = getDisplayData(req)
        return (
          displayData?.name?.toLowerCase().includes(term) ||
          displayData?.hospital?.toLowerCase().includes(term) ||
          displayData?.city?.toLowerCase().includes(term) ||
          displayData?.address?.toLowerCase().includes(term) ||
          displayData?.organizer?.organizationName?.toLowerCase().includes(term) ||
          req.crudType?.toLowerCase().includes(term)
        )
      })
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(req => req && req.status === filters.status)
    }

    // CRUD Type filter
    if (filters.crudType && filters.crudType !== 'ALL') {
      result = result.filter(req => req && req.crudType === filters.crudType)
    }

    setFilteredRequests(result)
  }, [requests, filters])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchRequests(newPage, pagination.size)
  }

  const handlePageSizeChange = (newSize) => {
    const size = parseInt(newSize)
    setPagination(prev => ({ ...prev, size, page: 0 }))
    fetchRequests(0, size)
  }

  const handleRefresh = () => {
    fetchRequests(pagination.page, pagination.size)
  }

  // Handle view request details
  const handleViewRequest = async (request) => {
    try {
      const response = await getMyRequestById(request.id)
      setSelectedRequest(response)
      setViewDialogOpen(true)
    } catch (error) {
      console.error('Error viewing request:', error)
      toast.error('Failed to load request details')
    }
  }

  // Format date for display (handles dd-MM-yyyy format)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      // Handle dd-MM-yyyy format from API
      const parts = dateString.split('-')
      if (parts.length === 3) {
        const day = parts[0]
        const month = parts[1]
        const year = parts[2]
        const isoDate = `${year}-${month}-${day}`
        return format(parseISO(isoDate), 'MMM dd, yyyy')
      }
      return format(parseISO(dateString), 'MMM dd, yyyy')
    } catch (error) {
      return dateString
    }
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    try {
      return format(parseISO(`2000-01-01T${timeString}`), 'HH:mm')
    } catch (error) {
      return timeString
    }
  }

  // Get time slots display text
  const getTimeSlotDisplay = (timeSlotDtos) => {
    if (!timeSlotDtos || timeSlotDtos.length === 0) return 'N/A'
    
    const firstSlot = timeSlotDtos[0]
    const lastSlot = timeSlotDtos[timeSlotDtos.length - 1]
    
    if (timeSlotDtos.length === 1) {
      return `${formatTime(firstSlot.startTime)} - ${formatTime(firstSlot.endTime)}`
    } else {
      return `${formatTime(firstSlot.startTime)} - ${formatTime(lastSlot.endTime)} (${timeSlotDtos.length} slots)`
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Event Requests
              </CardTitle>
              <CardDescription>
                View and track your donation event requests ({pagination.totalElements} total)
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} disabled={loading} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search event requests..."
                className="pl-10"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={value => setFilters(f => ({ ...f, status: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.crudType}
              onValueChange={value => setFilters(f => ({ ...f, crudType: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                {crudTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Selector */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              {pagination.totalElements > 0 && (
                `Showing ${Math.min(filteredRequests.length, pagination.size)} of ${pagination.totalElements} requests`
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Requests per page:</span>
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
                  <Button variant="ghost" onClick={() => handleSort('newDonationEventDto.name')}>
                    Event Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('crudType')}>
                    Request Type <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading requests...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {requests.length === 0 ? 'No event requests found' : 'No requests match your filters'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.filter(request => request && request.id).map((request) => {
                  const displayData = getDisplayData(request)
                  return (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{displayData?.name || 'Untitled Event'}</div>
                        <div className="text-sm text-muted-foreground">
                          Request ID: #{request.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCrudTypeBadge(request.crudType)}>
                          {formatCrudType(request.crudType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {displayData?.address || 'N/A'}
                          </div>
                          <div className="text-muted-foreground">
                            {displayData?.organizer?.organizationName || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(displayData?.donationDate)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {getTimeSlotDisplay(displayData?.timeSlotDtos)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.page * pagination.size + 1} to{' '}
                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                {pagination.totalElements} requests
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

      {/* View Event Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-red-600" />
              {selectedRequest?.crudType === 'CREATE' && 'New Event Request Details'}
              {selectedRequest?.crudType === 'UPDATE' && 'Event Update Request Details'}
              {selectedRequest?.crudType === 'DELETE' && 'Event Deletion Request Details'}
              {!selectedRequest?.crudType && 'Event Request Details'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedRequest?.crudType === 'CREATE' && 'Review the details of your new event request'}
              {selectedRequest?.crudType === 'UPDATE' && 'Review the proposed changes to your event'}
              {selectedRequest?.crudType === 'DELETE' && 'Review the event that you requested to be deleted'}
              {!selectedRequest?.crudType && 'Review your complete event request'}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-8 py-6">
              {/* Request Status Header */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-red-700 uppercase tracking-wide">Request Status</label>
                    <div className="mt-2">
                      <Badge variant="outline" className={`${getStatusBadge(selectedRequest.status)} text-sm px-3 py-1`}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-red-700 uppercase tracking-wide">Request Type</label>
                    <div className="mt-2">
                      <Badge variant="outline" className={`${getCrudTypeBadge(selectedRequest.crudType)} text-sm px-3 py-1`}>
                        {formatCrudType(selectedRequest.crudType)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-red-700 uppercase tracking-wide">Request ID</label>
                    <p className="mt-2 text-lg font-bold text-red-800">#{selectedRequest.id}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              {(() => {
                const displayData = getDisplayData(selectedRequest)
                const originalData = getOriginalData(selectedRequest)

                return (
                  <div className="space-y-8">
                    {/* Main Event Information */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-red-600" />
                        Event Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Event Name</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{displayData?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Hospital</label>
                            <p className="mt-1 text-base text-gray-900">{displayData?.hospital || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Donation Date</label>
                            <div className="mt-1 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-red-600" />
                              <p className="text-base font-medium text-gray-900">{formatDate(displayData?.donationDate)}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Donation Type</label>
                            <p className="mt-1 text-base text-gray-900">{formatDonationType(displayData?.donationType)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                            <div className="mt-1 flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                              <p className="text-base text-gray-900">{displayData?.address || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">City</label>
                            <p className="mt-1 text-base text-gray-900">{displayData?.city || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Time Slots</label>
                            <div className="mt-1 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-600" />
                              <p className="text-base font-medium text-gray-900">{getTimeSlotDisplay(displayData?.timeSlotDtos)}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Max Participants</label>
                            <div className="mt-1 flex items-center gap-2">
                              <Users className="h-4 w-4 text-red-600" />
                              <p className="text-base font-medium text-gray-900">{displayData?.maxParticipants || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Slots Detail */}
                    {displayData?.timeSlotDtos && displayData.timeSlotDtos.length > 0 && (
                      <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-red-600" />
                          Time Slots Details
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            ({displayData.timeSlotDtos.length} {displayData.timeSlotDtos.length === 1 ? 'slot' : 'slots'})
                          </span>
                        </h3>
                        
                        {/* Time Slots Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {displayData.timeSlotDtos.map((slot, index) => (
                            <div key={index} className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                      <Clock className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-red-800">
                                      Slot {index + 1}
                                    </span>
                                  </div>
                                  <div className="text-xs text-red-600 font-medium uppercase tracking-wide">
                                    {slot.maxParticipants ? `${slot.maxParticipants} spots` : 'Available'}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-700">
                                  <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                                  <div>
                                    <div className="font-bold text-lg text-red-800">
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </div>
                                    <div className="text-sm text-red-600">
                                      Duration: {(() => {
                                        try {
                                          const start = new Date(`2000-01-01T${slot.startTime}`)
                                          const end = new Date(`2000-01-01T${slot.endTime}`)
                                          const diffMs = end - start
                                          const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                                          const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                                          if (diffHours > 0) {
                                            return `${diffHours}h ${diffMinutes}m`
                                          }
                                          return `${diffMinutes}m`
                                        } catch {
                                          return 'N/A'
                                        }
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Time Slots Summary */}
                        <div className="bg-gray-50 border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-600" />
                            Summary
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-600" />
                              <span className="text-gray-600">Total Slots:</span>
                              <span className="font-semibold text-gray-900">{displayData.timeSlotDtos.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-600" />
                              <span className="text-gray-600">Start Time:</span>
                              <span className="font-semibold text-gray-900">{formatTime(displayData.timeSlotDtos[0]?.startTime)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-600" />
                              <span className="text-gray-600">End Time:</span>
                              <span className="font-semibold text-gray-900">{formatTime(displayData.timeSlotDtos[displayData.timeSlotDtos.length - 1]?.endTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {displayData?.description && (
                      <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-red-600" />
                          Description
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-900 leading-relaxed">{displayData.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Organizer Information */}
                    {displayData?.organizer && (
                      <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5 text-red-600" />
                          Organizer Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Organization Name</label>
                            <p className="mt-1 text-base font-semibold text-gray-900">{displayData.organizer.organizationName || 'N/A'}</p>
                          </div>
                          {displayData.organizer.email && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                              <p className="mt-1 text-base text-gray-900">{displayData.organizer.email}</p>
                            </div>
                          )}
                          {displayData.organizer.phoneNumber && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                              <p className="mt-1 text-base text-gray-900">{displayData.organizer.phoneNumber}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    

                    {/* Show comparison for UPDATE requests */}
                    {selectedRequest.crudType === 'UPDATE' && originalData && (
                      <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                          <ArrowUpDown className="h-5 w-5 text-red-600" />
                          Changes Comparison
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Original Data */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-4">Original Event</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Name</label>
                                <p className="text-sm text-red-900">{originalData.name || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Date</label>
                                <p className="text-sm text-red-900">{formatDate(originalData.donationDate)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Time</label>
                                <p className="text-sm text-red-900">{getTimeSlotDisplay(originalData.timeSlotDtos)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Location</label>
                                <p className="text-sm text-red-900">{originalData.hospital || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* New Data */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-4">Updated Event</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-green-600 uppercase tracking-wide">Name</label>
                                <p className="text-sm text-green-900">{displayData.name || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-green-600 uppercase tracking-wide">Date</label>
                                <p className="text-sm text-green-900">{formatDate(displayData.donationDate)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-green-600 uppercase tracking-wide">Time</label>
                                <p className="text-sm text-green-900">{getTimeSlotDisplay(displayData.timeSlotDtos)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-green-600 uppercase tracking-wide">Location</label>
                                <p className="text-sm text-green-900">{displayData.hospital || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button 
              variant="outline" 
              onClick={() => setViewDialogOpen(false)}
              className="px-6 py-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}