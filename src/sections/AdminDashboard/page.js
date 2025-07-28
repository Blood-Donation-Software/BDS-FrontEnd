
'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  getAdminDashboardData,
  getDonationEventChartData,
  getBloodStock 
} from '@/apis/dashboard';
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import { 
  Users, 
  Droplet, 
  Calendar,
  Activity,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  UserPlus,
  HeartHandshake,
  Bell
} from 'lucide-react';

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  // Fetch chart data when timeframe changes
  useEffect(() => {
    if (dashboardData) {
      fetchChartData();
    }
  }, [selectedTimeframe]);

  const fetchAdminDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboardData();
      const bloodStockData = await getBloodStock();
      
      setDashboardData({
        ...data,
        bloodStock: bloodStockData
      });
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const chartData = await getDonationEventChartData(selectedTimeframe);
      setDashboardData(prev => ({
        ...prev,
        donationEventChartData: chartData
      }));
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAdminDashboardData}>Thử lại</Button>
        </div>
      </div>
    );
  }

  // Helper functions
  const getEventData = () => {
    return dashboardData?.donationEventChartData || [];
  };

  const getTimeLabel = () => {
    switch (selectedTimeframe) {
      case 'week':
        return 'ngày trong tuần';
      case 'month':
        return 'tháng trong năm';
      case 'year':
        return 'năm';
      default:
        return 'ngày';
    }
  };

  const getActivityIcon = (iconName) => {
    const icons = {
      Calendar: Calendar,
      UserPlus: UserPlus,
      CheckCircle: CheckCircle,
      Droplet: Droplet
    };
    const IconComponent = icons[iconName] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const getActivityStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      case 'new':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Tổng quan hệ thống hiến máu</p>
          </div>
        </div>

        {/* Total Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Donors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số người hiến máu</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboardData?.totalStats?.totalDonors?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardData?.totalStats?.newDonorsThisMonth || 0}</span> tháng này
              </p>
            </CardContent>
          </Card>

          {/* Total Accounts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số tài khoản</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{dashboardData?.totalStats?.totalAccounts?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardData?.totalStats?.totalAccounts || 0}</span> tài khoản mới
              </p>
            </CardContent>
          </Card>

          {/* Available Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sự kiện đang hoạt động</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData?.donationEventStats?.available || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.donationEventStats?.completed || 0} hoàn thành
              </p>
            </CardContent>
          </Card>

          {/* Published Blogs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog đã xuất bản</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData?.blogStats?.published || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.blogStats?.draft || 0} bản nháp
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Hoạt động gần đây
              </CardTitle>
              <CardDescription>
                Các hoạt động mới nhất trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(dashboardData?.recentActivities || []).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <Badge className={`text-xs ${getActivityStatusColor(activity.status)}`}>
                          {activity.status === 'completed' && 'Hoàn thành'}
                          {activity.status === 'fulfilled' && 'Đã xử lý'}
                          {activity.status === 'new' && 'Mới'}
                          {activity.status === 'pending' && 'Chờ xử lý'}
                          {activity.status === 'ongoing' && 'Đang diễn ra'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation Events Chart */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Thống kê người hiến máu
                    </CardTitle>
                    <CardDescription>
                      Tổng số người hiến máu theo {getTimeLabel()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant={selectedTimeframe === 'week' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedTimeframe('week')}
                    >
                      Tuần
                    </Button>
                    <Button 
                      variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe('month')}
                    >
                      Tháng
                    </Button>
                    <Button 
                      variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe('year')}
                    >
                      Năm
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getEventData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeKey" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value.toLocaleString(), 'Người hiến máu']}
                        labelFormatter={(label) => {
                          if (selectedTimeframe === 'week') return `Ngày: ${label}`;
                          if (selectedTimeframe === 'month') return `Tháng: ${label}`;
                          if (selectedTimeframe === 'year') return `Năm: ${label}`;
                          return label;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalDonors" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Blood Stock Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-red-500" />
                  Tồn kho máu theo nhóm máu
                </CardTitle>
                <CardDescription>
                  Số lượng các thành phần máu theo từng nhóm máu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData?.bloodStock || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bloodType" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="wholeBlood" stackId="a" fill="#dc2626" name="Máu toàn phần" />
                      <Bar dataKey="redCells" stackId="a" fill="#ea580c" name="Hồng cầu" />
                      <Bar dataKey="plasma" stackId="a" fill="#ca8a04" name="Huyết tương" />
                      <Bar dataKey="platelets" stackId="a" fill="#16a34a" name="Tiểu cầu" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Hành động quản trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="text-sm">Quản lý người dùng</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Calendar className="h-6 w-6 text-green-500" />
                <span className="text-sm">Quản lý sự kiện</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <FileText className="h-6 w-6 text-orange-500" />
                <span className="text-sm">Quản lý blog</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Droplet className="h-6 w-6 text-red-500" />
                <span className="text-sm">Quản lý kho máu</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <HeartHandshake className="h-6 w-6 text-purple-500" />
                <span className="text-sm">Báo cáo hệ thống</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}