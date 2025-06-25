'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Clock, MapPin, Calendar, User, Heart, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useDonationEvents } from '@/context/donationEvent_context';
import { registerForEvent } from '@/apis/bloodDonation';

// Custom form components
const FormRadioGroup = ({ value, onValueChange, children, className = "" }) => {
    return (
        <div className={`space-y-3 ${className}`} role="radiogroup">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { 
                        selectedValue: value, 
                        onValueChange 
                    });
                }
                return child;
            })}
        </div>
    );
};

const FormRadioItem = ({ value, id, selectedValue, onValueChange, children, className = "" }) => {
    const isSelected = selectedValue === value;
    
    return (
        <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
        } ${className}`}
        onClick={() => onValueChange && onValueChange(value)}>
            <div className="relative mt-1">
                <input
                    type="radio"
                    id={id}
                    value={value}
                    checked={isSelected}
                    onChange={() => onValueChange && onValueChange(value)}
                    className="sr-only"
                />
                <div className={`h-5 w-5 rounded-full border-2 transition-all duration-200 ${
                    isSelected 
                        ? 'border-red-600 bg-red-600' 
                        : 'border-gray-300 bg-white'
                }`}>
                    {isSelected && (
                        <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <label htmlFor={id} className="text-sm font-medium cursor-pointer block">
                    {children}
                </label>
            </div>
        </div>
    );
};

const FormCheckbox = ({ id, checked, onCheckedChange, children, className = "" }) => {
    const isChecked = checked || false;
    
    const handleChange = () => {
        if (onCheckedChange) {
            onCheckedChange(!isChecked);
        }
    };
    
    return (
        <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isChecked ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
        } ${className}`}
        onClick={handleChange}>
            <div className="relative mt-1">
                <input
                    type="checkbox"
                    id={id}
                    checked={isChecked}
                    onChange={handleChange}
                    className="sr-only"
                />
                <div className={`h-5 w-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    isChecked 
                        ? 'border-red-600 bg-red-600' 
                        : 'border-gray-300 bg-white'
                }`}>
                    {isChecked && (
                        <CheckCircle className="h-3 w-3 text-white" />
                    )}
                </div>
            </div>
            <div className="flex-1">
                <label htmlFor={id} className="text-sm cursor-pointer block">
                    {children}
                </label>
            </div>
        </div>
    );
};

