'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Droplet, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Phone,
  UserCheck,
  Activity,
  Target,
  Heart,
  Navigation
} from 'lucide-react';

// Mock data
const mockData = {
  overview: {
    totalDonors: 2847,
    activeDonors: 1203,
    bloodRequests: 23,
    urgentRequests: 5,
    completedToday: 12,
    averageResponseTime: '18 mins'
  },
  bloodInventory: {
    'A_POSITIVE': { available: 45, critical: 20, percentage: 75 },
    'A_NEGATIVE': { available: 12, critical: 15, percentage: 40 },
    'B_POSITIVE': { available: 32, critical: 20, percentage: 65 },
    'B_NEGATIVE': { available: 8, critical: 10, percentage: 30 },
    'AB_POSITIVE': { available: 18, critical: 15, percentage: 55 },
    'AB_NEGATIVE': { available: 5, critical: 8, percentage: 25 },
    'O_POSITIVE': { available: 67, critical: 25, percentage: 85 },
    'O_NEGATIVE': { available: 15, critical: 18, percentage: 45 }
  },
  recentRequests: [
    {
      id: 1,
      type: 'Cấp cứu',
      bloodType: 'O_NEGATIVE',
      quantity: 3,
      location: 'Bệnh viện Chợ Rẫy',
      distance: '2.3 km',
      status: 'pending',
      time: '10 phút trước',
      priority: 'urgent'
    },
    {
      id: 2,
      type: 'Phẫu thuật',
      bloodType: 'A_POSITIVE',
      quantity: 2,
      location: 'Bệnh viện Nhân dân 115',
      distance: '5.7 km',
      status: 'processing',
      time: '25 phút trước',
      priority: 'high'
    },
    {
      id: 3,
      type: 'Điều trị',
      bloodType: 'B_POSITIVE',
      quantity: 1,
      location: 'Bệnh viện Đại học Y Dược',
      distance: '8.1 km',
      status: 'completed',
      time: '1 giờ trước',
      priority: 'normal'
    }
  ],
  nearbyDonors: [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      bloodType: 'O_NEGATIVE',
      distance: '1.2 km',
      phone: '0901234567',
      lastDonation: '3 tháng trước',
      eligible: true,
      responseRate: '95%'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      bloodType: 'A_POSITIVE',
      distance: '2.8 km',
      phone: '0912345678',
      lastDonation: '2 tháng trước',
      eligible: true,
      responseRate: '87%'
    },
    {
      id: 3,
      name: 'Lê Minh Cường',
      bloodType: 'B_POSITIVE',
      distance: '3.5 km',
      phone: '0923456789',
      lastDonation: '1 tháng trước',
      eligible: false,
      responseRate: '92%'
    }
  ],
  todayActivities: [
    { time: '09:15', action: 'Yêu cầu máu O- từ BV Chợ Rẫy', status: 'new' },
    { time: '09:32', action: 'Liên hệ người hiến Nguyễn Văn An', status: 'processing' },
    { time: '10:45', action: 'Hoàn thành yêu cầu #BLD-2025-001', status: 'completed' },
    { time: '11:20', action: 'Cập nhật kho máu A+', status: 'completed' },
    { time: '14:15', action: 'Yêu cầu khẩn cấp từ BV 115', status: 'urgent' }
  ]
};

const bloodTypeColors = {
  'A_POSITIVE': 'bg-red-500',
  'A_NEGATIVE': 'bg-red-400',
  'B_POSITIVE': 'bg-blue-500',
  'B_NEGATIVE': 'bg-blue-400',
  'AB_POSITIVE': 'bg-purple-500',
  'AB_NEGATIVE': 'bg-purple-400',
  'O_POSITIVE': 'bg-green-500',
  'O_NEGATIVE': 'bg-green-400'
};

const bloodTypeLabels = {
  'A_POSITIVE': 'A+',
  'A_NEGATIVE': 'A-',
  'B_POSITIVE': 'B+',
  'B_NEGATIVE': 'B-',
  'AB_POSITIVE': 'AB+',
  'AB_NEGATIVE': 'AB-',
  'O_POSITIVE': 'O+',
  'O_NEGATIVE': 'O-'
};

export default function DashboardForStaff() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">Quản lý yêu cầu hiến máu và người hiến</p>
          </div>
          <div className="flex gap-2">
            <Button variant={selectedTimeframe === 'today' ? 'default' : 'outline'} 
                    onClick={() => setSelectedTimeframe('today')}>
              Hôm nay
            </Button>
            <Button variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
                    onClick={() => setSelectedTimeframe('week')}>
              Tuần này
            </Button>
            <Button variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                    onClick={() => setSelectedTimeframe('month')}>
              Tháng này
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người hiến</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.overview.totalDonors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Người hiến hoạt động</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.overview.activeDonors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> so với tuần trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yêu cầu hiện tại</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.overview.bloodRequests}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-red-600 font-medium">{mockData.overview.urgentRequests} khẩn cấp</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thời gian phản hồi TB</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.overview.averageResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-15%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blood Inventory */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-red-500" />
                Tồn kho máu
              </CardTitle>
              <CardDescription>Trạng thái hiện tại của các nhóm máu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(mockData.bloodInventory).map(([type, data]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{bloodTypeLabels[type]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{data.available} đơn vị</span>
                      <Badge variant={data.available < data.critical ? 'destructive' : 'secondary'}>
                        {data.available < data.critical ? 'Thiếu' : 'Đủ'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={data.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Yêu cầu gần đây
              </CardTitle>
              <CardDescription>Các yêu cầu hiến máu mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}>
                        <div className="w-full h-full bg-current rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.type}</span>
                          <Badge variant="outline">{bloodTypeLabels[request.bloodType]}</Badge>
                          <span className="text-sm text-gray-600">{request.quantity} đơn vị</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {request.distance}
                          </span>
                          <span>{request.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'pending' && 'Chờ xử lý'}
                        {request.status === 'processing' && 'Đang xử lý'}
                        {request.status === 'completed' && 'Hoàn thành'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {request.status === 'pending' ? 'Xử lý' : 'Chi tiết'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nearby Donors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Người hiến gần đây
              </CardTitle>
              <CardDescription>Danh sách người hiến trong khu vực</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.nearbyDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{donor.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{donor.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {bloodTypeLabels[donor.bloodType]}
                          </Badge>
                          {donor.eligible ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {donor.distance}
                          </span>
                          <span>Hiến gần nhất: {donor.lastDonation}</span>
                          <span>Phản hồi: {donor.responseRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Gọi
                      </Button>
                      <Button size="sm">
                        Mời hiến
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Hoạt động hôm nay
              </CardTitle>
              <CardDescription>Lịch sử hoạt động trong ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.todayActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'completed' ? 'bg-green-500' :
                        activity.status === 'urgent' ? 'bg-red-500' :
                        activity.status === 'processing' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{activity.action}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <Badge className={`mt-1 ${getStatusColor(activity.status)} text-xs`}>
                        {activity.status === 'completed' && 'Hoàn thành'}
                        {activity.status === 'urgent' && 'Khẩn cấp'}
                        {activity.status === 'processing' && 'Đang xử lý'}
                        {activity.status === 'new' && 'Mới'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" />
              Hành động nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <span className="text-sm">Yêu cầu khẩn cấp</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="text-sm">Tìm người hiến</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Droplet className="h-6 w-6 text-green-500" />
                <span className="text-sm">Cập nhật kho</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-sm">Lịch sử hiến máu</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}