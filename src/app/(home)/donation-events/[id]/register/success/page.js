'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable';
import { 
    CheckCircle, 
    Calendar, 
    Clock, 
    MapPin, 
    Heart, 
    ArrowLeft, 
    Mail,
    Phone,
    User,
    AlertCircle,
    QrCode,
    Download
} from 'lucide-react';
import { useDonationEvents } from '@/context/donationEvent_context';
import { UserContext } from '@/context/user_context';
import { getCheckinToken } from '@/apis/bloodDonation';
import { convertBloodType } from '@/utils/utils';

function RegistrationSuccess() {
    const router = useRouter();
    const params = useParams();
    const { selectedEvent, selectedTimeSlot, lastRegistration, clearSelection, selectEventById } = useDonationEvents();
    const { profile, account } = useContext(UserContext);
    
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loadingQR, setLoadingQR] = useState(false);
    const [qrError, setQrError] = useState(null);

    useEffect(() => {
        if (params?.id && !selectedEvent) {
            selectEventById(params.id);
        }
    }, [params?.id, selectedEvent, selectEventById]);   
    useEffect(() => {
        if (params?.id) {
            fetchQRCode();
        }
    }, [params?.id]);

    const downloadQRCode = () => {
        if (qrCodeUrl) {
            const link = document.createElement('a');
            link.download = `qr-code-checkin.png`;
            link.href = qrCodeUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };    const fetchQRCode = async () => {
        try {
            setLoadingQR(true);
            setQrError(null);
            
            const response = await getCheckinToken(params.id);
            const token = response.checkinToken || response.token || response;
            
            if (!token || typeof token !== 'string') {
                throw new Error('Invalid token received from server');
            }
            
            // Generate QR code with only the token
            const qrCodeDataUrl = await QRCode.toDataURL(token, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            setQrCodeUrl(qrCodeDataUrl);
            
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setQrError('Không tìm thấy đăng ký. Vui lòng kiểm tra lại.');
                } else if (error.response.status === 401) {
                    setQrError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                } else if (error.response.status === 400) {
                    const errorMessage = typeof error.response.data === 'string' 
                        ? error.response.data 
                        : 'Yêu cầu không hợp lệ';
                    setQrError(errorMessage);
                } else {
                    setQrError(`Lỗi server: ${error.response.status}`);
                }
            } else if (error.message) {
                setQrError(`Lỗi kết nối: ${error.message}`);
            } else {
                setQrError('Có lỗi xảy ra khi tải mã QR.');
            }
        } finally {
            setLoadingQR(false);
        }
    };


    const handleBackToEvents = () => {
        clearSelection();
        router.push('/donation-events');
    };

    const handleViewEventDetails = () => {
        router.push(`/donation-events/${params.id}`);
    };    if (!params?.id && !selectedEvent && !lastRegistration) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">Không tìm thấy thông tin đăng ký</div>
                    <div className="text-sm text-gray-500 mt-2">Vui lòng đăng ký lại hoặc kiểm tra thông tin</div>
                    <Button 
                        onClick={() => router.push('/donation-events')} 
                        className="mt-4"
                        variant="outline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Về danh sách sự kiện
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleBackToEvents}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Về danh sách sự kiện
                        </Button>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            <h1 className="text-xl font-bold text-gray-900">Đăng ký thành công!</h1>
                        </div>
                    </div>
                </div>
            </div>            <div className="container mx-auto px-4 py-8">
                {/* Success Message */}
                <div className="max-w-6xl mx-auto mb-8">
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-green-800 mb-2">
                                    Đăng ký hiến máu thành công!
                                </h2>
                                <p className="text-green-700 mb-4">
                                    Cảm ơn bạn đã đăng ký tham gia sự kiện hiến máu. Thông tin đăng ký đã được ghi nhận.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content with Resizable Layout */}
                <div className="max-w-6xl mx-auto mb-8">
                    <ResizablePanelGroup
                        direction="horizontal"
                        className="min-h-[600px] rounded-lg border"
                    >
                        {/* Left Panel - Profile & Event Info */}
                        <ResizablePanel defaultSize={50} minSize={30}>
                            <div className="h-full p-6 space-y-6">
                                {/* Donor Profile */}
                                {profile && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-blue-500" />
                                                Thông tin người hiến tặng
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {profile.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{account?.email}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                                                        <p className="text-gray-900">{profile.phone || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Ngày sinh</p>
                                                        <p className="text-gray-900">{profile.dateOfBirth || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">CMND/CCCD</p>
                                                        <p className="text-gray-900">{profile.personalId || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Nhóm máu</p>
                                                        <p className="text-gray-900">{convertBloodType(profile.bloodType) || 'Chưa xác định'}</p>
                                                    </div>
                                                </div>
                                                
                                                {profile.address && (
                                                    <div className="mt-4">
                                                        <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                                                        <p className="text-gray-900">{profile.address}, {profile.ward}, {profile.district}, {profile.city}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Event Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Heart className="h-5 w-5 text-red-500" />
                                            Thông tin sự kiện
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {selectedEvent?.name || lastRegistration?.eventName || 'Sự kiện hiến máu'}
                                            </h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Ngày hiến máu</p>
                                                    <p className="text-gray-600">{selectedEvent?.donationDate || 'Đang cập nhật'}</p>
                                                </div>
                                            </div>
                                              <div className="flex items-start gap-3">
                                                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Thời gian</p>
                                                    <p className="text-gray-600">
                                                        {(() => {
                                                            // First, try to get from lastRegistration
                                                            if (lastRegistration?.timeSlot?.startTime && lastRegistration?.timeSlot?.endTime) {
                                                                return `${lastRegistration.timeSlot.startTime} - ${lastRegistration.timeSlot.endTime}`;
                                                            }
                                                            
                                                            // Second, try to get from selectedEvent and selectedTimeSlot
                                                            if (selectedTimeSlot !== null && selectedEvent?.timeSlotDtos?.[selectedTimeSlot]) {
                                                                const slot = selectedEvent.timeSlotDtos[selectedTimeSlot];
                                                                return `${slot.startTime} - ${slot.endTime}`;
                                                            }
                                                            
                                                            // Third, try to get from selectedEvent with any available time slot
                                                            if (selectedEvent?.timeSlotDtos?.length > 0) {
                                                                const firstSlot = selectedEvent.timeSlotDtos[0];
                                                                return `${firstSlot.startTime} - ${firstSlot.endTime}`;
                                                            }
                                                            
                                                            return 'Chưa xác định';
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Địa điểm</p>
                                                    <p className="text-gray-600">{selectedEvent?.hospital || 'Đang cập nhật'}</p>
                                                    {selectedEvent && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {selectedEvent.address}, {selectedEvent.ward}, {selectedEvent.district}, {selectedEvent.city}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Right Panel - Registration Summary & QR Code */}
                        <ResizablePanel defaultSize={50} minSize={30}>
                            <div className="h-full p-6 space-y-6">
                                {/* Registration Summary */}
                                {lastRegistration && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                Thông tin khảo sát sức khỏe
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="font-medium text-gray-700 mb-2">Kinh nghiệm hiến máu:</p>
                                                    <p className="text-gray-600">
                                                        {lastRegistration.experience === 'yes' ? 'Đã từng hiến máu' : 'Lần đầu tiên'}
                                                    </p>
                                                    {lastRegistration.experience === 'yes' && lastRegistration.experienceDetails && (
                                                        <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                            {lastRegistration.experienceDetails}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <p className="font-medium text-gray-700 mb-2">Tình trạng sức khỏe:</p>
                                                    <p className="text-gray-600">
                                                        {lastRegistration.currentIllness === 'yes' ? 'Có vấn đề sức khỏe' : 'Khỏe mạnh'}
                                                    </p>
                                                    {lastRegistration.currentIllness === 'yes' && lastRegistration.currentIllnessDetails && (
                                                        <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                            {lastRegistration.currentIllnessDetails}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* QR Code Section */}
                                <Card className="flex-1">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <QrCode className="h-5 w-5 text-purple-500" />
                                            Mã QR check-in
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center">
                                            {loadingQR ? (
                                                <div className="flex flex-col items-center space-y-4">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                                                    <p className="text-gray-600">Đang tải mã QR...</p>
                                                </div>
                                            ) : qrError ? (
                                                <div className="flex flex-col items-center space-y-4">
                                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                        <AlertCircle className="h-8 w-8 text-red-500" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-red-600 font-medium">Không thể tải mã QR</p>
                                                        <p className="text-sm text-gray-500 mt-1">{qrError}</p>
                                                        <Button 
                                                            onClick={fetchQRCode} 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="mt-3"
                                                        >
                                                            Thử lại
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : qrCodeUrl ? (
                                                <div className="space-y-4">
                                                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                                                        <img 
                                                            src={qrCodeUrl} 
                                                            alt="QR Code for check-in" 
                                                            className="w-40 h-40 mx-auto"
                                                            onError={() => setQrError('Không thể hiển thị mã QR')}
                                                        />
                                                    </div>
                                                    <div className="text-center space-y-2">
                                                        <p className="font-semibold text-gray-900">
                                                            Mã QR check-in của bạn
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Xuất trình mã QR này cho nhân viên khi đến địa điểm hiến máu
                                                        </p>
                                                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                                                            💡 <strong>Lưu ý:</strong> Tải xuống để sử dụng khi không có mạng
                                                        </div>
                                                        <div className="flex flex-col gap-2 mt-4">
                                                            <Button 
                                                                onClick={downloadQRCode}
                                                                variant="outline"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                Tải xuống mã QR
                                                            </Button>
                                                            <Button 
                                                                onClick={fetchQRCode} 
                                                                variant="outline" 
                                                                className="flex items-center gap-2"
                                                            >
                                                                <QrCode className="h-4 w-4" />
                                                                Tạo lại mã QR
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 space-y-4">
                                                    <div className="text-gray-500">
                                                        <QrCode className="h-12 w-12 mx-auto mb-2" />
                                                        <p>Đang tải mã QR check-in...</p>
                                                    </div>
                                                    <Button 
                                                        onClick={fetchQRCode}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <QrCode className="h-4 w-4" />
                                                        Thử tải QR thủ công
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

                {/* Important Notes */}
                <div className="max-w-4xl mx-auto mb-8">
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-800">
                                <AlertCircle className="h-5 w-5" />
                                Lưu ý quan trọng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-yellow-800">
                                <div className="flex items-start gap-2">
                                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm">
                                        Vui lòng mang theo CMND/CCCD khi tham gia sự kiện.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Heart className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm">
                                        Nhân viên y tế sẽ kiểm tra sức khỏe trước khi hiến máu.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={handleBackToEvents}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Về danh sách sự kiện
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistrationSuccess;
