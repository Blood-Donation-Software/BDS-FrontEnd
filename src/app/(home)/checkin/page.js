'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language_context';
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
    UserX,
    XCircle
} from 'lucide-react';
import { getCheckinInfo, checkInDonor } from '@/apis/bloodDonation';
import { toast } from 'sonner';

function CheckinPage() {
    const { t } = useLanguage();
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
                    setError(t?.checkinPage?.error?.notFound);
                } else if (error.response.status === 400) {
                    setError(t?.checkinPage?.error?.expiredToken);
                } else {
                    setError(t?.checkinPage?.error?.serverError);
                }
            } else {
                setError(t?.checkinPage?.error?.generic);
            }
        } finally {
            setLoading(false);
        }
    };    const handleCheckIn = async (action) => {
        try {
            setChecking(true);
            console.log(`🔄 ${t?.checkinPage?.checkInActions?.checking} ${action}`);
            // {t?.checkinPage?.checkInActions?.[action]}
            await checkInDonor(eventId, action, token);
            console.log('✅' + t?.checkinPage?.checkInActions?.checkSuccess);
            
            // Show success toast
            if (action === 'approve') {
                toast.success(t?.checkinPage?.checkInActions?.aprproveSuccess);
            } else {
                toast.success(t?.checkinPage?.checkInActions?.rejectSuccess);
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
            setError(t?.checkinPage?.error?.checkInError);
            
            // Show error toast
            if (action === 'approve') {
                toast.error(t?.checkinPage?.checkInActions?.approveError);
            } else {
                toast.error(t?.checkinPage?.checkInActions?.rejectError);
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
                    <div className="text-lg font-medium text-gray-900">{t?.checkinPage?.loading}</div>
                    <div className="text-sm text-gray-500 mt-2">{t?.checkinPage?.plsWait}</div>
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
                    <div className="text-lg font-medium text-gray-900">{t?.checkinPage?.error?.title}</div>
                    <div className="text-sm text-gray-500 mt-2">{error}</div>
                    <Button 
                        onClick={() => router.push('/staff')} 
                        className="mt-4"
                        variant="outline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t?.blog?.back}
                    </Button>
                </div>
            </div>
        );
    }

    if (!donorInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">{t?.checkinPage?.error?.notFound}</div>
                    <div className="text-sm text-gray-500 mt-2">{t?.checkinPage?.error?.plsCheckQR}</div>
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
                            {t?.blog?.back}
                        </Button>
                        <div className="flex items-center gap-2">
                            <QrCode className="h-6 w-6 text-blue-500" />
                            <h1 className="text-xl font-bold text-gray-900">{t?.checkinPage?.title}</h1>
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
                                {t?.checkinPage?.donorInfo?.title}
                            </CardTitle>
                        </CardHeader>                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-gray-700">{t?.checkinPage?.donorInfo?.name}</p>
                                        <p className="text-gray-900">{profile.name}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">{t?.checkinPage?.donorInfo?.phone}</p>
                                        <p className="text-gray-900">{profile.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-gray-700">{t?.checkinPage?.donorInfo?.personalId}</p>
                                        <p className="text-gray-900">{profile.personalId}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">{t?.checkinPage?.donorInfo?.dateOfBirth}</p>
                                        <p className="text-gray-900">{profile.dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">{t?.checkinPage?.donorInfo?.address}</p>
                                        <p className="text-gray-900">{profile.address}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Status Display */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-700">{t?.checkinPage?.donorInfo?.status}</p>
                                    {currentStatus === 'APPROVED' && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {t?.checkinPage?.status?.approved}
                                        </Badge>
                                    )}
                                    {currentStatus === 'REJECTED' && (
                                        <Badge className="bg-red-100 text-red-800 border-red-300">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            {t?.checkinPage?.status?.rejected}
                                        </Badge>
                                    )}
                                    {currentStatus === 'PENDING' && (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {t?.checkinPage?.status?.pending}
                                        </Badge>
                                    )}
                                    {currentStatus === 'CHECKED_IN' && (
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                            <UserCheck className="h-3 w-3 mr-1" />
                                            {t?.checkinPage?.status?.checkedIn}
                                        </Badge>
                                    )}
                                    {!currentStatus && (
                                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            {t?.checkinPage?.status?.unknown}
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
                                    {t?.checkinPage?.healthSurvey?.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">{t?.checkinPage?.healthSurvey?.experienceLabel}:</p>
                                        <p className="text-gray-600">
                                            {formData.experience === 'yes' ? t?.checkinPage?.healthSurvey?.experienceYes : t?.checkinPage?.healthSurvey?.experienceNo}
                                        </p>
                                        {formData.experience === 'yes' && formData.experienceDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.experienceDetails}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">{t?.checkinPage?.healthSurvey?.healthyStatus}</p>
                                        <p className="text-gray-600">
                                            {formData.currentIllness === 'yes' ? t?.checkinPage?.healthSurvey?.unhealthyStatus : t?.checkinPage?.healthSurvey?.healthyStatus}
                                        </p>
                                        {formData.currentIllness === 'yes' && formData.currentIllnessDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.currentIllnessDetails}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                              <p className="font-medium text-gray-700 mb-2">{t?.checkinPage?.healthSurvey?.pastDiseases}</p>
                                        <p className="text-gray-600">
                                            {formData.pastDiseases === 'yes' ? t?.checkinPage?.healthSurvey?.pastDiseasesYes : t?.checkinPage?.healthSurvey?.pastDiseasesNo}
                                        </p>
                                        {formData.pastDiseases === 'yes' && formData.pastDiseasesDetails && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-3 rounded">
                                                {formData.pastDiseasesDetails}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">{t?.checkinPage?.healthSurvey?.recentActivities}</p>
                                        <p className="text-gray-600">
                                            {formData.recentActivities === 'yes' ? t?.checkinPage?.healthSurvey?.hasRecentActivities : t?.checkinPage?.healthSurvey?.noRecentActivities}
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
                                {t?.checkinpage?.checkingActions?.title}
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
                                                    {t?.checkinpage?.approvedTitle}
                                                </p>
                                            </div>
                                        </div>                                        <p className="text-sm text-gray-600">
                                            {t?.checkinpage?.approvedDesc}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                                            <Button
                                                onClick={() => window.location.reload()}
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <QrCode className="h-4 w-4" />
                                                {t?.checkinpage?.checkinPage?.scanAnother}
                                            </Button>
                                            <Button
                                                onClick={() => router.push('/staff')}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                {t?.checkinpage?.checkinPage?.back}
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
                                                    {t?.checkinPage?.rejectedTitle}
                                                </p>
                                            </div>
                                        </div>                                        <p className="text-sm text-gray-600">
                                            {t?.checkinPage?.rejectedDesc}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                                            <Button
                                                onClick={() => window.location.reload()}
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <QrCode className="h-4 w-4" />
                                                {t?.checkinpage?.checkinPage?.scanAnother}
                                            </Button>
                                            <Button
                                                onClick={() => router.push('/staff')}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                {t?.checkinpage?.checkinPage?.back}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                
                                {(currentStatus === 'PENDING' || !currentStatus) && (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 mb-6">
                                            {t?.checkinPage?.pendingActionPrompt}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button
                                                onClick={() => handleCheckIn('approve')}
                                                disabled={checking}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <UserCheck className="h-4 w-4" />
                                                {t?.checkinPage?.approve}
                                            </Button>
                                            <Button
                                                onClick={() => handleCheckIn('reject')}
                                                disabled={checking}
                                                variant="destructive"
                                                className="flex items-center gap-2"
                                            >
                                                <UserX className="h-4 w-4" />
                                                {t?.checkinPage?.reject}
                                            </Button>
                                        </div>
                                        {checking && (
                                            <div className="flex items-center justify-center gap-2 mt-4">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                                <span className="text-sm text-gray-600">{t?.checkinPage?.processing}</span>
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
