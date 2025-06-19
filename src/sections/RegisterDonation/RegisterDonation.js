'use client';

import React, { useState, useEffect } from 'react'
import { useDonationEvents } from "@/context/donationEvent_context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Simple fallback components using standard HTML
const RadioGroup = ({ children, value, onValueChange, className = "" }) => {
    return (
        <div className={`space-y-2 ${className}`} role="radiogroup">
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

const RadioGroupItem = ({ value, id, selectedValue, onValueChange, className = "" }) => {
    const isSelected = selectedValue === value;
    
    return (
        <div className="relative">
            <input
                type="radio"
                id={id}
                value={value}
                checked={isSelected}
                onChange={() => onValueChange && onValueChange(value)}
                className="sr-only" // Hide the default radio button
            />
            <div 
                className={`h-4 w-4 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300 bg-white hover:border-blue-400'
                } ${className}`}
                onClick={() => onValueChange && onValueChange(value)}
            >
                {isSelected && (
                    <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Checkbox = ({ id, checked, onCheckedChange, className = "" }) => {
    const isChecked = checked || false;
    
    const handleChange = () => {
        console.log('Checkbox handleChange called:', id, 'current:', isChecked, 'new:', !isChecked);
        if (onCheckedChange) {
            onCheckedChange(!isChecked);
        }
    };
    
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleChange();
    };
    
    return (
        <div className="relative">
            <input
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={handleChange}
                className="sr-only"
            />
            <div 
                className={`h-4 w-4 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isChecked 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300 bg-white hover:border-blue-400'
                } ${className}`}
                onClick={handleClick}
            >
                {isChecked && (
                    <svg 
                        className="h-3 w-3 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                )}
            </div>
        </div>
    );
};

function RegisterDonation({ params }) {
    const { selectedEvent, selectedShift, selectEventById, selectShift } = useDonationEvents();
    const [answers, setAnswers] = useState({})
    const [otherText, setOtherText] = useState({})
    const [selectedAnswer, setSelectedAnswer] = useState([])

    useEffect(() => {
        if (params?.id && !selectedEvent) {
            selectEventById(params.id);
        }
    }, [params?.id, selectedEvent, selectEventById]);

    const handleShiftSelect = (shift) => {
        selectShift(shift);
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    const handleMultiSelectChange = (questionId, checked) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            
            // Handle "Không" selection logic
            if (questionId.endsWith('_none')) {
                if (checked) {
                    // If selecting "Không", clear all other options for this question
                    const questionPrefix = questionId.split('_')[0];
                    Object.keys(newAnswers).forEach(key => {
                        if (key.startsWith(questionPrefix + '_') && key !== questionId) {
                            delete newAnswers[key];
                        }
                    });
                    newAnswers[questionId] = true;
                } else {
                    delete newAnswers[questionId];
                }
            } else {
                // If selecting any other option, clear "Không" option
                const questionPrefix = questionId.split('_')[0];
                const noneOptionKey = questionPrefix + '_none';
                if (newAnswers[noneOptionKey]) {
                    delete newAnswers[noneOptionKey];
                }
                
                if (checked) {
                    newAnswers[questionId] = true;
                } else {
                    delete newAnswers[questionId];
                }
            }
            
            console.log('New answers:', newAnswers);
            return newAnswers;
        });
    }

    const handleSingleSelectChange = (questionId, checked) => {
        console.log('handleSingleSelectChange called:', questionId, checked);
        setAnswers(prev => {
            console.log('Previous answers:', prev);
            const newAnswers = { ...prev };
            
            if (checked) {
                // For single select, clear all other options for this question first
                const questionPrefix = questionId.split('_')[0];
                Object.keys(newAnswers).forEach(key => {
                    if (key.startsWith(questionPrefix + '_')) {
                        delete newAnswers[key];
                    }
                });
                // Then set the selected option
                newAnswers[questionId] = true;
            } else {
                delete newAnswers[questionId];
            }
            
            console.log('New answers:', newAnswers);
            return newAnswers;
        });
    }

    const handleOtherTextChange = (questionId, value) => {
        setOtherText(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check if user needs to select a time slot for events with multiple slots
        if (selectedEvent?.timeSlotDtos && selectedEvent.timeSlotDtos.length > 1 && !selectedShift) {
            alert('Vui lòng chọn ca làm việc trước khi tiếp tục!');
            return;
        }
        
        // Check if all questions are answered
        const unansweredQuestions = [];
        
        // Question 1: Must have at least one answer
        if (!answers['1_yes'] && !answers['1_none']) {
            unansweredQuestions.push('Câu 1: Anh/chị từng hiến máu chưa?');
        }
        
        // Question 2: Must have at least one answer
        if (!answers['2_yes'] && !answers['2_none']) {
            unansweredQuestions.push('Câu 2: Hiện tại có mắc bệnh lý nào không?');
        }
        
        // Question 3: Must have at least one answer
        if (!answers['3_yes'] && !answers['3_other'] && !answers['3_none']) {
            unansweredQuestions.push('Câu 3: Từng mắc các bệnh được liệt kê?');
        }
        
        // Question 4: Must have at least one answer
        if (!answers['4_disease'] && !answers['4_transfusion'] && !answers['4_vaccine'] && !answers['4_none']) {
            unansweredQuestions.push('Câu 4: Trong 12 tháng gần đây có gì đặc biệt?');
        }
        
        // Question 5: Must have at least one answer
        const q5Options = ['5_disease', '5_weightloss', '5_lymph', '5_medical', '5_tattoo', '5_drugs', '5_blood_contact', '5_hepatitis_contact', '5_sexual_contact', '5_same_sex', '5_none'];
        if (!q5Options.some(option => answers[option])) {
            unansweredQuestions.push('Câu 5: Trong 06 tháng gần đây có gì đặc biệt?');
        }
        
        // Question 6: Must have at least one answer
        if (!answers['6_disease'] && !answers['6_epidemic'] && !answers['6_none']) {
            unansweredQuestions.push('Câu 6: Trong 01 tháng gần đây có gì đặc biệt?');
        }
        
        // Question 7: Must have at least one answer
        if (!answers['7_symptoms'] && !answers['7_other'] && !answers['7_none']) {
            unansweredQuestions.push('Câu 7: Trong 14 ngày gần đây có triệu chứng gì?');
        }
        
        // Question 8: Must have at least one answer
        if (!answers['8_medication'] && !answers['8_other'] && !answers['8_none']) {
            unansweredQuestions.push('Câu 8: Trong 07 ngày gần đây có dùng thuốc gì?');
        }
        
        // Question 9: Must have at least one answer
        if (!answers['9_pregnant'] && !answers['9_terminated'] && !answers['9_none']) {
            unansweredQuestions.push('Câu 9: Câu hỏi dành cho phụ nữ');
        }
        
        if (unansweredQuestions.length > 0) {
            alert('Vui lòng trả lời tất cả các câu hỏi:\n' + unansweredQuestions.join('\n'));
            return;
        }

        // Validate required text areas
        const requiredTextFields = [];
        if (answers['1_yes'] && (!otherText['1_yes'] || otherText['1_yes'].trim() === '')) {
            requiredTextFields.push('Câu 1: Thông tin chi tiết về hiến máu');
        }
        if (answers['2_yes'] && (!otherText['2_yes'] || otherText['2_yes'].trim() === '')) {
            requiredTextFields.push('Câu 2: Thông tin chi tiết về bệnh lý');
        }
        if (answers['3_yes'] && (!otherText['3_yes'] || otherText['3_yes'].trim() === '')) {
            requiredTextFields.push('Câu 3: Thông tin chi tiết về bệnh cụ thể');
        }
        if (answers['3_other'] && (!otherText['3_other'] || otherText['3_other'].trim() === '')) {
            requiredTextFields.push('Câu 3: Thông tin chi tiết về bệnh khác');
        }
        if (answers['4_vaccine'] && (!otherText['4_vaccine'] || otherText['4_vaccine'].trim() === '')) {
            requiredTextFields.push('Câu 4: Thông tin chi tiết về vacxin');
        }
        if (answers['7_symptoms'] && (!otherText['7_symptoms'] || otherText['7_symptoms'].trim() === '')) {
            requiredTextFields.push('Câu 7: Thông tin chi tiết về triệu chứng');
        }
        if (answers['7_other'] && (!otherText['7_other'] || otherText['7_other'].trim() === '')) {
            requiredTextFields.push('Câu 7: Thông tin chi tiết khác');
        }
        if (answers['8_medication'] && (!otherText['8_medication'] || otherText['8_medication'].trim() === '')) {
            requiredTextFields.push('Câu 8: Thông tin chi tiết về thuốc');
        }
        if (answers['8_other'] && (!otherText['8_other'] || otherText['8_other'].trim() === '')) {
            requiredTextFields.push('Câu 8: Thông tin chi tiết khác');
        }
        
        if (requiredTextFields.length > 0) {
            alert('Vui lòng điền đầy đủ thông tin cho:\n' + requiredTextFields.join('\n'));
            return;
        }
        
        const submissionData = {
            event: selectedEvent,
            selectedShift: selectedShift,
            healthSurvey: answers,
            otherDetails: otherText
        };
        console.log('Submitted:', submissionData);
        
        // Add your submission logic here
        alert('Đã hoàn thành đăng ký thành công!');
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">            
            {/* Header Card */}
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-red-600">
                        Khảo sát sức khỏe trước khi hiến máu
                    </CardTitle>
                </CardHeader>
                {selectedEvent && (
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-800">{selectedEvent.name}</h2>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="font-semibold">Địa điểm:</Label>
                                    <p className="text-gray-700">{selectedEvent.location}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold">Ngày:</Label>
                                    <p className="text-gray-700">{selectedEvent.donationDate}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="font-semibold">Địa chỉ:</Label>
                                    <p className="text-gray-700">
                                        {selectedEvent.address}, {selectedEvent.ward}, {selectedEvent.district}, {selectedEvent.city}
                                    </p>
                                </div>
                            </div>

                            {selectedEvent.timeSlotDtos && selectedEvent.timeSlotDtos.length > 1 ? (
                                <div className="space-y-3">
                                    <Label className="font-semibold">Chọn ca làm việc:</Label>
                                    <RadioGroup value={selectedShift} onValueChange={handleShiftSelect}>
                                        {selectedEvent.timeSlotDtos.map((timeSlot, index) => {
                                            const shiftLabel = `${timeSlot.startTime} - ${timeSlot.endTime} (Tối đa: ${timeSlot.maxCapacity} người)`;
                                            return (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={shiftLabel} id={`shift-${index}`} />
                                                    <Label htmlFor={`shift-${index}`} className="cursor-pointer">
                                                        {shiftLabel}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </RadioGroup>
                                    {selectedShift && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                            <p className="text-green-800 font-medium">
                                                Ca đã chọn: {selectedShift}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : selectedEvent.timeSlotDtos && selectedEvent.timeSlotDtos.length === 1 ? (
                                <div>
                                    <Label className="font-semibold">Giờ:</Label>
                                    <p className="text-gray-700">
                                        {selectedEvent.timeSlotDtos[0].startTime} - {selectedEvent.timeSlotDtos[0].endTime}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <Label className="font-semibold">Giờ:</Label>
                                    <p className="text-gray-700">Chưa có thông tin thời gian</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question 1 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            1. Anh/chị từng hiến máu chưa?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="1_yes"
                                    checked={answers['1_yes'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('1_yes', checked)}
                                />
                                <Label htmlFor="1_yes" className="text-base leading-relaxed">
                                    Có
                                </Label>
                            </div>
                            {answers['1_yes'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ thông tin chi tiết (lần cuối hiến máu, tại đâu, ...)..."
                                    value={otherText['1_yes'] || ''}
                                    onChange={(e) => handleOtherTextChange('1_yes', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="1_none"
                                    checked={answers['1_none'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('1_none', checked)}
                                />
                                <Label htmlFor="1_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question 2 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            2. Hiện tại, anh/chị có mắc bệnh lý nào không?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="2_yes"
                                    checked={answers['2_yes'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('2_yes', checked)}
                                />
                                <Label htmlFor="2_yes" className="text-base leading-relaxed">
                                    Có
                                </Label>
                            </div>
                            {answers['2_yes'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ bệnh lý..."
                                    value={otherText['2_yes'] || ''}
                                    onChange={(e) => handleOtherTextChange('2_yes', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="2_none"
                                    checked={answers['2_none'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('2_none', checked)}
                                />
                                <Label htmlFor="2_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question 3 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="3_yes"
                                    checked={answers['3_yes'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('3_yes', checked)}
                                />
                                <Label htmlFor="3_yes" className="text-base leading-relaxed">
                                    Có
                                </Label>
                            </div>
                            {answers['3_yes'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ bệnh cụ thể..."
                                    value={otherText['3_yes'] || ''}
                                    onChange={(e) => handleOtherTextChange('3_yes', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="3_other"
                                    checked={answers['3_other'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('3_other', checked)}
                                />
                                <Label htmlFor="3_other" className="text-base leading-relaxed">
                                    Bệnh khác
                                </Label>
                            </div>
                            {answers['3_other'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ bệnh khác..."
                                    value={otherText['3_other'] || ''}
                                    onChange={(e) => handleOtherTextChange('3_other', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="3_none"
                                    checked={answers['3_none'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('3_none', checked)}
                                />
                                <Label htmlFor="3_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question 4 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            4. Trong 12 tháng gần đây, anh/chị có:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="q4_disease"
                                    checked={answers['4_disease'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('4_disease', checked)}
                                />
                                <Label htmlFor="q4_disease" className="text-base leading-relaxed">
                                    Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa?
                                </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="q4_transfusion"
                                    checked={answers['4_transfusion'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('4_transfusion', checked)}
                                />
                                <Label htmlFor="q4_transfusion" className="text-base leading-relaxed">
                                    Được truyền máu hoặc các chế phẩm máu?
                                </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="q4_vaccine"
                                    checked={answers['4_vaccine'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('4_vaccine', checked)}
                                />
                                <Label htmlFor="q4_vaccine" className="text-base leading-relaxed">
                                    Tiêm Vacxin?
                                </Label>
                            </div>
                            {answers['4_vaccine'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ loại vacxin..."
                                    value={otherText['4_vaccine'] || ''}
                                    onChange={(e) => handleOtherTextChange('4_vaccine', e.target.value)}
                                    className="ml-6 text-base"
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="q4_none"
                                    checked={answers['4_none'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('4_none', checked)}
                                />
                                <Label htmlFor="q4_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question 5 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            5. Trong 06 tháng gần đây, anh/chị có:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {[
                                { id: '5_disease', text: 'Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương?' },
                                { id: '5_weightloss', text: 'Sút cân nhanh không rõ nguyên nhân?' },
                                { id: '5_lymph', text: 'Nổi hạch kéo dài?' },
                                { id: '5_medical', text: 'Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,…)?' },
                                { id: '5_tattoo', text: 'Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể?' },
                                { id: '5_drugs', text: 'Sử dụng ma túy?' },
                                { id: '5_blood_contact', text: 'Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm?' },
                                { id: '5_hepatitis_contact', text: 'Sinh sống chung với người nhiễm bệnh Viêm gan siêu vi B?' },
                                { id: '5_sexual_contact', text: 'Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai?' },
                                { id: '5_same_sex', text: 'Quan hệ tình dục với người cùng giới?' },
                                { id: '5_none', text: 'Không' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-start space-x-2">
                                    <Checkbox
                                        id={item.id}
                                        checked={answers[item.id] || false}
                                        onCheckedChange={(checked) => handleMultiSelectChange(item.id, checked)}
                                    />
                                    <Label htmlFor={item.id} className="text-base leading-relaxed">
                                        {item.text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Question 6 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            6. Trong 01 tháng gần đây, anh/chị có:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {[
                                { id: '6_disease', text: 'Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?' },
                                { id: '6_epidemic', text: 'Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,…)?' },
                                { id: '6_none', text: 'Không' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-start space-x-2">
                                    <Checkbox
                                        id={item.id}
                                        checked={answers[item.id] || false}
                                        onCheckedChange={(checked) => handleMultiSelectChange(item.id, checked)}
                                    />
                                    <Label htmlFor={item.id} className="text-base leading-relaxed">
                                        {item.text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Question 7 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            7. Trong 14 ngày gần đây, anh/chị có:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="7_symptoms"
                                    checked={answers['7_symptoms'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('7_symptoms', checked)}
                                />
                                <Label htmlFor="7_symptoms" className="text-base leading-relaxed">
                                    Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?
                                </Label>
                            </div>
                            {answers['7_symptoms'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ triệu chứng cụ thể..."
                                    value={otherText['7_symptoms'] || ''}
                                    onChange={(e) => handleOtherTextChange('7_symptoms', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="7_other"
                                    checked={answers['7_other'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('7_other', checked)}
                                />
                                <Label htmlFor="7_other" className="text-base leading-relaxed">
                                    Khác (cụ thể)
                                </Label>
                            </div>
                            {answers['7_other'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ..."
                                    value={otherText['7_other'] || ''}
                                    onChange={(e) => handleOtherTextChange('7_other', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="7_none"
                                    checked={answers['7_none'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('7_none', checked)}
                                />
                                <Label htmlFor="7_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question 8 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            8. Trong 07 ngày gần đây, anh/chị có:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="8_medication"
                                    checked={answers['8_medication'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('8_medication', checked)}
                                />
                                <Label htmlFor="8_medication" className="text-base leading-relaxed">
                                    Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?
                                </Label>
                            </div>
                            {answers['8_medication'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ loại thuốc cụ thể..."
                                    value={otherText['8_medication'] || ''}
                                    onChange={(e) => handleOtherTextChange('8_medication', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="8_other"
                                    checked={answers['8_other'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('8_other', checked)}
                                />
                                <Label htmlFor="8_other" className="text-base leading-relaxed">
                                    Khác (cụ thể)
                                </Label>
                            </div>
                            {answers['8_other'] && (
                                <Textarea
                                    placeholder="Vui lòng ghi rõ..."
                                    value={otherText['8_other'] || ''}
                                    onChange={(e) => handleOtherTextChange('8_other', e.target.value)}
                                    className="ml-6 text-base"
                                    required
                                />
                            )}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="8_none"
                                    checked={answers['8_none'] || false}
                                    onCheckedChange={(checked) => handleMultiSelectChange('8_none', checked)}
                                />
                                <Label htmlFor="8_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question 9 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">
                            9. Câu hỏi dành cho phụ nữ:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="9_pregnant"
                                    checked={answers['9_pregnant'] || false}
                                    onCheckedChange={(checked) => handleSingleSelectChange('9_pregnant', checked)}
                                />
                                <Label htmlFor="9_pregnant" className="text-base leading-relaxed">
                                    Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi?
                                </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="9_terminated"
                                    checked={answers['9_terminated'] || false}
                                    onCheckedChange={(checked) => handleSingleSelectChange('9_terminated', checked)}
                                />
                                <Label htmlFor="9_terminated" className="text-base leading-relaxed">
                                    Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)?
                                </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="9_none"
                                    checked={answers['9_none'] || false}
                                    onCheckedChange={(checked) => handleSingleSelectChange('9_none', checked)}
                                />
                                <Label htmlFor="9_none" className="text-base leading-relaxed">
                                    Không
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                    <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                        Hoàn thành khảo sát
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterDonation
