'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language_context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    QrCode,
    Camera,
    UserCheck,
    UserX,
    User,
    Calendar,
    Clock,
    MapPin,
    Heart,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    ArrowLeft,
    RefreshCw,
    Settings,
    Building2,
    Users
} from 'lucide-react';
import { getOngoingDonationEvents, getCheckinInfo, checkInDonor, findDonorByPersonalID } from '@/apis/bloodDonation';
import { toast } from 'sonner';
import { convertBloodType } from '@/utils/utils';
import Html5QrcodePlugin from '@/components/qrcode-scanner/qrScanner';

export default function CheckInPage() {
    const router = useRouter();
const {t} = useLanguage();
    // State management
    const [scannedToken, setScannedToken] = useState('');
    const [personalId, setPersonalId] = useState('');
    const [donorInfo, setDonorInfo] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState('');
    const [processingAction, setProcessingAction] = useState(false);
    const [scannerError, setScannerError] = useState(null);

    // QR Scanner handlers
    const onNewScanResult = (decodedText, decodedResult) => {
        console.log('QR Code scanned:', decodedText);
        setScannedToken(decodedText);
        handleTokenReceived(decodedText);
        toast.success('QR Code scanned successfully!');
    };

    const onScanFailure = (error) => {
        // Handle scan failure - usually this is just when no QR code is in view
        // We don't need to show error for every failed scan attempt
        console.debug(t?.checkinPage?.QRerror, error);
    };

    // Fetch ongoing events on component mount
    useEffect(() => {
        fetchOngoingEvents();
    }, []);
    // Fetch ongoing donation events
    const fetchOngoingEvents = async () => {
        setLoadingEvents(true);
        try {
            const events = await getOngoingDonationEvents();
            setOngoingEvents(events || []);

            // Auto-select first event if only one ongoing event
            if (events && events.length === 1) {
                setSelectedEventId(events[0].id.toString());
            }
        } catch (error) {
            console.error('Error fetching ongoing events:', error);
            toast.error('Failed to load ongoing events');
            setOngoingEvents([]);
        } finally {
            setLoadingEvents(false);
        }
    };

    // Handle token received (either from QR scan or manual input)
    const handleTokenReceived = async (token) => {
        if (!selectedEventId.trim()) {
            toast.error(t?.checkinPage?.plaease?.pleaseSelectFirst);
            return;
        }

        if (!token.trim()) {
            toast.error('Token cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const response = await getCheckinInfo(selectedEventId, token);
            setDonorInfo(response);
            toast.success(t?.checkinPage?.getDonorSuccess);
        } catch (error) {
            console.error(t?.checkinPage?.getCheckinError, error);
          
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data || 'Invalid token or event ID');
                } else if (error.response.status === 404) {
                    toast.error('Registration not found for this event');
                } else if (error.response.status === 401) {
                    toast.error('Unauthorized. Please check your permissions.');
                } else {
                    toast.error(`Server error: ${error.response.status}`);
                }
            } else {
                toast.error('Failed to retrieve donor information. Please check your connection.');
            }
            setDonorInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle manual token submission
    const handleManualSubmit = async () => {
        const donorInfo = await findDonorByPersonalID(selectedEventId, personalId.trim());
        if (donorInfo) {
            setDonorInfo(donorInfo);
            setScannedToken(donorInfo.checkinToken)
        }
    };

    // Handle check-in action (approve/reject)
    const handleCheckInAction = async (action) => {
        if (!donorInfo || (!scannedToken && !personalId.trim())) {
            toast.error('No donor information available');
            return;
        }

        setActionType(action);
        setShowConfirmDialog(true);
    };

    // Confirm check-in action
    const confirmCheckInAction = async () => {
        setProcessingAction(true);
        setShowConfirmDialog(false);

        try {
            const token = scannedToken;
            const response = await checkInDonor(selectedEventId, actionType, token);

            if (actionType === 'approve') {
                toast.success('Donor checked in successfully!');
            } else {
                toast.success('Donor check-in rejected');
            }

            // Reset state for next scan
            setDonorInfo(null);
            setScannedToken('');
            setPersonalId('');
            setActionType('');
        } catch (error) {
            console.error('Error processing check-in:', error);
            if (error.response) {
                toast.error(error.response.data || 'Failed to process check-in');
            } else {
                toast.error('Failed to process check-in. Please try again.');
            }
        } finally {
            setProcessingAction(false);
        }
    };

    // Reset all state
    const resetState = () => {
        setDonorInfo(null);
        setScannedToken('');
        setPersonalId('');
        setActionType('');
        setScannerError(null);
    };

    // Get selected event details
    const selectedEvent = ongoingEvents.find(event => event.id.toString() === selectedEventId);

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Event Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                {t?.checkinPage?.pleaseSelectFirst}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <Label htmlFor="eventSelect">   </Label>
                                        <Select
                                            value={selectedEventId}
                                            onValueChange={setSelectedEventId}
                                            disabled={loadingEvents}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder={loadingEvents ? "Loading events..." : "Select an ongoing event"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ongoingEvents.map((event) => (
                                                    <SelectItem key={event.id} value={event.id.toString()}>
                                                        {event.name} - {event.hospital}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={selectedEventId ? 'default' : 'secondary'}>
                                            {selectedEventId ? 'Event Selected' : 'No Event'}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={fetchOngoingEvents}
                                            disabled={loadingEvents}
                                            className="flex items-center gap-2"
                                        >
                                            <RefreshCw className={`h-4 w-4 ${loadingEvents ? 'animate-spin' : ''}`} />
                                            {t?.eventManagement?.refresh}
                                        </Button>
                                    </div>
                                </div>

                                {/* Selected Event Details */}
                                {selectedEvent && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Heart className="h-4 w-4 text-red-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.createEvent?.confirmation?.eventName}</p>
                                                    <p className="text-blue-900 font-semibold">{selectedEvent.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-blue-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.createEvent?.confirmation?.hospital}</p>
                                                    <p className="text-blue-900">{selectedEvent.hospital}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-green-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.createEvent?.confirmation?.date}</p>
                                                    <p className="text-blue-900">{selectedEvent.donationDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm text-blue-600">
                                                {selectedEvent.address}, {selectedEvent.ward}, {selectedEvent.district}, {selectedEvent.city}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {ongoingEvents.length === 0 && !loadingEvents && (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="h-8 w-8 text-yellow-600" />
                                        </div>
                                        <p className="text-gray-600 mb-2">{t?.checkinPage?.noOngoingEvents}</p>
                                        <p className="text-sm text-gray-500">{t?.checkinPage?.noOngiongEvents}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* QR Scanner Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <QrCode className="h-5 w-5 text-purple-500" />
                                    {t?.checkinPage?.qeScanner}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                            <QrCode className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <p className="text-gray-600 mb-4">{t?.checkinPage?.ScannerInstruction}</p>
                                        
                                        {/* QR Scanner Component - Always visible */}
                                        {selectedEventId ? (
                                            <div className="w-full max-w-md mx-auto">
                                                <Html5QrcodePlugin
                                                    key={`scanner-${selectedEventId}`}
                                                    fps={10}
                                                    qrbox={250}
                                                    disableFlip={false}
                                                    qrCodeSuccessCallback={onNewScanResult}
                                                    qrCodeErrorCallback={onScanFailure}
                                                    verbose={false}
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-700">
                                                {t?.checkinPage?.selectEventPrompt}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {scannerError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-red-700">
                                                <AlertTriangle className="h-5 w-5" />
                                                <span className="font-medium"> {t?.checkinPage?.scannerError}</span>
                                            </div>
                                            <p className="text-sm text-red-600 mt-1">{scannerError}</p>
                                        </div>
                                    )}

                                    {scannedToken && (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                                <CheckCircle className="h-5 w-5" />
                                                <span className="font-medium"> {t?.checkinPage?.qrScanned}</span>
                                            </div>
                                            <p className="text-sm text-green-600 font-mono break-all">
                                                {scannedToken}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Manual Token Input Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="h-5 w-5 text-blue-500" />
                                    {t?.checkinPage?.manualCheckin}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="manualToken">{t?.checkinPage?.personalId}</Label>
                                        <Input
                                            id="manualToken"
                                            value={personalId}
                                            onChange={(e) => setPersonalId(e.target.value)}
                                            placeholder="Enter Personal ID manually"
                                            className="mt-1 font-mono"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleManualSubmit}
                                        disabled={!selectedEventId || !personalId.trim() || loading}
                                        className="w-full flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                {t?.checkinPage?.retrievingInfo}
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4" />
                                                {t?.checkinPage?.getDonorInfo}
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center text-sm text-gray-500">
                                        <p>{t?.checkinPage?.useIfNoQR}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Donor Information Display */}
                    {donorInfo && (
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <User className="h-5 w-5" />
                                   {t?.checkingPage?.donnorInfo?.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Profile Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-blue-900 border-b border-blue-200 pb-2">
                                            {t?.checkinPage?.personalDetails}
                                        </h3>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-blue-700">{t?.auth?.fullName}</p>
                                                <p className="text-blue-900 font-semibold">{donorInfo.profile?.name}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.checkinPage?.personalId}</p>
                                                    <p className="text-blue-900">{donorInfo.profile?.personalId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.checkinPage?.donnaorInfo?.phone}</p>
                                                    <p className="text-blue-900">{donorInfo.profile?.phone}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.user?.blood_Type}</p>
                                                    <Badge variant="outline" className="text-red-600 border-red-300">
                                                        {convertBloodType(donorInfo.profile?.bloodType) || 'Unknown'}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700">{t?.checkinPage?.gender}</p>
                                                    <p className="text-blue-900">{donorInfo.profile?.gender}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-blue-700">{t?.checkinPage?.donnorInfo?.dateOfBirth}</p>
                                                <p className="text-blue-900">{donorInfo.profile?.dateOfBirth}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-blue-700">{t?.donateEdetailFmemeber?.donateEdetailFmember?.address}</p>
                                                <p className="text-blue-900">
                                                    {donorInfo.profile?.address}, {donorInfo.profile?.ward}, {donorInfo.profile?.district}, {donorInfo.profile?.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Health Survey Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-blue-900 border-b border-blue-200 pb-2">
                                            {t?.checkinPage?.healthSurvey?.title}
                                        </h3>

                                        {donorInfo.jsonForm && (() => {
                                            // Parse the jsonForm
                                            let formData = {};
                                            try {
                                                if (typeof donorInfo.jsonForm === 'string') {
                                                    formData = JSON.parse(donorInfo.jsonForm);
                                                } else if (typeof donorInfo.jsonForm === 'object') {
                                                    formData = donorInfo.jsonForm;
                                                }
                                            } catch (e) {
                                                console.error('Error parsing jsonForm:', e);
                                                return (
                                                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                                                        {t?.checkinPage?.errorParsingHealthSurvey}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="space-y-4">
                                                    {/* Question 1: Blood Donation Experience */}
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700 mb-2">
                                                            {t?.checkinPage?.question1}
                                                        </p>
                                                        <p className="text-blue-900">
                                                            {formData.experience === 'yes' 
                                                                ? t?.checkinPage?.answer1_Yes
                                                                : t?.checkinPage?.answer1_No
                                                            }
                                                        </p>
                                                        {formData.experience === 'yes' && formData.experienceDetails && (
                                                            <div className="mt-2 text-sm text-blue-600 bg-blue-100 p-3 rounded">
                                                                <p className="font-medium text-blue-700 mb-1">{t?.checkinPage?.experienceDetails}</p>
                                                                <p>{formData.experienceDetails}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Question 2: Current Health Issues */}
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700 mb-2">
                                                            {t?.checkinPage?.question2}
                                                        </p>
                                                        <p className="text-blue-900">
                                                            {formData.currentIllness === 'yes' 
                                                                ? t?.checkinPage?.answer2_Yes
                                                                : t?.checkinPage?.answer2_No
                                                            }
                                                        </p>
                                                        {formData.currentIllness === 'yes' && formData.currentIllnessDetails && (
                                                            <div className="mt-2 text-sm text-blue-600 bg-blue-100 p-3 rounded">
                                                                <p className="font-medium text-blue-700 mb-1">{t?.checkinPage?.currentHealth}</p>
                                                                <p>{formData.currentIllnessDetails}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Question 3: Past Diseases */}
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700 mb-2">
                                                            {t?.checkinPage?.question3}
                                                        </p>
                                                        <p className="text-blue-900">
                                                            {formData.pastDiseases === 'yes' 
                                                                ? t?.checkinPage?.answer3_Yes
                                                                : t?.checkinPage?.answer3_No
                                                            }
                                                        </p>
                                                        {formData.pastDiseases === 'yes' && formData.pastDiseasesDetails && (
                                                            <div className="mt-2 text-sm text-blue-600 bg-blue-100 p-3 rounded">
                                                                <p className="font-medium text-blue-700 mb-1">{t?.checkinPage?.pastDiseases}</p>
                                                                <p>{formData.pastDiseasesDetails}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Question 4: Recent Activities */}
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700 mb-2">
                                                            {t?.checkinPage?.question4}
                                                        </p>
                                                        <p className="text-blue-900">
                                                            {formData.recentActivities === 'yes' 
                                                                ? t?.checkinPage?.answer4_Yes
                                                                : t?.checkinPage?.answer4_No
                                                            }
                                                        </p>
                                                        {formData.recentActivities === 'yes' && formData.recentActivitiesDetails && (
                                                            <div className="mt-2 text-sm text-blue-600 bg-blue-100 p-3 rounded">
                                                                <p className="font-medium text-blue-700 mb-1">{t?.checkinPagePastDiseases}</p>
                                                                <p>{formData.recentActivitiesDetails}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Registration Time */}
                                                    <div className="pt-3 border-t border-blue-200">
                                                        <p className="text-sm font-medium text-blue-700">{t?.checkinPage?.registrationTime}</p>
                                                        <p className="text-blue-900">
                                                            {formData.submittedAt 
                                                                ? new Date(formData.submittedAt).toLocaleString('vi-VN')
                                                                : 'Không có thông tin'
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {!donorInfo.jsonForm && (
                                            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                                {t?.checkinPage?.noSurveyInfo}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-6 border-t border-blue-200">
                                    <div className="flex gap-4 justify-center">                        <Button
                            onClick={() => handleCheckInAction('approve')}
                            disabled={processingAction}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <UserCheck className="h-4 w-4" />
                            {t?.checkinPage?.approveCheckIn}
                        </Button>
                        <Button
                            onClick={() => handleCheckInAction('reject')}
                            disabled={processingAction}
                            variant="destructive"
                            className="flex items-center gap-2"
                        >
                            <UserX className="h-4 w-4" />
                            {t?.checkinPage?.rejectCheckIn}
                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'approve' ? t?.checkinPage?.confirmCheckIn : t?.checkinPage?.confirmRejection}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? `${t?.checkinPage?.confirmCheckInMessage} ${donorInfo?.profile?.name} ${t?.checkinPage?.for} ${selectedEvent?.name}?`
                                : `${t?.checkinPage?.confirmRejectionMessage} ${donorInfo?.profile?.name} ${t?.checkinPage?.for} ${selectedEvent?.name}?`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            {t?.checkinPage?.cancel}
                        </Button>
                        <Button
                            onClick={confirmCheckInAction}
                            disabled={processingAction}
                            className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {processingAction ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    {t.checkinPage?.processing}
                                </>
                            ) : (
                                actionType === 'approve' ? t?.checkinPage?.confirmCheckIn : t?.checkinPage?.confirmRejection
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
