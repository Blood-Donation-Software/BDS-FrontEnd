'use client';

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/user_context';
import { getDonationHistory } from '@/apis/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    MapPin, 
    Droplets, 
    Activity, 
    ChevronLeft, 
    ChevronRight, 
    User,
    TrendingUp,
    Clock,
    Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Status mapping for Vietnamese
const statusMap = {
    PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
    APPROVED: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
    ONGOING: { label: 'Đang diễn ra', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
};

// Donation type mapping
const donationTypeMap = {
    WHOLE_BLOOD: 'Máu toàn phần',
    PLASMA: 'Huyết tương',
    PLATELETS: 'Tiểu cầu',
    DOUBLE_RED_CELLS: 'Hồng cầu'
};

function Dashboard() {
    const { profile, account, loggedIn, isLoading: userLoading } = useContext(UserContext);
    const router = useRouter();
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Redirect if not logged in
    useEffect(() => {
        if (!userLoading && !loggedIn) {
            router.push('/login');
        }
    }, [loggedIn, userLoading, router]);

    // Fetch donation history
    const fetchDonationHistory = async (page = 0) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDonationHistory(page, pageSize, 'registrationDate', false);
            
            setDonationHistory(response.content || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching donation history:', error);
            setError('Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.');
            toast.error('Không thể tải lịch sử hiến máu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loggedIn) {
            fetchDonationHistory();
        }
    }, [loggedIn]);

    // Calculate statistics
    const stats = {
        totalDonations: totalElements,
        completedDonations: donationHistory.filter(item => item.registrationStatus === 'COMPLETED').length,
        totalVolume: donationHistory
            .filter(item => item.donationVolume && item.registrationStatus === 'COMPLETED')
            .reduce((sum, item) => sum + item.donationVolume, 0),
        mostRecentDonation: donationHistory.length > 0 ? donationHistory[0] : null
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchDonationHistory(newPage);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (userLoading || !loggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-500 rounded-full">
                            <Activity className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
                            <p className="text-gray-600">Theo dõi lịch sử hiến máu của bạn</p>
                        </div>
                    </div>
                    
                    {/* User Welcome */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Chào mừng, {profile?.name || account?.email}!
                                </h2>
                                <p className="text-gray-600">
                                    Cảm ơn bạn đã tham gia vào hoạt động hiến máu tình nguyện
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-0 shadow-md bg-gradient-to-r from-red-500 to-red-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">Tổng số lần đăng ký</p>
                                    <p className="text-3xl font-bold">{stats.totalDonations}</p>
                                </div>
                                <Droplets className="h-8 w-8 text-red-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Đã hoàn thành</p>
                                    <p className="text-3xl font-bold">{stats.completedDonations}</p>
                                </div>
                                <Award className="h-8 w-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Tổng thể tích (ml)</p>
                                    <p className="text-3xl font-bold">{stats.totalVolume.toFixed(0)}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Lần gần nhất</p>
                                    <p className="text-lg font-semibold">
                                        {stats.mostRecentDonation 
                                            ? formatDate(stats.mostRecentDonation.registrationDate)
                                            : 'Chưa có'
                                        }
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Donation History */}
                <Card className="shadow-lg border-0">
                    <CardHeader className="bg-white border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Activity className="h-6 w-6 text-red-500" />
                            Lịch sử hiến máu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải lịch sử...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={() => fetchDonationHistory(currentPage)} variant="outline">
                                    Thử lại
                                </Button>
                            </div>
                        ) : donationHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <Droplets className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-xl text-gray-500 mb-2">Chưa có lịch sử hiến máu</p>
                                <p className="text-gray-400 mb-4">Hãy tham gia các sự kiện hiến máu để có lịch sử tại đây</p>
                                <Button onClick={() => router.push('/donation-events')} className="bg-red-500 hover:bg-red-600">
                                    Tham gia sự kiện hiến máu
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-gray-100">
                                    {donationHistory.map((donation, index) => {
                                        const status = statusMap[donation.registrationStatus] || 
                                            { label: donation.registrationStatus, color: 'bg-gray-100 text-gray-800' };
                                        
                                        return (
                                            <div key={donation.registrationId || index} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                {donation.donationName || 'Sự kiện hiến máu'}
                                                            </h3>
                                                            <Badge className={`${status.color} border-0 ml-4`}>
                                                                {status.label}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>Đăng ký: {formatDate(donation.registrationDate)}</span>
                                                            </div>
                                                            
                                                            {donation.donationDate && (
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4" />
                                                                    <span>Hiến máu: {formatDate(donation.donationDate)}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {donation.donationLocation && (
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span className="truncate">{donation.donationLocation}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {donation.donationType && (
                                                                <div className="flex items-center gap-2">
                                                                    <Droplets className="h-4 w-4" />
                                                                    <span>{donationTypeMap[donation.donationType] || donation.donationType}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {donation.donationVolume && (
                                                                <div className="flex items-center gap-2">
                                                                    <TrendingUp className="h-4 w-4" />
                                                                    <span>{donation.donationVolume} ml</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        <div className="text-sm text-gray-600">
                                            Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} 
                                            {' '}trong tổng số {totalElements} kết quả
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 0}
                                                className="flex items-center gap-1"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Trước
                                            </Button>
                                            
                                            <span className="text-sm text-gray-600 px-3">
                                                Trang {currentPage + 1} / {totalPages}
                                            </span>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages - 1}
                                                className="flex items-center gap-1"
                                            >
                                                Sau
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Dashboard;
