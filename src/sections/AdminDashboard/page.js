
'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/language_context';
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
  const { t } = useLanguage();
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
      setError(t.dashboard.admin.error);
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
          <p className="mt-4 text-gray-600">{t.dashboard.admin.loading}</p>
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
          <Button onClick={fetchAdminDashboardData}>{t.dashboard.admin.retry}</Button>
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
        return t.dashboard.admin.timeframes.dayInWeek;
      case 'month':
        return t.dashboard.admin.timeframes.monthInYear;
      case 'year':
        return t.dashboard.admin.timeframes.years;
      default:
        return t.dashboard.admin.timeframes.day;
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

  const getActivityStatusText = (status) => {
    const statusMap = {
      'completed': t.dashboard.admin.activityStatus.completed,
      'fulfilled': t.dashboard.admin.activityStatus.fulfilled,
      'new': t.dashboard.admin.activityStatus.new,
      'pending': t.dashboard.admin.activityStatus.pending,
      'ongoing': t.dashboard.admin.activityStatus.ongoing
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.dashboard.admin.title}</h1>
            <p className="text-gray-600">{t.dashboard.admin.subtitle}</p>
          </div>
        </div>

        {/* Total Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Donors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.admin.totalDonors}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboardData?.totalStats?.totalDonors?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardData?.totalStats?.newDonorsThisMonth || 0}</span> {t.dashboard.admin.newDonorsThisMonth}
              </p>
            </CardContent>
          </Card>

          {/* Total Accounts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.admin.totalAccounts}</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{dashboardData?.totalStats?.totalAccounts?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardData?.totalStats?.totalAccounts || 0}</span> {t.dashboard.admin.newAccounts}
              </p>
            </CardContent>
          </Card>

          {/* Available Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.admin.activeEvents}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData?.donationEventStats?.available || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.donationEventStats?.completed || 0} {t.dashboard.admin.completed}
              </p>
            </CardContent>
          </Card>

          {/* Published Blogs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.admin.publishedBlogs}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData?.blogStats?.published || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.blogStats?.draft || 0} {t.dashboard.admin.drafts}
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
                {t.dashboard.admin.recentActivities}
              </CardTitle>
              <CardDescription>
                {t.dashboard.admin.recentActivitiesDescription}
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
                          {getActivityStatusText(activity.status)}
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
                      {t.dashboard.admin.donorStatistics}
                    </CardTitle>
                    <CardDescription>
                      {t.dashboard.admin.donorStatisticsDescription} {getTimeLabel()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant={selectedTimeframe === 'week' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedTimeframe('week')}
                    >
                      {t.dashboard.admin.timeframes.week}
                    </Button>
                    <Button 
                      variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe('month')}
                    >
                      {t.dashboard.admin.timeframes.month}
                    </Button>
                    <Button 
                      variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe('year')}
                    >
                      {t.dashboard.admin.timeframes.year}
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
                        formatter={(value) => [value.toLocaleString(), t.dashboard.admin.chartTooltips.donors]}
                        labelFormatter={(label) => {
                          if (selectedTimeframe === 'week') return `${t.dashboard.admin.chartTooltips.dayLabel}${label}`;
                          if (selectedTimeframe === 'month') return `${t.dashboard.admin.chartTooltips.monthLabel}${label}`;
                          if (selectedTimeframe === 'year') return `${t.dashboard.admin.chartTooltips.yearLabel}${label}`;
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
                  {t.dashboard.admin.bloodStockChart}
                </CardTitle>
                <CardDescription>
                  {t.dashboard.admin.bloodStockDescription}
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
                      <Bar dataKey="wholeBlood" stackId="a" fill="#dc2626" name={t.dashboard.admin.bloodComponents.wholeBlood} />
                      <Bar dataKey="redCells" stackId="a" fill="#ea580c" name={t.dashboard.admin.bloodComponents.redCells} />
                      <Bar dataKey="plasma" stackId="a" fill="#ca8a04" name={t.dashboard.admin.bloodComponents.plasma} />
                      <Bar dataKey="platelets" stackId="a" fill="#16a34a" name={t.dashboard.admin.bloodComponents.platelets} />
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
              {t.dashboard.admin.adminActions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="text-sm">{t.dashboard.admin.quickActions.manageUsers}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Calendar className="h-6 w-6 text-green-500" />
                <span className="text-sm">{t.dashboard.admin.quickActions.manageEvents}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <FileText className="h-6 w-6 text-orange-500" />
                <span className="text-sm">{t.dashboard.admin.quickActions.manageBlogs}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Droplet className="h-6 w-6 text-red-500" />
                <span className="text-sm">{t.dashboard.admin.quickActions.manageBloodStock}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <HeartHandshake className="h-6 w-6 text-purple-500" />
                <span className="text-sm">{t.dashboard.admin.quickActions.systemReports}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}