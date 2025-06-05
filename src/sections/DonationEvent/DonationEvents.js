'use client';

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

function DonationEvents() {
    // const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')

    // Mock data for donation events
    const events = [
        {
            id: 1,
            name: "Ngày hội hiến máu nhân đạo 2024",
            location: "Trung tâm Y tế Quận 1, TP.HCM",
            startDate: "15/01/2024",
            endDate: "15/01/2024",
            startTime: "08:00",
            endTime: "17:00"
        },
        {
            id: 2,
            name: "Hiến máu cứu người - Sinh viên hành động",
            location: "Đại học Bách Khoa TP.HCM",
            startDate: "20/02/2024",
            endDate: "21/03/2024",
            startTime: "09:00",
            endTime: "16:00"
        },
        {
            id: 3,
            name: "Hiến máu tình nguyện - Vì cộng đồng",
            location: "Trung tâm Hiến máu Nhân đạo TP.HCM",
            startDate: "10/04/2024",
            endDate: "12/04/2024",
            startTime: "08:30",
            endTime: "17:30"
        }
    ]

    // Filter events based on search query
    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // const handleRegister = (eventId) => {
    //     // Navigate to registration page with event ID
    //     navigate(`/donation-registration/${eventId}`)
    // }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Sự Kiện Hiến Máu</h1>
            <p className="text-gray-600 mb-6">Tham gia các sự kiện hiến máu tình nguyện để cứu sống nhiều người</p>

            <div className="mx-auto mb-6">
                <Input
                    type="text"
                    placeholder="Tìm kiếm sự kiện, địa điểm, hoặc tổ chức..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full mb-4"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 mx-auto">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <Card key={event.id} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">{event.name}</CardTitle>
                                <CardDescription className="mt-2">
                                    {event.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><span className="font-medium">Ngày: </span>{event.startDate === event.endDate ? event.startDate : `${event.startDate} - ${event.endDate}`}</p>
                                <p><span className="font-medium">Thời gian: </span>{event.startTime} - {event.endTime}</p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={() => window.location.href = `/donation-registration/${event.id}`}
                                >
                                    Đăng ký tham gia
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Không tìm thấy sự kiện phù hợp</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DonationEvents
