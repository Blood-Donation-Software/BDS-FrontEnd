'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/language_context';
import { 
  getStaffDashboardData, 
  getDonationEventChartData 
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
  BarChart3
} from 'lucide-react';
import { endpoint } from '@/utils/axios';

export default function DashboardForStaff() {
  const { t } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch chart data when timeframe changes
  useEffect(() => {
    if (dashboardData) {
      fetchChartData();
    }
  }, [selectedTimeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getStaffDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(t.dashboardStaff.error);
      console.error('Error fetching dashboard data:', err);
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
          <p className="mt-4 text-gray-600">{t.dashboardStaff.loading}</p>
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
          <Button onClick={fetchDashboardData}>{t.dashboardStaff.retry}</Button>
        </div>
      </div>
    );
  }

  // Helper functions
  const getEventData = () => {
    return dashboardData?.donationEventChartData || [];
  };

  const getTimeKey = () => {
    switch (selectedTimeframe) {
      case 'week':
        return 'timeKey';
      case 'month':
        return 'timeKey';
      case 'year':
        return 'timeKey';
      default:
        return 'timeKey';
    }
  };

  const getTimeLabel = () => {
    switch (selectedTimeframe) {
      case 'week':
        return t.dashboardStaff.timeframes.dayInWeek;
      case 'month':
        return t.dashboardStaff.timeframes.monthInYear;
      case 'year':
        return t.dashboardStaff.timeframes.years;
      default:
        return t.dashboardStaff.timeframes.day;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.dashboardStaff.title}</h1>
            <p className="text-gray-600">{t.dashboardStaff.subtitle}</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Blood Requests Unfinished */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboardStaff.stats.unfinishedRequests}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{dashboardData?.bloodRequestStats?.unfinished || 0}</div>
              <p className="text-xs text-muted-foreground">
                {t.dashboardStaff.stats.needUrgentProcessing}
              </p>
            </CardContent>
          </Card>

          {/* Blood Requests Fulfilled */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboardStaff.stats.fulfilledRequests}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData?.bloodRequestStats?.fulfilled || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">
                </span> {t.dashboardStaff.stats.completed}
              </p>
            </CardContent>
          </Card>

          {/* Blogs Published */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboardStaff.stats.publishedBlogs}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboardData?.blogStats?.published || 0}</div>
              <p className="text-xs text-muted-foreground">
                {t.dashboardStaff.stats.active}
              </p>
            </CardContent>
          </Card>

          {/* Blogs Waiting */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboardStaff.stats.totalDonationEvents}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData?.donationEventStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{dashboardData?.donationEventStats?.completed || 0}</span> {t.dashboardStaff.stats.completedEvents}, 
                <span className="text-orange-600 ml-1">{dashboardData?.donationEventStats?.available || 0}</span> {t.dashboardStaff.stats.activeEvents}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Events Chart */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    {t.dashboardStaff.charts.totalDonors}
                  </CardTitle>
                  <CardDescription>
                    {t.dashboardStaff.charts.totalDonorsDescription} {getTimeLabel()}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant={selectedTimeframe === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTimeframe('week')}
                  >
                    {t.dashboardStaff.timeframes.week}
                  </Button>
                  <Button 
                    variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe('month')}
                  >
                    {t.dashboardStaff.timeframes.month}
                  </Button>
                  <Button 
                    variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe('year')}
                  >
                    {t.dashboardStaff.timeframes.year}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getEventData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getTimeKey()} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value.toLocaleString(), t.dashboardStaff.chartTooltips.donors]}
                      labelFormatter={(label) => {
                        const timeKeyValue = getTimeKey();
                        if (selectedTimeframe === 'week') return `${t.dashboardStaff.chartTooltips.dayLabel}${label}`;
                        if (selectedTimeframe === 'month') return `${t.dashboardStaff.chartTooltips.monthLabel}${label}`;
                        if (selectedTimeframe === 'year') return `${t.dashboardStaff.chartTooltips.yearLabel}${label}`;
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
                {t.dashboardStaff.charts.bloodStock}
              </CardTitle>
              <CardDescription>
                {t.dashboardStaff.charts.bloodStockDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ dashboardData?.bloodStock || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bloodType" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="wholeBlood" stackId="a" fill="#dc2626" name={t.dashboardStaff.bloodComponents.wholeBlood} />
                    <Bar dataKey="redCells" stackId="a" fill="#ea580c" name={t.dashboardStaff.bloodComponents.redCells} />
                    <Bar dataKey="plasma" stackId="a" fill="#ca8a04" name={t.dashboardStaff.bloodComponents.plasma} />
                    <Bar dataKey="platelets" stackId="a" fill="#16a34a" name={t.dashboardStaff.bloodComponents.platelets} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              {t.dashboardStaff.quickActions.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Clock className="h-6 w-6 text-red-500" />
                <span className="text-sm">{t.dashboardStaff.quickActions.processRequests}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <FileText className="h-6 w-6 text-blue-500" />
                <span className="text-sm">{t.dashboardStaff.quickActions.createBlog}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Calendar className="h-6 w-6 text-green-500" />
                <span className="text-sm">{t.dashboardStaff.quickActions.createEvent}</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Droplet className="h-6 w-6 text-purple-500" />
                <span className="text-sm">{t.dashboardStaff.quickActions.updateStock}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}