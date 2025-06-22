'use client';

import React, { useState, useEffect, useContext } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { CalendarIcon, MapPinIcon, ArrowUpDown, X, Clock, Users, Building2, Droplets, LogIn } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination"
import { Calendar } from "../../components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"
import { format, isAfter, isBefore, isEqual, parse } from "date-fns"
import { useDonationEvents } from "@/context/donationEvent_context"
import { UserContext } from "@/context/user_context"
import { useRouter } from "next/navigation"

// Status and donation type mappings
const statusMap = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
    APPROVED: { label: 'Đã duyệt', variant: 'success', color: 'bg-green-100 text-green-800' },
    ONGOING: { label: 'Đang diễn ra', variant: 'default', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: 'Đã hoàn thành', variant: 'success', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive', color: 'bg-red-100 text-red-800' }
}

const donationTypeMap = {
    WHOLE_BLOOD: 'Máu toàn phần',
    PLASMA: 'Huyết tương',
    PLATELETS: 'Tiểu cầu',
    DOUBLE_RED_CELLS: 'Hồng cầu'
}

function DonationEvents() {
    // All hooks must be at the top, before any return or conditional
    const { events, organizers, loading, error, selectEventById } = useDonationEvents();
    const { loggedIn, isLoading: userLoading } = useContext(UserContext);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortOrder, setSortOrder] = useState('default') // 'default', 'asc', 'desc'
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const itemsPerPage = 6

    useEffect(() => {
        console.log("DonationEvents - Events:", events);
        console.log("DonationEvents - Organizers:", organizers);
    }, [events, organizers])

    // Reset to page 1 when filters change - MOVED TO TOP
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, dateRange, sortOrder])    // Handle registration button click
    const handleRegisterClick = (event) => {
        if (!loggedIn) {
            // Redirect to login page if not logged in
            router.push('/login');
            return;
        }
        
        selectEventById(event.id);
        router.push(`/donation-events/${event.id}`);
    };

    // All hooks are now at the top. Only after this, do conditional returns:
    // Show loading state
    // if (loading) {
    //     return (
    //         <div className="container mx-auto py-8 px-4">
    //             <h1 className="text-2xl font-bold mb-2">Sự kiện hiến máu</h1>
    //             <p className="text-gray-600 mb-6">Tham gia các sự kiện hiến máu tình nguyện để cứu sống nhiều người cần giúp đỡ.</p>
    //             <div className="text-center py-10">
    //                 <p className="text-gray-500">Đang tải sự kiện...</p>
    //             </div>
    //         </div>
    //     );
    // }

    // Show error state
    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-2">Sự kiện hiến máu</h1>
                <p className="text-gray-600 mb-6">Tham gia các sự kiện hiến máu tình nguyện để cứu sống nhiều người cần giúp đỡ.</p>
                <div className="text-center py-10">
                    <p className="text-red-500">Lỗi: {error}</p>
                    <p className="text-gray-500 mt-2">Không thể tải danh sách sự kiện</p>
                </div>
            </div>
        );
    }

    // Parse date string from DD/MM/YYYY format to Date object
    const parseDate = (dateString) => {
        if (!dateString) return null
        // Handle the new date format "DD-MM-YYYY"
        return parse(dateString, 'dd-MM-yyyy', new Date())
    }

    // Check if an event falls within the selected date range
    const isEventInDateRange = (event) => {
        if (!dateRange || (!dateRange.from && !dateRange.to)) return true

        const eventDate = parseDate(event.donationDate)

        // Safety check for invalid dates
        if (!eventDate) return true

        if (dateRange.from && dateRange.to) {
            // Check if event date is within the selected range
            return (
                (isAfter(eventDate, dateRange.from) || isEqual(eventDate, dateRange.from)) &&
                (isBefore(eventDate, dateRange.to) || isEqual(eventDate, dateRange.to))
            )
        } else if (dateRange.from) {
            // Only start date selected
            return isAfter(eventDate, dateRange.from) || isEqual(eventDate, dateRange.from)
        } else if (dateRange.to) {
            // Only end date selected
            return isBefore(eventDate, dateRange.to) || isEqual(eventDate, dateRange.to)
        }

        return true
    }    // Filter events based on search query and date range, excluding cancelled events
    // const filteredEvents = events.filter(event =>
    const filteredEvents = (events || []).filter(event =>
        event.status !== 'CANCELLED' && // Exclude cancelled events
        (event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.city.toLowerCase().includes(searchQuery.toLowerCase())) &&
        isEventInDateRange(event)
    )

    // Sort events
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortOrder === 'default') {
            return a.id - b.id
        } else if (sortOrder === 'asc') {
            // Sort by date ascending (older to newer)
            const dateA = parseDate(a.donationDate)
            const dateB = parseDate(b.donationDate)
            return dateA - dateB
        } else if (sortOrder === 'desc') {
            // Sort by date descending (newer to older)
            const dateA = parseDate(a.donationDate)
            const dateB = parseDate(b.donationDate)
            return dateB - dateA
        }
        return 0
    })

    // Calculate pagination
    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedEvents.slice(indexOfFirstItem, indexOfLastItem)

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // Toggle sort order
    const toggleSortOrder = () => {
        if (sortOrder === 'default') {
            setSortOrder('asc')
        } else if (sortOrder === 'asc') {
            setSortOrder('desc')
        } else {
            setSortOrder('default')
        }
    }    // Clear date filter
    const clearDateFilter = () => {
        setDateRange({ from: undefined, to: undefined })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
            <div className="container mx-auto py-8 px-4">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <div className="p-3 bg-red-500 rounded-full">
                            <Droplets className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            Sự kiện hiến máu
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Tham gia các sự kiện hiến máu tình nguyện để cứu sống nhiều người cần giúp đỡ.
                        Mỗi giọt máu của bạn có thể mang lại hy vọng cho những người đang cần.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-3/4">
                            <Input
                                type="text"
                                placeholder="Tìm kiếm sự kiện, địa điểm, địa chỉ, hoặc thành phố..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="text-lg border-gray-200 focus:border-red-300 focus:ring-red-200"
                            />
                        </div>
                        <div className="flex-1/4 gap-2">
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${dateRange.from || dateRange.to ? "text-foreground" : "text-muted-foreground"
                                            }`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.from || dateRange.to ? (
                                            dateRange.to ? (
                                                <>
                                                    {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : ""} -{" "}
                                                    {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : ""}
                                                </>
                                            ) : (
                                                dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : ""
                                            )
                                        ) : (
                                            "Chọn khoảng thời gian"
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={new Date()}
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            // Handle the case when clicking the same date twice
                                            if (range?.from && range.from === range.to) {
                                                // When clicking the same date, use it as both from and to
                                                setDateRange({
                                                    from: range.from,
                                                    to: range.from
                                                });
                                            } else {
                                                setDateRange(range || { from: undefined, to: undefined });
                                            }
                                        }}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            {(dateRange.from || dateRange.to) && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={clearDateFilter}
                                    className="shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex-1/4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleSortOrder}
                                className="shrink-0"
                                title="Sắp xếp theo ngày"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                {sortOrder !== 'default' && (
                                    <span className="sr-only">
                                        {sortOrder === 'asc' ? 'Sắp xếp từ cũ đến mới' : 'Sắp xếp từ mới đến cũ'}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                {currentItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <Droplets className="h-16 w-16 text-gray-300" />
                        </div>
                        <p className="text-xl text-gray-500 mb-2">Không tìm thấy sự kiện nào</p>
                        <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((event) => {
                            const eventStatus = statusMap[event.status] || { label: event.status, color: 'bg-gray-100 text-gray-800' };

                            return (
                                <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 overflow-hidden relative">
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                                            {eventStatus.label}
                                        </span>
                                    </div>

                                    <CardHeader className="pb-3 pt-6">
                                        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 pr-16">
                                            {event.name}
                                        </CardTitle>
                                        {event.donationType && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Droplets className="h-4 w-4 text-red-500" />
                                                <span className="text-sm font-medium text-red-600">
                                                    {donationTypeMap[event.donationType] || event.donationType}
                                                </span>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pb-4 space-y-3">                                        {/* Organizer Info - Only show if organizer data exists */}
                                        {((event.organizerId && organizers[event.organizerId]?.organizationName) ||
                                            event.organizer?.organizationName ||
                                            event.organizationName) && (
                                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-800">
                                                            {(event.organizerId && organizers[event.organizerId]?.organizationName) ||
                                                                event.organizer?.organizationName ||
                                                                event.organizationName}
                                                        </p>
                                                        {((event.organizerId && organizers[event.organizerId]?.contactNumber) ||
                                                            event.organizer?.contactNumber ||
                                                            event.organizerContact) && (
                                                                <p className="text-xs text-blue-600">
                                                                    {(event.organizerId && organizers[event.organizerId]?.contactNumber) ||
                                                                        event.organizer?.contactNumber ||
                                                                        event.organizerContact}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Location */}
                                        <div className="flex items-start gap-3">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-700">{event.location}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {event.address}, {event.ward}, {event.district}, {event.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                                            <p className="font-medium text-gray-700">{event.donationDate}</p>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                            <p className="text-gray-600">
                                                {event.timeSlotDtos && event.timeSlotDtos.length > 0 ? (
                                                    event.timeSlotDtos.length === 1 ?
                                                        `${event.timeSlotDtos[0].startTime} - ${event.timeSlotDtos[0].endTime}` :
                                                        `${event.timeSlotDtos.length} khung giờ khác nhau`
                                                ) : 'Chưa có khung giờ'}
                                            </p>
                                        </div>
                                        {/* Registration Status */}
                                        <div className="flex items-center gap-3">
                                            <Users className="h-5 w-5 text-gray-400" />
                                            <p className="text-gray-600">
                                                <span className="font-medium text-red-600">
                                                    {event.registeredMemberCount || 0}
                                                </span>
                                                <span className="text-gray-500">/{event.totalMemberCount}</span>
                                                <span className="ml-1">người đã đăng ký</span>
                                                {event.registeredMemberCount >= event.totalMemberCount && (
                                                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                        Đã đầy
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </CardContent>                                    <CardFooter className="pt-0 pb-6">
                                        <Button
                                            className={`w-full font-semibold py-2.5 shadow-md hover:shadow-lg transition-all duration-300 ${
                                                event.registeredMemberCount >= event.totalMemberCount
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : !loggedIn
                                                    ? 'bg-amber-500 hover:bg-amber-600'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                } text-white flex items-center justify-center gap-2`}
                                            onClick={() => handleRegisterClick(event)}
                                            disabled={event.registeredMemberCount >= event.totalMemberCount}
                                        >
                                            {event.registeredMemberCount >= event.totalMemberCount ? (
                                                'Đã đầy chỗ'
                                            ) : !loggedIn ? (
                                                <>
                                                    <LogIn className="h-4 w-4" />
                                                    Đăng nhập để đăng ký
                                                </>
                                            ) : (
                                                'Đăng ký tham gia'
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                                </PaginationItem>
                            )}

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                // Show current page, first page, last page, and pages around current
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={page === currentPage}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                }

                                // Show ellipsis
                                if (page === 2 && currentPage > 3) {
                                    return <PaginationEllipsis key="ellipsis-start" />
                                }

                                if (page === totalPages - 1 && currentPage < totalPages - 2) {
                                    return <PaginationEllipsis key="ellipsis-end" />
                                } return null
                            })}

                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}            </div>
        </div>
    )
}

export default DonationEvents
