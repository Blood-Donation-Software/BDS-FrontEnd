'use client';

import React, { useState, useEffect } from 'react'
import { useDonationEvents } from "@/context/donationEvent_context"

function RegisterDonation({ params }) {
    const { selectedEvent, selectedShift, selectEventById, selectShift } = useDonationEvents();
    const [answers, setAnswers] = useState({})
    const [otherText, setOtherText] = useState({})

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

    const handleOtherTextChange = (questionId, value) => {
        setOtherText(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    const handleSubmit = () => {
        const submissionData = {
            event: selectedEvent,
            selectedShift: selectedShift,
            healthSurvey: answers,
            otherDetails: otherText
        };
        console.log('Submitted:', submissionData);
        
        // Validation for all-day events
        if (selectedEvent?.isAllDay && !selectedShift) {
            alert('Vui lòng chọn ca làm việc trước khi tiếp tục!');
            return;
        }
        
        // Add your submission logic here
        alert('Đã hoàn thành đăng ký thành công!');
    }

    return (
        <div className="health-survey-container">
            <div className="survey-header">
                <h1>Khảo sát sức khỏe trước khi hiến máu</h1>
                {selectedEvent && (
                    <div className="event-info">
                        <h2>{selectedEvent.name}</h2>
                        <p><strong>Địa điểm:</strong> {selectedEvent.location}</p>
                        <p><strong>Ngày:</strong> {selectedEvent.date}</p>
                        
                        {selectedEvent.isAllDay ? (
                            <div className="shift-selection">
                                <p><strong>Chọn ca làm việc:</strong></p>
                                <div className="shift-options">
                                    {selectedEvent.shifts.map((shift, index) => (
                                        <label key={index} className="shift-option">
                                            <input
                                                type="radio"
                                                name="shift"
                                                value={shift}
                                                checked={selectedShift === shift}
                                                onChange={() => handleShiftSelect(shift)}
                                            />
                                            <span>{shift}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedShift && (
                                    <p className="selected-shift">
                                        <strong>Ca đã chọn:</strong> {selectedShift}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p><strong>Giờ:</strong> {selectedEvent.shifts[0]}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="survey-content">
                {/* Question 1 */}
                <div className="question-container">
                    <h3 className="question-title">1. Anh/chị từng hiến máu chưa?</h3>
                    <div className="answer-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q1"
                                value="Có"
                                checked={answers[1] === 'Có'}
                                onChange={(e) => handleAnswerChange(1, e.target.value)}
                            />
                            <span>Có</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q1"
                                value="Không"
                                checked={answers[1] === 'Không'}
                                onChange={(e) => handleAnswerChange(1, e.target.value)}
                            />
                            <span>Không</span>
                        </label>
                    </div>
                </div>

                {/* Question 2 */}
                <div className="question-container">
                    <h3 className="question-title">2. Hiện tại, anh/chị có mắc bệnh lý nào không?</h3>
                    <div className="answer-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q2"
                                value="Có"
                                checked={answers[2] === 'Có'}
                                onChange={(e) => handleAnswerChange(2, e.target.value)}
                            />
                            <span>Có</span>
                        </label>
                        {answers[2] === 'Có' && (
                            <textarea
                                className="other-input"
                                placeholder="Vui lòng ghi rõ bệnh lý..."
                                value={otherText[2] || ''}
                                onChange={(e) => handleOtherTextChange(2, e.target.value)}
                                required
                            />
                        )}
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q2"
                                value="Không"
                                checked={answers[2] === 'Không'}
                                onChange={(e) => handleAnswerChange(2, e.target.value)}
                            />
                            <span>Không</span>
                        </label>
                    </div>
                </div>

                {/* Question 3 */}
                <div className="question-container">
                    <h3 className="question-title">3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?</h3>
                    <div className="answer-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q3"
                                value="Có"
                                checked={answers[3] === 'Có'}
                                onChange={(e) => handleAnswerChange(3, e.target.value)}
                            />
                            <span>Có</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q3"
                                value="Không"
                                checked={answers[3] === 'Không'}
                                onChange={(e) => handleAnswerChange(3, e.target.value)}
                            />
                            <span>Không</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q3"
                                value="Bệnh khác"
                                checked={answers[3] === 'Bệnh khác'}
                                onChange={(e) => handleAnswerChange(3, e.target.value)}
                            />
                            <span>Bệnh khác</span>
                        </label>
                        {answers[3] === 'Bệnh khác' && (
                            <textarea
                                className="other-input"
                                placeholder="Vui lòng ghi rõ bệnh khác..."
                                value={otherText[3] || ''}
                                onChange={(e) => handleOtherTextChange(3, e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Question 4 */}
                <div className="question-container">
                    <h3 className="question-title">4. Trong 12 tháng gần đây, anh/chị có:</h3>
                    <div className="answer-options checkbox-group">
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q4_disease"
                                checked={answers['4_disease'] || false}
                                onChange={(e) => handleAnswerChange('4_disease', e.target.checked)}
                            />
                            <span>Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q4_transfusion"
                                checked={answers['4_transfusion'] || false}
                                onChange={(e) => handleAnswerChange('4_transfusion', e.target.checked)}
                            />
                            <span>Được truyền máu hoặc các chế phẩm máu?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q4_vaccine"
                                checked={answers['4_vaccine'] || false}
                                onChange={(e) => handleAnswerChange('4_vaccine', e.target.checked)}
                            />
                            <span>Tiêm Vacxin?</span>
                        </label>
                        {answers['4_vaccine'] && (
                            <textarea
                                className="other-input"
                                placeholder="Vui lòng ghi rõ loại vacxin..."
                                value={otherText['4_vaccine'] || ''}
                                onChange={(e) => handleOtherTextChange('4_vaccine', e.target.value)}
                            />
                        )}
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q4_none"
                                checked={answers['4_none'] || false}
                                onChange={(e) => handleAnswerChange('4_none', e.target.checked)}
                            />
                            <span>Không</span>
                        </label>
                    </div>
                </div>

                {/* Question 5 */}
                <div className="question-container">
                    <h3 className="question-title">5. Trong 06 tháng gần đây, anh/chị có:</h3>
                    <div className="answer-options checkbox-group">
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_disease"
                                checked={answers['5_disease'] || false}
                                onChange={(e) => handleAnswerChange('5_disease', e.target.checked)}
                            />
                            <span>Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_weightloss"
                                checked={answers['5_weightloss'] || false}
                                onChange={(e) => handleAnswerChange('5_weightloss', e.target.checked)}
                            />
                            <span>Sút cân nhanh không rõ nguyên nhân?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_lymph"
                                checked={answers['5_lymph'] || false}
                                onChange={(e) => handleAnswerChange('5_lymph', e.target.checked)}
                            />
                            <span>Nổi hạch kéo dài?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_medical"
                                checked={answers['5_medical'] || false}
                                onChange={(e) => handleAnswerChange('5_medical', e.target.checked)}
                            />
                            <span>Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,…)?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_tattoo"
                                checked={answers['5_tattoo'] || false}
                                onChange={(e) => handleAnswerChange('5_tattoo', e.target.checked)}
                            />
                            <span>Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_drugs"
                                checked={answers['5_drugs'] || false}
                                onChange={(e) => handleAnswerChange('5_drugs', e.target.checked)}
                            />
                            <span>Sử dụng ma túy?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_blood_contact"
                                checked={answers['5_blood_contact'] || false}
                                onChange={(e) => handleAnswerChange('5_blood_contact', e.target.checked)}
                            />
                            <span>Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_hepatitis_contact"
                                checked={answers['5_hepatitis_contact'] || false}
                                onChange={(e) => handleAnswerChange('5_hepatitis_contact', e.target.checked)}
                            />
                            <span>Sinh sống chung với người nhiễm bệnh Viêm gan siêu vi B?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_sexual_contact"
                                checked={answers['5_sexual_contact'] || false}
                                onChange={(e) => handleAnswerChange('5_sexual_contact', e.target.checked)}
                            />
                            <span>Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_same_sex"
                                checked={answers['5_same_sex'] || false}
                                onChange={(e) => handleAnswerChange('5_same_sex', e.target.checked)}
                            />
                            <span>Quan hệ tình dục với người cùng giới?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q5_none"
                                checked={answers['5_none'] || false}
                                onChange={(e) => handleAnswerChange('5_none', e.target.checked)}
                            />
                            <span>Không</span>
                        </label>
                    </div>
                </div>

                {/* Question 6 */}
                <div className="question-container">
                    <h3 className="question-title">6. Trong 01 tháng gần đây, anh/chị có:</h3>
                    <div className="answer-options checkbox-group">
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q6_disease"
                                checked={answers['6_disease'] || false}
                                onChange={(e) => handleAnswerChange('6_disease', e.target.checked)}
                            />
                            <span>Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q6_epidemic"
                                checked={answers['6_epidemic'] || false}
                                onChange={(e) => handleAnswerChange('6_epidemic', e.target.checked)}
                            />
                            <span>Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,…)?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q6_none"
                                checked={answers['6_none'] || false}
                                onChange={(e) => handleAnswerChange('6_none', e.target.checked)}
                            />
                            <span>Không</span>
                        </label>
                    </div>
                </div>

                {/* Question 7 */}
                <div className="question-container">
                    <h3 className="question-title">7. Trong 14 ngày gần đây, anh/chị có:</h3>
                    <div className="answer-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q7"
                                value="Có"
                                checked={answers[7] === 'Có'}
                                onChange={(e) => handleAnswerChange(7, e.target.value)}
                            />
                            <span>Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q7"
                                value="Không"
                                checked={answers[7] === 'Không'}
                                onChange={(e) => handleAnswerChange(7, e.target.value)}
                            />
                            <span>Không</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q7"
                                value="Khác"
                                checked={answers[7] === 'Khác'}
                                onChange={(e) => handleAnswerChange(7, e.target.value)}
                            />
                            <span>Khác (cụ thể)</span>
                        </label>
                        {answers[7] === 'Khác' && (
                            <textarea
                                className="other-input"
                                placeholder="Vui lòng ghi rõ..."
                                value={otherText[7] || ''}
                                onChange={(e) => handleOtherTextChange(7, e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Question 8 */}
                <div className="question-container">
                    <h3 className="question-title">8. Trong 07 ngày gần đây, anh/chị có:</h3>
                    <div className="answer-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q8"
                                value="Có"
                                checked={answers[8] === 'Có'}
                                onChange={(e) => handleAnswerChange(8, e.target.value)}
                            />
                            <span>Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q8"
                                value="Không"
                                checked={answers[8] === 'Không'}
                                onChange={(e) => handleAnswerChange(8, e.target.value)}
                            />
                            <span>Không</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="q8"
                                value="Khác"
                                checked={answers[8] === 'Khác'}
                                onChange={(e) => handleAnswerChange(8, e.target.value)}
                            />
                            <span>Khác (cụ thể)</span>
                        </label>
                        {answers[8] === 'Khác' && (
                            <textarea
                                className="other-input"
                                placeholder="Vui lòng ghi rõ..."
                                value={otherText[8] || ''}
                                onChange={(e) => handleOtherTextChange(8, e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Question 9 */}
                <div className="question-container">
                    <h3 className="question-title">9. Câu hỏi dành cho phụ nữ:</h3>
                    <div className="answer-options checkbox-group">
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q9_pregnant"
                                checked={answers['9_pregnant'] || false}
                                onChange={(e) => handleAnswerChange('9_pregnant', e.target.checked)}
                            />
                            <span>Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q9_terminated"
                                checked={answers['9_terminated'] || false}
                                onChange={(e) => handleAnswerChange('9_terminated', e.target.checked)}
                            />
                            <span>Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)?</span>
                        </label>
                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                name="q9_none"
                                checked={answers['9_none'] || false}
                                onChange={(e) => handleAnswerChange('9_none', e.target.checked)}
                            />
                            <span>Không</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="submit-section">
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                >
                    Hoàn thành khảo sát
                </button>
            </div>

            <style jsx>{`
        .health-survey-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .survey-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 20px;
        }
        
        .survey-header h1 {
          color: #333;
          font-size: 26px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .event-info {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          border: 1px solid #e9ecef;
        }
        
        .event-info h2 {
          color: #d32f2f;
          font-size: 20px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .event-info p {
          margin: 5px 0;
          color: #495057;
          font-size: 15px;
        }
        
        .shift-selection {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #dee2e6;
        }
        
        .shift-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 10px 0;
        }
        
        .shift-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #ffffff;
        }
        
        .shift-option:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
        }
        
        .shift-option input[type="radio"] {
          margin: 0;
          width: 16px;
          height: 16px;
        }
        
        .shift-option input[type="radio"]:checked + span {
          font-weight: bold;
          color: #007bff;
        }
        
        .shift-option input[type="radio"]:checked {
          accent-color: #007bff;
        }
        
        .shift-option:has(input[type="radio"]:checked) {
          border-color: #007bff;
          background-color: #e7f3ff;
        }
        
        .selected-shift {
          margin-top: 10px;
          padding: 10px;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          color: #155724;
        }
        
        .survey-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .question-container {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #fafafa;
        }
        
        .question-title {
          color: #d32f2f;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .answer-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .radio-option, .checkbox-option {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
          border: 1px solid transparent;
        }
        
        .radio-option:hover, .checkbox-option:hover {
          background-color: #f0f8ff;
          border-color: #007bff;
        }
        
        .radio-option input, .checkbox-option input {
          margin-top: 2px;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
        }
        
        .radio-option span, .checkbox-option span {
          line-height: 1.4;
          font-size: 15px;
          word-wrap: break-word;
          flex: 1;
        }
        
        .checkbox-group {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 15px;
          background-color: #ffffff;
        }
        
        .other-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 10px;
          margin-left: 26px;
          min-height: 60px;
          resize: vertical;
          font-family: inherit;
        }
        
        .submit-section {
          display: flex;
          justify-content: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid #e0e0e0;
        }
        
        .submit-button {
          padding: 15px 40px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          background-color: #28a745;
          color: white;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover {
          background-color: #218838;
        }
        
        @media (max-width: 768px) {
          .health-survey-container {
            padding: 15px;
          }
          
          .question-container {
            padding: 15px;
          }
          
          .question-title {
            font-size: 16px;
          }
          
          .radio-option span, .checkbox-option span {
            font-size: 14px;
          }
        }
      `}</style>
        </div>
    )
}

export default RegisterDonation
