'use client';
import { useState, useEffect } from 'react';
import { getEmergencyBloodRequests } from '@/apis/bloodrequest';
import { HOSPITAL_ADDRESS, HOSPITAL_NAME, HOSPITAL_PHONE } from '@/global-config';
import { Hospital, MapPinHouse, Phone } from 'lucide-react';

export default function BloodRequestPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBloodType, setSelectedBloodType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 6;

  // Fetch emergency blood requests from API
  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      try {
        setLoading(true);
        const data = await getEmergencyBloodRequests();
        setRequests(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching emergency blood requests:', err);
        setError('Không thể tải danh sách yêu cầu máu khẩn cấp');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyRequests();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBloodType, searchQuery]);

  const bloodTypeOptions = [
    { value: 'all', label: 'Tất cả nhóm máu' },
    { value: 'O-', label: 'O-' },
    { value: 'O+', label: 'O+' },
    { value: 'A-', label: 'A-' },
    { value: 'A+', label: 'A+' },
    { value: 'B-', label: 'B-' },
    { value: 'B+', label: 'B+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'AB+', label: 'AB+' },
  ];

  const emergencyColors = {
    'RẤT KHẨN CẤP': {
      bg: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-600',
      pulse: ''
    },
    'KHẨN CẤP': {
      bg: 'bg-red-500',
      text: 'text-white',
      border: 'border-red-500',
      pulse: ''
    }
  };

  const bloodTypeColors = {
    'O-': 'bg-gray-700',
    'O+': 'bg-gray-600',
    'A+': 'bg-gray-700',
    'A-': 'bg-gray-600',
    'B+': 'bg-gray-700',
    'B-': 'bg-gray-600',
    'AB+': 'bg-gray-700',
    'AB-': 'bg-gray-600',
    'O_NEGATIVE': 'bg-gray-700',
    'O_POSITIVE': 'bg-gray-600',
    'A_POSITIVE': 'bg-gray-700',
    'A_NEGATIVE': 'bg-gray-600',
    'B_POSITIVE': 'bg-gray-700',
    'B_NEGATIVE': 'bg-gray-600',
    'AB_POSITIVE': 'bg-gray-700',
    'AB_NEGATIVE': 'bg-gray-600'
  };

  const filteredRequests = requests
    .filter(request => {
      // Convert API blood type format (A_POSITIVE) to display format (A+)
      const getDisplayBloodType = (apiBloodType) => {
        if (!apiBloodType) return '';
        return apiBloodType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
      };

      const displayBloodType = getDisplayBloodType(request.bloodType);

      // Blood type filter
      if (selectedBloodType !== 'all' && displayBloodType !== selectedBloodType) {
        return false;
      }

      // Search query filter (search in patient name, address, or condition)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = request.profile?.name?.toLowerCase().includes(searchLower);
        const matchesAddress = `${request.profile?.address || ''} ${request.profile?.ward || ''} ${request.profile?.district || ''} ${request.profile?.city || ''}`.toLowerCase().includes(searchLower);
        const matchesCondition = request.medicalConditions?.join(' ').toLowerCase().includes(searchLower);
        const matchesNotes = request.additionalMedicalInformation?.toLowerCase().includes(searchLower);

        if (!matchesName && !matchesAddress && !matchesCondition && !matchesNotes) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const emergencyOrder = {
        'HIGH': 1,
        'MEDIUM': 2,
        'LOW': 3
      };
      // Sort by urgency first, then by created date
      const statusDiff = (emergencyOrder[a.urgency] || 4) - (emergencyOrder[b.urgency] || 4);
      if (statusDiff !== 0) return statusDiff;

      // Sort by creation date (newest first)
      return new Date(b.createdTime) - new Date(a.createdTime);
    });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const RequestCard = ({ request }) => {
    // Helper function to get time ago from date
    const getTimeAgo = (dateString) => {
      if (!dateString) return 'Không rõ thời gian';
      const now = new Date();
      const requestDate = new Date(dateString);
      const diffInMinutes = Math.floor((now - requestDate) / (1000 * 60));

      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    };

    // Convert API blood type format to display format
    const getDisplayBloodType = (apiBloodType) => {
      if (!apiBloodType) return 'N/A';
      return apiBloodType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
    };

    // Map API urgency to display status
    const getDisplayUrgency = (urgency) => {
      const urgencyMap = {
        'HIGH': 'RẤT KHẨN CẤP',
        'MEDIUM': 'KHẨN CẤP',
        'LOW': 'KHẨN CẤP'
      };
      return urgencyMap[urgency] || 'KHẨN CẤP';
    };

    // Get medical condition display text
    const getMedicalConditionText = (conditions) => {
      if (!conditions || conditions.length === 0) return 'Không rõ';
      const conditionMap = {
        'TRAUMA_EMERGENCY_SURGERY': 'Phẫu thuật cấp cứu do chấn thương',
        'CANCER_TREATMENT': 'Điều trị ung thư',
        'BLOOD_DISORDER': 'Rối loạn máu',
        'SURGERY': 'Phẫu thuật',
        'CHILDBIRTH': 'Sinh con',
        'ACCIDENT': 'Tai nạn'
      };
      return conditions.map(condition => conditionMap[condition] || condition).join(', ');
    };

    // Calculate total whole blood volume needed (in ml)
    const getTotalVolume = (componentRequests) => {
      if (!componentRequests || componentRequests.length === 0) return 'N/A';

      let totalWholeBloodNeeded = 0;

      componentRequests.forEach(component => {
        const volume = component.volume || 0;
        const componentType = component.componentType;

        // Reverse calculate whole blood needed based on component ratios
        let wholeBloodForThisComponent = 0;
        switch (componentType) {
          case 'PLASMA':
            wholeBloodForThisComponent = volume / 0.55; // PLASMA is 55% of whole blood
            break;
          case 'RED_BLOOD_CELLS':
            wholeBloodForThisComponent = volume / 0.44; // RED_BLOOD_CELLS is 44% of whole blood
            break;
          case 'PLATELETS':
            wholeBloodForThisComponent = volume / 0.01; // PLATELETS is 1% of whole blood
            break;
          case 'WHOLE_BLOOD':
            wholeBloodForThisComponent = volume; // Already whole blood
            break;
          default:
            wholeBloodForThisComponent = volume; // Default to treating as whole blood
        }

        totalWholeBloodNeeded += wholeBloodForThisComponent;
      });

      // Convert to ml and round to nearest integer
      return Math.round(totalWholeBloodNeeded);
    };

    // Calculate age from date of birth
    const getAge = (dateOfBirth) => {
      if (!dateOfBirth) return 'N/A';
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    };

    const displayBloodType = getDisplayBloodType(request.bloodType);
    const displayUrgency = getDisplayUrgency(request.urgency);
    const timeAgo = getTimeAgo(request.createdTime);
    const patientAge = getAge(request.profile?.dateOfBirth);
    const medicalCondition = getMedicalConditionText(request.medicalConditions);
    const totalVolume = getTotalVolume(request.componentRequests);
    const patientAddress = `${request.profile?.address || ''} ${request.profile?.ward || ''} ${request.profile?.district || ''} ${request.profile?.city || ''}`.trim();

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
        {/* Header with Status */}
        <div className={`${emergencyColors[displayUrgency]?.bg || 'bg-red-500'} p-4`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`${bloodTypeColors[displayBloodType] || 'bg-gray-700'} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">{displayBloodType}</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">{request.profile?.name || 'Bệnh nhân'}</h3>
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>{patientAge} tuổi</span>
                  <span>•</span>
                  <span>{displayBloodType}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-xs font-medium">{displayUrgency}</div>
              <div className="text-white text-xs">{timeAgo}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Blood Units Needed - Prominent Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
            <div className="text-gray-600 text-sm mb-1">Cần cấp thiết</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">{totalVolume}</span>
              <div className="text-left">
                <div className="text-gray-700 font-semibold text-sm">ml</div>
                <div className="text-gray-600 text-xs">máu toàn phần</div>
              </div>
            </div>
          </div>

          {/* Medical Condition */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium text-sm">Tình trạng:</span>
              <span className="text-sm">{medicalCondition}</span>
            </div>
            {request.additionalMedicalInformation && (
              <div className="flex items-center gap-2 text-gray-700 mt-2">
                <span className="font-medium text-sm">Thông tin thêm:</span>
                <span className="text-sm">{request.additionalMedicalInformation}</span>
              </div>
            )}
          </div>

          {/* Location & Contact Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs">
                  <Hospital />
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">
                  {HOSPITAL_NAME}
                </div>
                <div className="text-xs text-gray-500">Bệnh viện</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs">
                  <MapPinHouse />
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">
                  {HOSPITAL_ADDRESS || 'Không có địa chỉ'}
                </div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
              </div>
            </div>


            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs">
                  <Phone />
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{HOSPITAL_PHONE}</div>
                <div className="text-xs text-gray-500">Liên hệ</div>
              </div>
            </div>

            {/* {request.endTime && (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs">⏰</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">
                    {new Date(request.endTime).toLocaleString('vi-VN')}
                  </div>
                  <div className="text-xs text-gray-500">Thời hạn</div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    );
  };

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
      >
        ← Trước
      </button>

      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === index + 1
              ? 'bg-gray-800 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
      >
        Sau →
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            Cần máu cấp cứu
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yêu Cầu Máu Khẩn Cấp
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kết nối những người hiến máu với những người cần máu. Một giọt máu đúng thời điểm có thể cứu một sinh mạng.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredRequests.length}</div>
              <div className="text-gray-600 text-sm">Yêu cầu hiện tại</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredRequests.reduce((sum, r) => {
                if (!r.componentRequests || r.componentRequests.length === 0) return sum;

                let totalWholeBloodNeeded = 0;
                r.componentRequests.forEach(component => {
                  const volume = component.volume || 0;
                  const componentType = component.componentType;

                  let wholeBloodForThisComponent = 0;
                  switch (componentType) {
                    case 'PLASMA':
                      wholeBloodForThisComponent = volume / 0.55;
                      break;
                    case 'RED_BLOOD_CELLS':
                      wholeBloodForThisComponent = volume / 0.44;
                      break;
                    case 'PLATELETS':
                      wholeBloodForThisComponent = volume / 0.01;
                      break;
                    case 'WHOLE_BLOOD':
                      wholeBloodForThisComponent = volume;
                      break;
                    default:
                      wholeBloodForThisComponent = volume;
                  }
                  totalWholeBloodNeeded += wholeBloodForThisComponent;
                });

                return sum + Math.round(totalWholeBloodNeeded);
              }, 0)}</div>
              <div className="text-gray-600 text-sm">ml máu cần</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc bệnh viện..."
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Blood Type Filter */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white text-sm"
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
            >
              {bloodTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Đang tải...</h3>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy yêu cầu</h3>
            <p className="text-gray-600">Hãy thử điều chỉnh các bộ lọc để tìm thấy yêu cầu phù hợp.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>

            {totalPages > 1 && <Pagination />}
          </>
        )}
      </div>
    </div>
  );
}