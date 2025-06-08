'use client';

import React, { useState, useEffect } from 'react'
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
import { CalendarIcon, MapPinIcon, ArrowUpDown, X } from "lucide-react"
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

function DonationEvents() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortOrder, setSortOrder] = useState('default') // 'default', 'asc', 'desc'
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const itemsPerPage = 6

    // Mock data for donation events
    const events = [
        {
            id: 1,
            name: "Ngày hội hiến máu nhân đạo",
            location: "Trung tâm Y tế Quận 1, TP.HCM",
            date: "15/01/2024",
            shift: "8:00 - 17:00"
        },
        {
            id: 2,
            name: "Chương trình hiến máu cứu người",
            location: "Đại học Bách Khoa TP.HCM",
            date: "20/02/2024",
            shift: "8:00 - 11:00"
        },
        {
            id: 3,
            name: "Hiến máu tình nguyện vì cộng đồng",
            location: "Trung tâm Hiến máu Nhân đạo TP.HCM",
            date: "10/04/2024",
            shift: "14:00 - 17:00"
        },
        {
            id: 4,
            name: "Ngày hội hiến máu sinh viên",
            location: "Đại học Khoa học Tự nhiên",
            date: "10/06/2024",
            shift: "8:00 - 11:00"
        },
        {
            id: 5,
            name: "Hiến máu nhân đạo cứu trẻ hoàn cảnh khó khăn",
            location: "Bệnh viện Nhi Đồng 1",
            date: "10/07/2024",
            shift: "8:00 - 17:00"
        },
        {
            id: 6,
            name: "Tuần lễ hiến máu toàn quốc",
            location: "Viện Huyết học & Truyền máu TW",
            date: "01/08/2024",
            shift: "14:00 - 17:00"
        },
        {
            id: 7,
            name: "Hiến máu tình nguyện mùa hè",
            location: "Đại học Sư Phạm TP.HCM",
            date: "15/08/2024",
            shift: "8:00 - 11:00"
        },
        {
            id: 8,
            name: "Chương trình hiến máu khu vực miền Nam",
            location: "Nhà Văn hóa Thanh niên",
            date: "22/09/2024",
            shift: "8:00 - 17:00"
        },
        {
            id: 9,
            name: "Hiến máu nhân đạo mùa lễ hội",
            location: "Công viên Lê Văn Tám",
            date: "10/10/2024",
            shift: "14:00 - 17:00"
        }
    ]

    // Parse date string from DD/MM/YYYY format to Date object
    const parseDate = (dateString) => {
        if (!dateString) return null
        return parse(dateString, 'dd/MM/yyyy', new Date())
    }

    // Check if an event falls within the selected date range
    const isEventInDateRange = (event) => {
        if (!dateRange || (!dateRange.from && !dateRange.to)) return true

        const eventDate = parseDate(event.date)

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
    }

    // Filter events based on search query and date range
    const filteredEvents = events.filter(event =>
        (event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
        isEventInDateRange(event)
    )

    // Sort events
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortOrder === 'default') {
            return a.id - b.id
        } else if (sortOrder === 'asc') {
            // Sort by date ascending (older to newer)
            const dateA = parseDate(a.date)
            const dateB = parseDate(b.date)
            return dateA - dateB
        } else if (sortOrder === 'desc') {
            // Sort by date descending (newer to older)
            const dateA = parseDate(a.date)
            const dateB = parseDate(b.date)
            return dateB - dateA
        }
        return 0
    })

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, dateRange, sortOrder])

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
    }

    // Clear date filter
    const clearDateFilter = () => {
        setDateRange({ from: undefined, to: undefined })
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-2">Sự kiện hiến máu</h1>
            <p className="text-gray-600 mb-6">Tham gia các sự kiện hiến máu tình nguyện để cứu sống nhiều người cần giúp đỡ.</p>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm sự kiện, địa điểm, hoặc tổ chức..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-2">
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

            {currentItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Không tìm thấy sự kiện nào phù hợp với tiêu chí tìm kiếm.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentItems.map((event) => (
                        <Card key={event.id} className="shadow-sm border border-gray-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">{event.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2 space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPinIcon className="h-4 w-4 text-gray-500 mt-1" />
                                    <CardDescription className="text-gray-600">
                                        {event.location}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                                    <p className="text-sm text-gray-700">{event.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <p className="text-sm text-gray-700">{event.shift}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 pt-2">
                                <Button
                                    className="ml-auto w-auto bg-red-500 hover:bg-red-600 text-sm px-4"
                                    onClick={() => window.location.href = `/donation-registration/${event.id}`}
                                >
                                    Đăng ký
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
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
                            }

                            return null
                        })}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}

export default DonationEvents
