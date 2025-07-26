'use client'
import React, { useState, useEffect } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowUpDown, Search, Eye, Edit, Trash2, Plus, RefreshCw, BookOpen } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getAllBlogs, deleteBlog } from '@/apis/blog'
import { BASE_URL } from '@/global-config'

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Published' },
  { value: 'INACTIVE', label: 'Deleted' }
]

// Status badge styling
const getStatusBadge = (status) => {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    INACTIVE: 'bg-red-100 text-red-800 border-red-200'
  }
  return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Format status for display
const formatStatus = (status) => {
  const statusMap = {
    ACTIVE: 'Published',
    INACTIVE: 'Deleted',
  }
  return statusMap[status] || status
}

export default function BlogManagement() {
    const [blogs, setBlogs] = useState([])
    const [filteredBlogs, setFilteredBlogs] = useState([])
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
      status: 'ALL'
    })
    const [sortConfig, setSortConfig] = useState({
      key: 'id',
      direction: 'desc'
    })
    const [selectedBlog, setSelectedBlog] = useState(null)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Fetch blogs from API
    const fetchBlogs = async (page = 0, size = 10) => {
      try {
        setLoading(true)
        setError(null)

        const response = await getAllBlogs(page, size, sortConfig.key, sortConfig.direction === 'asc')

        if (response.content) {
          setBlogs(response.content)
          setPagination({
            page: response.number || response.pageNumber || 0,
            size: response.size || response.pageSize || 10,
            totalElements: response.totalElements || 0,
            totalPages: response.totalPages || 0
          })
        } else {
          setBlogs([])
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setError('Failed to load blogs. Please try again.')
        toast.error('Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchBlogs(pagination.page, pagination.size)
    }, [])

    useEffect(() => {
      fetchBlogs(pagination.page, pagination.size)
    }, [sortConfig])

    useEffect(() => {
      let result = [...blogs]

      // Search filter
      if (filters.search) {
        const term = filters.search.toLowerCase()
        result = result.filter(blog => {
          if (!blog) return false
          return (
            blog.title?.toLowerCase().includes(term) ||
            blog.content?.toLowerCase().includes(term) ||
            blog.id?.toString().includes(term)
          )
        })
      }

      // Status filter
      if (filters.status && filters.status !== 'ALL') {
        result = result.filter(blog => blog && blog.status === filters.status)
      }

      setFilteredBlogs(result)
    }, [blogs, filters])

    const handleSort = (key) => {
      let direction = 'asc'
      if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
      setSortConfig({ key, direction })
    }

    const handlePageChange = (newPage) => {
      setPagination(prev => ({ ...prev, page: newPage }))
      fetchBlogs(newPage, pagination.size)
    }

    const handlePageSizeChange = (newSize) => {
      const size = parseInt(newSize)
      setPagination(prev => ({ ...prev, size, page: 0 }))
      fetchBlogs(0, size)
    }

    const handleRefresh = () => {
      fetchBlogs(pagination.page, pagination.size)
    }

    // Handle blog deletion
    const handleDeleteBlog = async (blogId) => {
      try {
        setActionLoading(true)
        await deleteBlog(blogId)
        toast.success('Request of deletion submitted!')
        await fetchBlogs(pagination.page, pagination.size)
      } catch (error) {
        console.error('Error deleting blog:', error)
        const errorMessage = error.response?.data?.message || error.message
        toast.error(`Failed to delete blog: ${errorMessage}`)
      } finally {
        setActionLoading(false)
      }
    }

    // Handle view blog details
    const handleViewBlog = (blog) => {
      setSelectedBlog(blog)
      setViewDialogOpen(true)
    }

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown'
      try {
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
                                Blog Management
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage and review blog posts ({pagination.totalElements} total)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleRefresh} disabled={loading} variant="outline">
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Loading...' : 'Refresh'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-row mb-4 space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search blogs..."
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
                    </div>

                    {/* Page Size Selector */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-muted-foreground">
                            {pagination.totalElements > 0 && (
                                `Showing ${Math.min(filteredBlogs.length, pagination.size)} of ${pagination.totalElements} blogs`
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Blogs per page:</span>
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
                                    <Button variant="ghost" onClick={() => handleSort('title')}>
                                        Title <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('status')}>
                                        Status <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            <span className="ml-2">Loading blogs...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredBlogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="text-muted-foreground">
                                            {blogs.length === 0 ? 'No blogs found' : 'No blogs match your filters'}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBlogs.filter(blog => blog && blog.id).map((blog) => (
                                    <TableRow key={blog.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="font-medium">{blog.title || 'Untitled'}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: #{blog.id}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusBadge(blog.status)}>
                                                {formatStatus(blog.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {blog.authorName || 'Unknown'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleViewBlog(blog)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        // Navigate to edit page
                                                        window.location.href = `/blog/edit/${blog.id}`
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="text-red-600" disabled={actionLoading}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this blog? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDeleteBlog(blog.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {pagination.page * pagination.size + 1} to{' '}
                                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                                {pagination.totalElements} blogs
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

            {/* View Blog Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="min-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Blog Details
                        </DialogTitle>
                        <DialogDescription>
                            Review the complete blog post details
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedBlog && (
                        <div className="space-y-6">
                            {/* Blog Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Title</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedBlog.title || 'Untitled'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Author Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedBlog.authorName || 'Unknown'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <div className="mt-1">
                                        <Badge variant="outline" className={getStatusBadge(selectedBlog.status)}>
                                            {formatStatus(selectedBlog.status)}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Created Date</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBlog.creationDate)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Blog ID</label>
                                    <p className="mt-1 text-sm text-gray-900">#{selectedBlog.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBlog.lastModifiedDate)}</p>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {selectedBlog.thumbnail && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Thumbnail</label>
                                    <div className="mt-2">
                                        <img
                                            src={`${BASE_URL}/${selectedBlog.thumbnail}`} 
                                            alt="Blog thumbnail" 
                                            className="w-full max-w-sm h-48 object-cover rounded-lg border"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div>
                                <label className="text-sm font-medium text-gray-500">Blog Content</label>
                                <div 
                                    className="mt-2 prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto"
                                    dangerouslySetInnerHTML={{ __html: selectedBlog.content || 'No content available' }}
                                />
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button 
                            onClick={() => {
                                window.location.href = `/blog/edit/${selectedBlog?.id}`
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Edit Blog
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}