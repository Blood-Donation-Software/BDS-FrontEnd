'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowUpDown, Search, Calendar, MapPin, Users, Clock, Eye, Check, X, FileText } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getPendingRequests, verifyRequest, getRequestById } from '@/apis/bloodDonation'

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

export default function EventRequest() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0, totalPages: 0
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
  const [actionLoading, setActionLoading] = useState(false)  // Fetch pending requests from API
  const fetchRequests = async (page = 0, size = 10) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPendingRequests(page, size, sortConfig.key, sortConfig.direction === 'asc')

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
  }, []);

  useEffect(() => {
    fetchRequests(pagination.page, pagination.size)
  }, [sortConfig])

  useEffect(() => {
    let result = [...requests]    // Search filter
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
    }    // CRUD Type filter
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

  // Handle request approval/rejection
  const handleVerifyRequest = async (requestId, action) => {
    try {
      setActionLoading(true)
      await verifyRequest(requestId, action)
      toast.success(`Request ${action.toLowerCase()}d successfully`)
      fetchRequests(pagination.page, pagination.size) // Refresh data
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing request:`, error)
      toast.error(`Failed to ${action.toLowerCase()} request`)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle view request details
  const handleViewDetails = async (request) => {
    try {
      setSelectedRequest(request)
      setViewDialogOpen(true)
    } catch (error) {
      console.error('Error viewing request details:', error)
      toast.error('Failed to load request details')
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      if (dateString?.includes('-') && dateString.length === 10) {
        const [day, month, year] = dateString.split('-')
        return format(new Date(year, month - 1, day), 'MMM dd, yyyy')
      }
      return format(parseISO(dateString), 'MMM dd, yyyy')
    } catch (error) {
      return dateString
    }
  }

  // Format time for display
  const formatTime = (timeString) => {
    try {
      return timeString || 'N/A'
    } catch (error) {
      return timeString
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
                Blood Donation Event Requests
              </CardTitle>
              <CardDescription>
                Review and manage pending blood donation event requests ({pagination.totalElements} total)
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-8"
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
                  <Button variant="ghost" onClick={() => handleSort('newDonationEventDto.hospital')}>
                    Location <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('newDonationEventDto.donationDate')}>
                    Date <ArrowUpDown className="ml-2 h-4 w-4" />
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
                <TableHead>Organizer</TableHead>
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
                      {requests.length === 0 ? 'No requests found' : 'No requests match your filters'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.filter(request => request && request.id).map((request) => {
                  const displayData = getDisplayData(request)
                  return (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{displayData?.name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDonationType(displayData?.donationType)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="font-medium">{displayData?.hospital || 'N/A'}</div>
                            <div className="text-muted-foreground">
                              {displayData?.address && `${displayData.address}, `}
                              {displayData?.ward && `${displayData.ward}, `}
                              {displayData?.district && `${displayData.district}, `}
                              {displayData?.city}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{formatDate(displayData?.donationDate)}</div>
                            <div className="text-muted-foreground">
                              {displayData?.timeSlotDtos?.length > 0 ? (
                                `${displayData.timeSlotDtos[0].startTime} - ${displayData.timeSlotDtos[displayData.timeSlotDtos.length - 1].endTime}`
                              ) : 'No time slots'}
                            </div>
                          </div>
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
                        {displayData?.organizer ? (
                          <div className="text-sm">
                            <div className="font-medium">{displayData.organizer.organizationName}</div>
                            <div className="text-muted-foreground">{displayData.organizer.contactPersonName}</div>
                          </div>) : (
                          <span className="text-muted-foreground">No organizer</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          {request.status === 'PENDING' && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                    disabled={actionLoading}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve this event request? This action will make the event public and available for donations.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleVerifyRequest(request.id, 'APPROVE')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Approve
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    disabled={actionLoading}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this event request? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleVerifyRequest(request.id, 'REJECT')}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>)}
                        </div>
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

      {/* View Request Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.crudType === 'CREATE' && 'New Event Request Details'}
              {selectedRequest?.crudType === 'UPDATE' && 'Event Update Request Details'}
              {selectedRequest?.crudType === 'DELETE' && 'Event Deletion Request Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.crudType === 'CREATE' && 'Review the details of this new donation event request'}
              {selectedRequest?.crudType === 'UPDATE' && 'Review the proposed changes to the existing event'}
              {selectedRequest?.crudType === 'DELETE' && 'Review the event that is requested to be deleted'}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (() => {
            const displayData = getDisplayData(selectedRequest)
            return (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {selectedRequest.crudType === 'DELETE' ? 'Event to be Deleted' : 'Event Information'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {displayData?.name || 'N/A'}</div>
                      <div><strong>Type:</strong> {formatDonationType(displayData?.donationType)}</div>
                      <div><strong>Date:</strong> {formatDate(displayData?.donationDate)}</div>
                      <div><strong>Capacity:</strong> {displayData?.totalMemberCount || 'N/A'} people</div>
                      <div><strong>Status:</strong>
                        <Badge variant="outline" className={`ml-2 ${getStatusBadge(selectedRequest.status)}`}>
                          {selectedRequest.status}
                        </Badge>
                      </div>
                      <div><strong>Request Type:</strong>
                        <Badge variant="outline" className={`ml-2 ${getCrudTypeBadge(selectedRequest.crudType)}`}>
                          {formatCrudType(selectedRequest.crudType)}
                        </Badge>
                      </div>                      {(selectedRequest.crudType === 'UPDATE' || selectedRequest.crudType === 'DELETE') && selectedRequest.eventId && (
                        <div><strong>Original Event ID:</strong> #{selectedRequest.eventId}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Hospital:</strong> {displayData?.hospital || 'N/A'}</div>
                      <div><strong>Address:</strong> {displayData?.address || 'N/A'}</div>
                      <div><strong>Ward:</strong> {displayData?.ward || 'N/A'}</div>
                      <div><strong>District:</strong> {displayData?.district || 'N/A'}</div>
                      <div><strong>City:</strong> {displayData?.city || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Organizer Information */}
                {displayData?.organizer && (
                  <div>
                    <h4 className="font-semibold mb-2">Organizer</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Organization:</strong> {displayData.organizer.organizationName}</div>
                      <div><strong>Contact Person:</strong> {displayData.organizer.contactPersonName}</div>
                      <div><strong>Email:</strong> {displayData.organizer.email}</div>
                      <div><strong>Phone:</strong> {displayData.organizer.phoneNumber}</div>
                    </div>
                  </div>
                )}              {/* Time Slots */}
                {displayData?.timeSlotDtos && displayData.timeSlotDtos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Time Slots</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {displayData.timeSlotDtos.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{slot.startTime} - {slot.endTime}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Max: {slot.maxCapacity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Details */}
                <div>
                  <h4 className="font-semibold mb-2">Request Information</h4>
                  <div className="text-sm text-muted-foreground">
                    <div><strong>Request ID:</strong> #{selectedRequest.id}</div>
                    <div><strong>Request Type:</strong> {selectedRequest.crudType}</div>
                    <div><strong>Event ID:</strong> {selectedRequest.eventId || 'New Event'}</div>
                    <div><strong>Author ID:</strong> {selectedRequest.authorId}</div>
                  </div>
                </div>
              </div>
            )
          })()}
          {/* Comparison for UPDATE requests */}
          {selectedRequest?.crudType === 'UPDATE' && (() => {
            const originalData = getOriginalData(selectedRequest)
            const updatedData = getDisplayData(selectedRequest)

            if (!originalData || !updatedData) return null

            // Helper function to check if values are different
            const isDifferent = (original, updated) => {
              return original !== updated
            }

            // Helper function to render comparison field
            const renderComparison = (label, originalValue, updatedValue, formatter = (val) => val || 'N/A') => {
              const different = isDifferent(originalValue, updatedValue)
              return (
                <div className={`p-2 rounded ${different ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="font-medium text-sm mb-1">{label}:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded ${different ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                      <span className="font-semibold">Before:</span> {formatter(originalValue)}
                    </div>
                    <div className={`p-2 rounded ${different ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                      <span className="font-semibold">After:</span> {formatter(updatedValue)}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div className="mt-6">
                <h4 className="font-semibold mb-4 text-orange-600 flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Changes Made (Before vs After)
                </h4>

                <div className="space-y-4">
                  {/* Basic Information Changes */}
                  <div>
                    <h5 className="font-medium mb-3 text-gray-700">Basic Information</h5>
                    <div className="space-y-3">
                      {renderComparison('Event Name', originalData.name, updatedData.name)}
                      {renderComparison('Donation Type', originalData.donationType, updatedData.donationType, formatDonationType)}
                      {renderComparison('Event Date', originalData.donationDate, updatedData.donationDate, formatDate)}
                      {renderComparison('Total Capacity', originalData.totalMemberCount, updatedData.totalMemberCount, (val) => `${val || 0} people`)}
                    </div>
                  </div>

                  {/* Location Changes */}
                  <div>
                    <h5 className="font-medium mb-3 text-gray-700">Location Details</h5>
                    <div className="space-y-3">
                      {renderComparison('Hospital/Venue', originalData.hospital, updatedData.hospital)}
                      {renderComparison('Street Address', originalData.address, updatedData.address)}
                      {renderComparison('Ward', originalData.ward, updatedData.ward)}
                      {renderComparison('District', originalData.district, updatedData.district)}
                      {renderComparison('City/Province', originalData.city, updatedData.city)}
                    </div>
                  </div>

                  {/* Organizer Changes */}
                  {(originalData.organizer || updatedData.organizer) && (
                    <div>
                      <h5 className="font-medium mb-3 text-gray-700">Organizer Information</h5>
                      <div className="space-y-3">
                        {renderComparison(
                          'Organization Name',
                          originalData.organizer?.organizationName,
                          updatedData.organizer?.organizationName
                        )}
                        {renderComparison(
                          'Contact Person',
                          originalData.organizer?.contactPersonName,
                          updatedData.organizer?.contactPersonName
                        )}
                        {renderComparison(
                          'Email',
                          originalData.organizer?.email,
                          updatedData.organizer?.email
                        )}
                        {renderComparison(
                          'Phone Number',
                          originalData.organizer?.phoneNumber,
                          updatedData.organizer?.phoneNumber
                        )}
                      </div>
                    </div>
                  )}

                  {/* Time Slots Changes */}
                  {(originalData.timeSlotDtos?.length > 0 || updatedData.timeSlotDtos?.length > 0) && (
                    <div>
                      <h5 className="font-medium mb-3 text-gray-700">Time Slots</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-sm font-medium text-red-600 mb-2">Before:</h6>
                          <div className="space-y-2">
                            {originalData.timeSlotDtos?.map((slot, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                                <span className="text-sm">{slot.startTime} - {slot.endTime}</span>
                                <span className="text-xs bg-red-100 px-2 py-1 rounded">Max: {slot.maxCapacity}</span>
                              </div>
                            )) || <div className="text-sm text-gray-500 italic">No time slots</div>}
                          </div>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-green-600 mb-2">After:</h6>
                          <div className="space-y-2">
                            {updatedData.timeSlotDtos?.map((slot, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                                <span className="text-sm">{slot.startTime} - {slot.endTime}</span>
                                <span className="text-xs bg-green-100 px-2 py-1 rounded">Max: {slot.maxCapacity}</span>
                              </div>
                            )) || <div className="text-sm text-gray-500 italic">No time slots</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary of Changes */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h6 className="font-medium text-blue-800 mb-2">Summary</h6>
                    <p className="text-sm text-blue-700">
                      {(() => {
                        const changes = []
                        if (isDifferent(originalData.name, updatedData.name)) changes.push('event name')
                        if (isDifferent(originalData.donationType, updatedData.donationType)) changes.push('donation type')
                        if (isDifferent(originalData.donationDate, updatedData.donationDate)) changes.push('event date')
                        if (isDifferent(originalData.hospital, updatedData.hospital)) changes.push('venue')
                        if (isDifferent(originalData.address, updatedData.address)) changes.push('address')
                        if (isDifferent(originalData.totalMemberCount, updatedData.totalMemberCount)) changes.push('capacity')

                        if (changes.length === 0) {
                          return 'No significant changes detected in basic information.'
                        }

                        return `Changes made to: ${changes.join(', ')}.`
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}