'use client';
import { useState, useEffect } from 'react';

export default function BloodRequestPage() {
  const [requests] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      age: 28,
      bloodType: 'O-',
      hospital: 'Bệnh viện Đại học Y Dược',
      status: 'RẤT KHẨN CẤP',
      unitsNeeded: 4,
      distance: '2.1',
      timeAgo: '5 phút trước',
      matchRate: 95
    },
    {
      id: 2,
      name: 'Lê Thị Hương',
      age: 35,
      bloodType: 'A+',
      hospital: 'Bệnh viện Chợ Rẫy',
      status: 'KHẨN CẤP',
      unitsNeeded: 2,
      distance: '3.5',
      timeAgo: '15 phút trước',
      matchRate: 85
    },
    {
      id: 3,
      name: 'Phạm Thị Mai',
      age: 45,
      bloodType: 'B+',
      hospital: 'Bệnh viện Quân Y 175',
      status: 'RẤT KHẨN CẤP',
      unitsNeeded: 3,
      distance: '4.2',
      timeAgo: '10 phút trước',
      matchRate: 92
    },
    {
      id: 4,
      name: 'Trần Minh Tuấn',
      age: 31,
      bloodType: 'AB-',
      hospital: 'Bệnh viện Đa khoa Thủ Đức',
      status: 'KHẨN CẤP',
      unitsNeeded: 2,
      distance: '5.7',
      timeAgo: '20 phút trước',
      matchRate: 88
    },
    {
      id: 5,
      name: 'Nguyễn Hoàng Nam',
      age: 52,
      bloodType: 'O+',
      hospital: 'Bệnh viện Nhân dân Gia Định',
      status: 'RẤT KHẨN CẤP',
      unitsNeeded: 5,
      distance: '1.8',
      timeAgo: '8 phút trước',
      matchRate: 94
    }
  ]);

  const [selectedBloodType, setSelectedBloodType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBloodType]);

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
    'RẤT KHẨN CẤP': 'bg-red-100 text-red-600',
    'KHẨN CẤP': 'bg-orange-100 text-orange-600'
  };

  const bloodTypeColors = {
    'O-': 'bg-red-500',
    'O+': 'bg-red-400',
    'A+': 'bg-orange-500',
    'A-': 'bg-orange-400',
    'B+': 'bg-purple-500',
    'B-': 'bg-purple-400',
    'AB+': 'bg-blue-500',
    'AB-': 'bg-blue-400'
  };

  const filteredRequests = requests
    .filter(request => {
      if (selectedBloodType === 'all') return true;
      return request.bloodType === selectedBloodType;
    })
    .sort((a, b) => {
      const emergencyOrder = {
        'RẤT KHẨN CẤP': 1,
        'KHẨN CẤP': 2
      };
      return emergencyOrder[a.status] - emergencyOrder[b.status];
    });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b">
        <div className="p-4 flex justify-between items-center">
          <div className={`${bloodTypeColors[request.bloodType]} w-16 h-16 rounded-lg flex items-center justify-center`}>
            <span className="text-white text-2xl font-bold">{request.bloodType}</span>
          </div>
          <span className={`px-4 py-2 rounded-full ${emergencyColors[request.status]}`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-1">{request.name}</h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>{request.age} tuổi</span>
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
              {request.matchRate}%
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{request.distance} km</span>
            <span className="text-gray-400">•</span>
            <span>{request.timeAgo}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{request.hospital}</span>
          </div>
        </div>

        <div className="border border-blue-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600">Cần</span>
            <span className="text-3xl font-bold text-green-500">{request.unitsNeeded}</span>
            <span className="text-gray-600">đơn vị máu</span>
          </div>
        </div>

        <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold">
          Đăng ký
        </button>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === index + 1
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Sau
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Yêu Cầu Máu Khẩn Cấp</h1>
        <p className="text-gray-600">
          Kết nối những người hiến máu với những người cần máu. Một giọt máu đúng thời điểm trong việc cứu sống.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người yêu cầu..."
          className="flex-1 p-2 border rounded-lg"
        />
        <select 
          className="p-2 border rounded-lg bg-white"
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

      <div>
        <div className="grid gap-4 md:grid-cols-2">
          {currentRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
}