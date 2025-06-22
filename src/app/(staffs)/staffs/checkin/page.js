'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle, 
    Calendar, 
    Clock, 
    MapPin, 
    Heart, 
    ArrowLeft, 
    User,
    AlertCircle,
    QrCode,
    UserCheck,
    UserX
} from 'lucide-react';
import { getCheckinInfo, checkInDonor } from '@/apis/bloodDonation';
import { toast } from 'sonner';

function CheckinPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [donorInfo, setDonorInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checking, setChecking] = useState(false);
    
    const token = searchParams.get('token');
    const eventId = searchParams.get('eventId');

    useEffect(() => {
        if (token && eventId) {
            fetchDonorInfo();
        } else {
            setError('Token hoặc Event ID không hợp lệ');
            setLoading(false);
        }
    }, [token, eventId]);

    const fetchDonorInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Fetching donor info for token:', token);
              const info = await getCheckinInfo(eventId, token);
            console.log('✅ Donor info received:', info);
            console.log('🔍 jsonForm type:', typeof info.jsonForm);
            console.log('🔍 jsonForm value:', info.jsonForm);
            setDonorInfo(info);
            
        } catch (error) {
            console.error('❌ Error fetching donor info:', error);
            
            if (error.response) {
                if (error.response.status === 404) {
                    setError('Không tìm thấy thông tin đăng ký');
                } else if (error.response.status === 400) {
                    setError('Token không hợp lệ hoặc đã hết hạn');
                } else {
                    setError(`Lỗi server: ${error.response.status}`);
                }
            } else {
                setError('Có lỗi xảy ra khi tải thông tin');
            }
        } finally {
            setLoading(false);
        }
    };    const handleCheckIn = async (action) => {
        try {
            setChecking(true);
            console.log(`🔄 Checking in donor with action: ${action}`);
            
            await checkInDonor(eventId, action, token);
            console.log('✅ Check-in successful');
            
            // Show success toast
            if (action === 'approve') {
                toast.success('Đã phê duyệt thành công! Người hiến tặng đã được check-in.');
            } else {
                toast.success('Đã từ chối thành công! Người hiến tặng đã được thông báo.');
            }
            
            // Refresh donor info to show updated status
            await fetchDonorInfo();
            
            // After a short delay, navigate back or to a success page
            setTimeout(() => {
                // You can customize this navigation based on your needs
                // For now, we'll just show the updated info
                console.log('Check-in process completed');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error during check-in:', error);
            setError('Có lỗi xảy ra khi check-in');
            
            // Show error toast
            if (action === 'approve') {
                toast.error('Không thể phê duyệt. Vui lòng thử lại.');
            } else {
                toast.error('Không thể từ chối. Vui lòng thử lại.');
            }
        } finally {
            setChecking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-lg font-medium text-gray-900">Đang tải thông tin...</div>
                    <div className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="text-lg font-medium text-gray-900">Có lỗi xảy ra</div>
                    <div className="text-sm text-gray-500 mt-2">{error}</div>
                    <Button 
                        onClick={() => router.push('/staff')} 
                        className="mt-4"
                        variant="outline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!donorInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">Không tìm thấy thông tin</div>
                    <div className="text-sm text-gray-500 mt-2">Vui lòng kiểm tra lại mã QR</div>
                </div>
            </div>
        );
    }    const profile = donorInfo.profile;
    const currentStatus = donorInfo.status;
    
    // Handle jsonForm - it might already be parsed or be a JSON string
    let formData = {};
    if (donorInfo.jsonForm) {
        if (typeof donorInfo.jsonForm === 'string') {
            try {
                formData = JSON.parse(donorInfo.jsonForm);
            } catch (e) {
                console.error('Error parsing jsonForm string:', e);
                formData = {};
            }
        } else if (typeof donorInfo.jsonForm === 'object') {
            formData = donorInfo.jsonForm;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push('/staff')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>
                        <div className="flex items-center gap-2">
                            <QrCode className="h-6 w-6 text-blue-500" />
                            <h1 className="text-xl font-bold text-gray-900">Check-in người hiến máu</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Donor Information */}
                <div className="max-w-4xl mx-auto mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Thông tin người hiến máu
                            </CardTitle>
                        </CardHeader>                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-gray-700">Họ và tên</p>
                                        <p className="text-gray-900">{profile.firstName} {profile.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Email</p>
                                        <p className="text-gray-900">{profile.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Số điện thoại</p>
                                        <p className="text-gray-900">{profile.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-gray-700">CMND/CCCD</p>
                                        <p className="text-gray-900">{profile.personalId}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Ngày sinh</p>
                                        <p className="text-gray-900">{profile.dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Địa chỉ</p>
                                        <p className="text-gray-900">{profile.address}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Status Display */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-700">Trạng thái hiện tại:</p>
                                    {currentStatus === 'APPROVED' && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Đã phê duyệt
                                        </Badge>
                                    )}
                                    {currentStatus === 'REJECTED' && (
                                        <Badge className="bg-red-100 text-red-800 border-red-300">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Đã từ chối
                                        </Badge>
                                    )}
                                    {currentStatus === 'PENDING' && (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Chờ xử lý
                                        </Badge>
                                    )}
                                    {currentStatus === 'CHECKED_IN' && (
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                            <UserCheck className="h-3 w-3 mr-1" />
                                            Đã check-in
                                        </Badge>
                                    )}
                                    {!currentStatus && (
                                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Không xác định
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Health Survey Information */}
                {formData && Object.keys(formData).length > 0 && (
                    <div className="max-w-4xl mx-auto mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Thông tin khảo sát sức khỏe
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">Kinh nghiệm hiến máu:</p>
                                        <p className="text-gray-600">
                                            {formData.experience === 'yes' ? 'Đã từng hiến máu' : 'Lần đầu tiên'}
                                        </p>
                                        {formData.experience === 'yes' && formData.experienceDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.experienceDetails}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">Tình trạng sức khỏe:</p>
                                        <p className="text-gray-600">
                                            {formData.currentIllness === 'yes' ? 'Có vấn đề sức khỏe' : 'Khỏe mạnh'}
                                        </p>
                                        {formData.currentIllness === 'yes' && formData.currentIllnessDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.currentIllnessDetails}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">Bệnh đã từng mắc:</p>
                                        <p className="text-gray-600">
                                            {formData.pastDiseases === 'yes' ? 'Đã từng mắc bệnh nghiêm trọng' : 'Chưa từng mắc bệnh nghiêm trọng'}
                                        </p>
                                        {formData.pastDiseases === 'yes' && formData.pastDiseasesDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.pastDiseasesDetails}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">Hoạt động gần đây:</p>
                                        <p className="text-gray-600">
                                            {formData.recentActivities === 'yes' ? 'Có hoạt động đặc biệt' : 'Không có hoạt động đặc biệt'}
                                        </p>
                                        {formData.recentActivities === 'yes' && formData.recentActivitiesDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.recentActivitiesDetails}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}                {/* Check-in Actions */}
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-green-500" />
                                Thao tác check-in
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                {/* Show different content based on status */}
                                {currentStatus === 'APPROVED' && (
                                    <div className="space-y-4">
                                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                                            <div className="flex items-center">
                                                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                                <p className="text-green-800 font-medium">
                                                    Người hiến tặng đã được phê duyệt hiến máu
                                                </p>
                                            </div>
                                        </div>                                        <p className="text-sm text-gray-600">
                                            Quyết định đã được thực hiện. Người hiến tặng có thể tiến hành hiến máu.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                                            <Button
                                                onClick={() => window.location.reload()}
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <QrCode className="h-4 w-4" />
                                                Quét QR khác
                                            </Button>
                                            <Button
                                                onClick={() => router.push('/staff')}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Về trang chính
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                
                                {currentStatus === 'REJECTED' && (
                                    <div className="space-y-4">
                                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                            <div className="flex items-center">
                                                <XCircle className="h-5 w-5 text-red-400 mr-2" />
                                                <p className="text-red-800 font-medium">
                                                    Người hiến tặng đã bị từ chối hiến máu
                                                </p>
                                            </div>
                                        </div>                                        <p className="text-sm text-gray-600">
                                            Quyết định đã được thực hiện. Người hiến tặng không thể hiến máu trong lần này.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                                            <Button
                                                onClick={() => window.location.reload()}
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <QrCode className="h-4 w-4" />
                                                Quét QR khác
                                            </Button>
                                            <Button
                                                onClick={() => router.push('/staff')}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Về trang chính
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                
                                {(currentStatus === 'PENDING' || !currentStatus) && (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 mb-6">
                                            Sau khi kiểm tra thông tin, vui lòng chọn hành động phù hợp:
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button
                                                onClick={() => handleCheckIn('approve')}
                                                disabled={checking}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <UserCheck className="h-4 w-4" />
                                                Cho phép hiến máu
                                            </Button>
                                            <Button
                                                onClick={() => handleCheckIn('reject')}
                                                disabled={checking}
                                                variant="destructive"
                                                className="flex items-center gap-2"
                                            >
                                                <UserX className="h-4 w-4" />
                                                Từ chối hiến máu
                                            </Button>
                                        </div>
                                        {checking && (
                                            <div className="flex items-center justify-center gap-2 mt-4">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                                <span className="text-sm text-gray-600">Đang xử lý...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CheckinPage;
