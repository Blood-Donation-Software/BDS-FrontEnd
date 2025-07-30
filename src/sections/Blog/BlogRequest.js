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
import { ArrowUpDown, Search, Calendar, User, FileText, Eye, Check, X, BookOpen } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getPendingBlogRequests, approveBlogRequest, rejectBlogRequest } from '@/apis/blog'
import { BASE_URL } from '@/global-config'
import { useLanguage } from '@/context/language_context'



// Status badge styling
const getStatusBadge = (status) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200'
  }
  return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// CRUD Type badge styling
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
    CREATE: 'Create Blog',
    UPDATE: 'Update Blog',
    DELETE: 'Delete Blog'
  }
  return types[crudType] || crudType
}

// Helper function to format status for display
const formatStatus = (status) => {
  const statuses = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  }
  return statuses[status] || status
}

export default function BlogRequest() {
  const { t } = useLanguage()
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
  const [actionLoading, setActionLoading] = useState(false)

  const statusOptions = [
    { value: 'ALL', label: t.eventRequest.AllStatuses },
    { value: 'PENDING', label: t.eventRequest.Pending },
    { value: 'APPROVED', label: t.eventRequest.Approved },
    { value: 'REJECTED', label: t.eventRequest.Rejected }
  ]

  const crudTypeOptions = [
    { value: 'ALL', label: t.eventRequest.AllRequestTypes },
    { value: 'CREATE', label: t.eventRequest.CreateBlog },
    { value: 'UPDATE', label: t.eventRequest.UpdateBlog },
    { value: 'DELETE', label: t.eventRequest.DeleteBlog }
  ]
  // Fetch pending blog requests from API
  const fetchRequests = async (page = 0, size = 10) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPendingBlogRequests(page, size, sortConfig.key, sortConfig.direction === 'asc')

      if (response.content) {
        setRequests(response.content)
        setPagination({
          page: response.number || response.pageNumber || 0,
          size: response.size || response.pageSize || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0
        })
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error('Error fetching blog requests:', error)
      setError(t.blogRequest.FailedToLoadBlogRequests)
      toast.error(t.blogRequest.FailedToLoadBlogRequests)
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

        return (
          req.blog?.title?.toLowerCase().includes(term) ||
          req.blog?.content?.toLowerCase().includes(term) ||
          req.id?.toString().includes(term) ||
          req.blog?.authorId?.toString().includes(term)
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

  // Handle blog request approval/rejection
  const handleVerifyRequest = async (requestId, action) => {
    try {
      setActionLoading(true)


      if (action === 'APPROVE') {
        await approveBlogRequest(requestId)
        toast.success(t.blogRequest.BlogRequestApprovedSuccessfully)
      } else if (action === 'REJECT') {
        await rejectBlogRequest(requestId)
        toast.success(t.blogRequest.BlogRequestRejectedSuccessfully)
      }


      // Refresh the list
      await fetchRequests(pagination.page, pagination.size)
    } catch (error) {
      console.error(t.blogRequest.FailedToVerifyBlogRequest, error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(t.blogRequest.FailedToVerifyBlogRequest.replace('{action}', action.toLowerCase()).replace('{errorMessage}', errorMessage))
    } finally {
      setActionLoading(false)
    }
  }

  // Handle view blog request details
  const handleViewRequest = async (request) => {
    try {
      // For now, use the request data directly
      // In the future, you might want to fetch full details with getBlogRequestById
      setSelectedRequest(request)
      setViewDialogOpen(true)
    } catch (error) {
      console.error(t.blogRequest.FailedToLoadBlogRequestDetails, error)
      toast.error(t.blogRequest.FailedToLoadBlogRequestDetails)
    }
  }
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    try {
      // Handle both ISO and local date formats
      if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return format(parseISO(dateString), 'MMM dd, yyyy')
      }
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t.blogRequest.BlogRequests}
              </CardTitle>
              <CardDescription>
                {t.blogRequest.ReviewAndManageBlogSubmissions} ({pagination.totalElements} {t.blogRequest.TotalRequests} )
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? t.blogRequest.Loading : t.blogRequest.Refresh}
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
                placeholder={t.blogRequest.SearchBlogRequests}
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
                <SelectValue placeholder={t.blogRequest.Status} />
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
                <SelectValue placeholder={t.blogRequest.RequestType} />
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
              <span className="text-sm text-muted-foreground">{t.blogRequest.RequestsPerPage}</span>
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
                    <Button variant="ghost" onClick={() => handleSort('blog.title')}>
                      {t.blogRequest.Title} <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('blog.authorId')}>
                      {t.blogRequest.Author} <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('status')}>
                      {t.blogRequest.Status} <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('crudType')}>
                      {t.blogRequest.RequestType} <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    {t.blogRequest.ContentPreview}
                  </TableHead>
                  <TableHead>
                    {t.blogRequest.Actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">{t.blogRequest.LoadingRequests}...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {requests.length === 0 ? t.blogRequest.NoBlogRequestsFound : t.blogRequest.NoRequestsMatchFilters}
                      </div>
                    </TableCell>
                  </TableRow>) : (filteredRequests.filter(request => request && request.id).map((request) => {
                    return (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{request.blog?.title || 'Untitled'}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.blogRequest.RequestID} #{request.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span>{request?.blog?.authorName || "Unknown"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(request.status)}>
                            {formatStatus(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCrudTypeBadge(request.crudType)}>
                            {formatCrudType(request.crudType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs text-sm text-muted-foreground">
                            {request.blog?.content ?
                              request.blog.content.replace(/<[^>]*>/g, '').substring(0, 20) + '...' :
                              t.blogRequest.NoContentAvailable
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === 'PENDING' && (
                              <>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="text-green-600" disabled={actionLoading}>
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>{t.blogRequest.ApproveRequest}</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t.blogRequest.AreYouSureApproveBlogRequest}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>{t.blogRequest.Cancel}</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleVerifyRequest(request.id, 'APPROVE')}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        {t.blogRequest.Approve}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="text-red-600" disabled={actionLoading}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>{t.blogRequest.RejectRequest}</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t.blogRequest.AreYouSureRejectBlogRequest}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>{t.blogRequest.Cancel}</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleVerifyRequest(request.id, 'REJECT')}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {t.blogRequest.Reject}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
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
                  {t.blogRequest.ShowingOf} {pagination.page * pagination.size + 1} {t.blogRequest.to}{' '}
                  {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                  {pagination.totalElements} {t.blogRequest.request}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0 || loading}
                  >
                    {t.blogRequest.Previous}
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
                    {t.blogRequest.Next}
                  </Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* View Blog Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="min-w-4xl  max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedRequest?.crudType === 'CREATE' && t.blogRequest.NewBlogRequestDetails}
              {selectedRequest?.crudType === 'UPDATE' && t.blogRequest.BlogUpdateRequestDetails}
              {selectedRequest?.crudType === 'DELETE' && t.blogRequest.BlogDeletionRequestDetails}
              {!selectedRequest?.crudType && t.blogRequest.BlogRequestDetails}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.crudType === 'CREATE' && t.blogRequest.ReviewTheDetailsOfThisNewBlogSubmissionRequest}
              {selectedRequest?.crudType === 'UPDATE' && t.blogRequest.ReviewTheProposedChangesToTheExistingBlog}
              {selectedRequest?.crudType === 'DELETE' && t.blogRequest.ReviewTheBlogThatIsRequestedToBeDeleted}
              {!selectedRequest?.crudType && t.blogRequest.ReviewTheCompleteBlogPostSubmission}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.blogRequest.Title}</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.blog?.title || 'Untitled'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.blogRequest.Author}</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest?.blog?.authorName || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.blogRequest.RequestStatus}</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getStatusBadge(selectedRequest.status)}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.blogRequest.RequestType}</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getCrudTypeBadge(selectedRequest.crudType)}>
                        {formatCrudType(selectedRequest.crudType)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.blogRequest.RequestID}</label>
                    <p className="mt-1 text-sm text-gray-900">#{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.blogRequest.BlogStatus}</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.blog?.status || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              {selectedRequest.blog?.thumbnail && (
                <div>
                  <label className="text-sm font-medium text-gray-500">{t.blogRequest.Thumbnail}</label>
                  <div className="mt-2">
                    <img
                      alt="Blog thumbnail"
                      src={`${BASE_URL}/${selectedRequest.blog.thumbnail}`}
                      className="w-full max-w-sm h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <label className="text-sm font-medium text-gray-500">{t.blogRequest.BlogContent}</label>
                <div
                  className="mt-2 prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: selectedRequest.blog?.content || 'No content available' }}
                />
              </div>
            </div>
          )}


          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              {t.blogRequest.Close}
            </Button>
            {selectedRequest?.status === 'PENDING' && (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      {t.blogRequest.Reject}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.blogRequest.RejectBlogRequest}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.blogRequest.AreYouSureYouWantToRejectThisBlogRequest}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction

                        onClick={() => {
                          handleVerifyRequest(selectedRequest.id, 'REJECT')
                          setViewDialogOpen(false)
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t.blogRequest.Reject}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      {t.blogRequest.Approve}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.blogRequest.ApproveBlogRequest}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.blogRequest.AreYouSureYouWantToApproveThisBlogRequest}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.blogRequest.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleVerifyRequest(selectedRequest.id, 'APPROVE')
                          setViewDialogOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {t.blogRequest.Approve}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

            )}
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </div >
  );
}