function RegisterDonation() {
    const router = useRouter();
    const params = useParams();
    const { selectedEvent, selectedTimeSlot, selectEventById, saveRegistration } = useDonationEvents();
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [otherText, setOtherText] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const totalSteps = 3;

    useEffect(() => {
        if (params?.id && !selectedEvent) {
            selectEventById(params.id);
        }
    }, [params?.id, selectedEvent, selectEventById]);

    useEffect(() => {
        if (selectedEvent && selectedTimeSlot === null) {
            toast.error('Vui lòng chọn khung thời gian từ trang chi tiết sự kiện');
            router.push(`/donation-events/${selectedEvent.id}`);
        }
    }, [selectedEvent, selectedTimeSlot, router]);

    // Form validation functions
    const validateStep1 = () => {
        if (!answers['experience']) {
            toast.error('Vui lòng cho biết kinh nghiệm hiến máu của bạn');
            return false;
        }
        if (answers['experience'] === 'yes' && (!otherText['experience'] || otherText['experience'].trim() === '')) {
            toast.error('Vui lòng mô tả kinh nghiệm hiến máu của bạn');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        // Validate health questions
        const requiredQuestions = ['current_illness', 'past_diseases', 'recent_activities'];
        
        for (const question of requiredQuestions) {
            if (!answers[question]) {
                toast.error('Vui lòng trả lời tất cả các câu hỏi về sức khỏe');
                return false;
            }
        }
        
        // Validate text fields for "yes" answers
        if (answers['current_illness'] === 'yes' && (!otherText['current_illness'] || otherText['current_illness'].trim() === '')) {
            toast.error('Vui lòng mô tả tình trạng bệnh hiện tại');
            return false;
        }
        
        return true;
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleTextChange = (questionId, value) => {
        setOtherText(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
        
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };    const handleSubmit = async () => {
        if (!validateStep2()) return;

        try {
            setIsSubmitting(true);

            // Prepare form data
            const formData = {
                experience: answers.experience,
                experienceDetails: otherText.experience || '',
                currentIllness: answers.current_illness,
                currentIllnessDetails: otherText.current_illness || '',
                pastDiseases: answers.past_diseases,
                pastDiseasesDetails: otherText.past_diseases || '',
                recentActivities: answers.recent_activities,
                recentActivitiesDetails: otherText.recent_activities || '',
                answers: answers,
                otherText: otherText,
                submittedAt: new Date().toISOString()
            };

            console.log('Submitting registration:', {
                eventId: selectedEvent.id,
                timeSlotId: selectedEvent.timeSlotDtos[selectedTimeSlot]?.id,
                formData
            });            // Call the API
            const response = await registerForEvent(
                selectedEvent.id,
                selectedEvent.timeSlotDtos[selectedTimeSlot]?.id || 1,
                JSON.stringify(formData)
            );            console.log('Registration response:', response);

            toast.success('Đăng ký thành công!');
            
            // Save registration data to context/localStorage
            saveRegistration(formData);
            
            // Navigate to success page
            const successUrl = `/donation-events/${selectedEvent.id}/register/success`;
            router.push(successUrl);

        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedEvent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">Đang tải thông tin sự kiện...</div>
                    <div className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <h1 className="text-xl font-bold text-gray-900">Đăng ký hiến máu</h1>
                        </div>
                        <div className="ml-auto">
                            <Badge variant="outline" className="text-sm">
                                Bước {currentStep} / {totalSteps}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>            {/* Event Info */}
            <div className="container mx-auto px-4 py-6">
                <Card className="mb-6 border-red-200">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-red-700">Thông tin sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedEvent.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Ngày:</span>
                                <span>{selectedEvent.donationDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Thời gian:</span>
                                <span>
                                    {selectedTimeSlot !== null && selectedEvent.timeSlotDtos[selectedTimeSlot] 
                                        ? `${selectedEvent.timeSlotDtos[selectedTimeSlot].startTime} - ${selectedEvent.timeSlotDtos[selectedTimeSlot].endTime}`
                                        : 'Chưa chọn'
                                    }
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Địa điểm:</span>
                                <span>{selectedEvent.hospital}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Steps */}
                <div className="max-w-4xl mx-auto">
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-red-500" />
                                    Thông tin cơ bản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-base font-medium mb-4 block">
                                        1. Anh/chị đã từng hiến máu trước đây chưa?
                                    </Label>
                                    <FormRadioGroup 
                                        value={answers.experience} 
                                        onValueChange={(value) => handleAnswerChange('experience', value)}
                                    >
                                        <FormRadioItem value="yes" id="exp-yes">
                                            Có, tôi đã từng hiến máu
                                        </FormRadioItem>
                                        <FormRadioItem value="no" id="exp-no">
                                            Không, đây là lần đầu tiên
                                        </FormRadioItem>
                                    </FormRadioGroup>
                                    
                                    {answers.experience === 'yes' && (
                                        <div className="mt-4">
                                            <Label htmlFor="exp-details" className="text-sm font-medium">
                                                Vui lòng mô tả kinh nghiệm hiến máu của bạn:
                                            </Label>
                                            <Textarea
                                                id="exp-details"
                                                placeholder="Ví dụ: Tôi đã hiến máu 3 lần, lần gần nhất là 6 tháng trước..."
                                                value={otherText.experience || ''}
                                                onChange={(e) => handleTextChange('experience', e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Thông tin sức khỏe
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Current Health */}
                                <div>
                                    <Label className="text-base font-medium mb-4 block">
                                        2. Hiện tại anh/chị có đang mắc bệnh gì không?
                                    </Label>
                                    <FormRadioGroup 
                                        value={answers.current_illness} 
                                        onValueChange={(value) => handleAnswerChange('current_illness', value)}
                                    >
                                        <FormRadioItem value="yes" id="illness-yes">
                                            Có, tôi đang có vấn đề sức khỏe
                                        </FormRadioItem>
                                        <FormRadioItem value="no" id="illness-no">
                                            Không, tôi hoàn toàn khỏe mạnh
                                        </FormRadioItem>
                                    </FormRadioGroup>
                                    
                                    {answers.current_illness === 'yes' && (
                                        <div className="mt-4">
                                            <Label htmlFor="illness-details" className="text-sm font-medium">
                                                Vui lòng mô tả tình trạng sức khỏe hiện tại:
                                            </Label>
                                            <Textarea
                                                id="illness-details"
                                                placeholder="Mô tả chi tiết tình trạng sức khỏe của bạn..."
                                                value={otherText.current_illness || ''}
                                                onChange={(e) => handleTextChange('current_illness', e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Past Diseases */}
                                <div>
                                    <Label className="text-base font-medium mb-4 block">
                                        3. Anh/chị đã từng mắc các bệnh nghiêm trọng nào không?
                                    </Label>
                                    <FormRadioGroup 
                                        value={answers.past_diseases} 
                                        onValueChange={(value) => handleAnswerChange('past_diseases', value)}
                                    >
                                        <FormRadioItem value="yes" id="past-yes">
                                            Có, tôi đã từng mắc bệnh nghiêm trọng
                                        </FormRadioItem>
                                        <FormRadioItem value="no" id="past-no">
                                            Không, tôi chưa từng mắc bệnh nghiêm trọng
                                        </FormRadioItem>
                                    </FormRadioGroup>
                                    
                                    {answers.past_diseases === 'yes' && (
                                        <div className="mt-4">
                                            <Label htmlFor="past-details" className="text-sm font-medium">
                                                Vui lòng liệt kê các bệnh đã từng mắc:
                                            </Label>
                                            <Textarea
                                                id="past-details"
                                                placeholder="Ví dụ: Cao huyết áp, tiểu đường, bệnh tim..."
                                                value={otherText.past_diseases || ''}
                                                onChange={(e) => handleTextChange('past_diseases', e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Recent Activities */}
                                <div>
                                    <Label className="text-base font-medium mb-4 block">
                                        4. Trong 3 tháng gần đây, anh/chị có thực hiện các hoạt động sau không?
                                    </Label>
                                    <FormRadioGroup 
                                        value={answers.recent_activities} 
                                        onValueChange={(value) => handleAnswerChange('recent_activities', value)}
                                    >
                                        <FormRadioItem value="yes" id="activities-yes">
                                            Có (phẫu thuật, tiêm vaccine, xăm mình, v.v.)
                                        </FormRadioItem>
                                        <FormRadioItem value="no" id="activities-no">
                                            Không có hoạt động đặc biệt nào
                                        </FormRadioItem>
                                    </FormRadioGroup>
                                    
                                    {answers.recent_activities === 'yes' && (
                                        <div className="mt-4">
                                            <Label htmlFor="activities-details" className="text-sm font-medium">
                                                Vui lòng mô tả các hoạt động đã thực hiện:
                                            </Label>
                                            <Textarea
                                                id="activities-details"
                                                placeholder="Mô tả chi tiết các hoạt động trong 3 tháng gần đây..."
                                                value={otherText.recent_activities || ''}
                                                onChange={(e) => handleTextChange('recent_activities', e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Xác nhận thông tin
                                </CardTitle>
                            </CardHeader>                            <CardContent className="space-y-6">
                                {/* Event Summary */}
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-red-900 mb-3">Thông tin sự kiện</h3>
                                    <div className="space-y-2 text-sm text-red-800">
                                        <div>
                                            <span className="font-medium">Tên sự kiện:</span> {selectedEvent.name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Ngày hiến máu:</span> {selectedEvent.donationDate}
                                        </div>
                                        <div>
                                            <span className="font-medium">Thời gian:</span> 
                                            {selectedTimeSlot !== null && selectedEvent.timeSlotDtos[selectedTimeSlot] 
                                                ? ` ${selectedEvent.timeSlotDtos[selectedTimeSlot].startTime} - ${selectedEvent.timeSlotDtos[selectedTimeSlot].endTime}`
                                                : ' Chưa chọn'
                                            }
                                        </div>
                                        <div>
                                            <span className="font-medium">Địa điểm:</span> {selectedEvent.hospital}
                                        </div>
                                        <div>
                                            <span className="font-medium">Địa chỉ:</span> {selectedEvent.address}, {selectedEvent.ward}, {selectedEvent.district}, {selectedEvent.city}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-3">Tóm tắt thông tin đăng ký</h3>
                                    <div className="space-y-2 text-sm text-blue-800">
                                        <div>
                                            <span className="font-medium">Kinh nghiệm hiến máu:</span> 
                                            {answers.experience === 'yes' ? ' Đã từng hiến máu' : ' Lần đầu tiên'}
                                        </div>
                                        {answers.experience === 'yes' && otherText.experience && (
                                            <div className="ml-4 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                                {otherText.experience}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium">Tình trạng sức khỏe:</span> 
                                            {answers.current_illness === 'yes' ? ' Có vấn đề sức khỏe' : ' Khỏe mạnh'}
                                        </div>
                                        {answers.current_illness === 'yes' && otherText.current_illness && (
                                            <div className="ml-4 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                                {otherText.current_illness}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium">Bệnh đã từng mắc:</span> 
                                            {answers.past_diseases === 'yes' ? ' Đã từng mắc bệnh nghiêm trọng' : ' Chưa từng mắc bệnh nghiêm trọng'}
                                        </div>
                                        {answers.past_diseases === 'yes' && otherText.past_diseases && (
                                            <div className="ml-4 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                                {otherText.past_diseases}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium">Hoạt động gần đây:</span> 
                                            {answers.recent_activities === 'yes' ? ' Có hoạt động đặc biệt' : ' Không có hoạt động đặc biệt'}
                                        </div>
                                        {answers.recent_activities === 'yes' && otherText.recent_activities && (
                                            <div className="ml-4 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                                {otherText.recent_activities}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-yellow-900 mb-2">Lưu ý quan trọng</h3>
                                    <ul className="space-y-1 text-sm text-yellow-800">
                                        <li>• Thông tin bạn cung cấp sẽ được bảo mật tuyệt đối</li>
                                        <li>• Nhân viên y tế sẽ kiểm tra sức khỏe trước khi hiến máu</li>
                                        <li>• Bạn có thể hủy đăng ký bất cứ lúc nào trước ngày diễn ra sự kiện</li>
                                        <li>• Vui lòng mang theo CMND/CCCD khi tham gia sự kiện</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 mb-12">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                            >
                                Tiếp tục
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4" />
                                        Hoàn tất đăng ký
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterDonation;
