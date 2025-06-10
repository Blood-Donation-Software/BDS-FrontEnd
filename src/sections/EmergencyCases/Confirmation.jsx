'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  CheckCircle, Clock, AlertTriangle, HeartPulse, User, Phone, Home,
  Droplet, Calendar, ClipboardList, ChevronLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBloodRequests } from "@/context/bloodRequest_context";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BloodRequestConfirmation() {
  const router = useRouter();
  const { bloodRequest, isLoading, id } = useBloodRequests();

  useEffect(() => {
    // Optional: Add side effects if needed
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatBloodType = (type) => {
    if (!type) return "Not specified";
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatComponentType = (type) => {
    if (!type) return "Not specified";
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getUrgencyDetails = (urgency) => {
    switch (urgency) {
      case 'HIGH':
        return {
          level: 'Critical',
          icon: <AlertTriangle className="h-5 w-5" />,
          color: 'bg-red-500/10 text-red-600'
        };
      case 'MEDIUM':
        return {
          level: 'Urgent',
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-amber-500/10 text-amber-600'
        };
      case 'LOW':
        return {
          level: 'Normal',
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'bg-green-500/10 text-green-600'
        };
      default:
        return {
          level: 'Not specified',
          icon: null,
          color: 'bg-gray-500/10 text-gray-600'
        };
    }
  };

  const urgencyDetails = getUrgencyDetails(bloodRequest?.urgency);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-0"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </Button>


        {/* Summary Card */}
        <Card className="border-0 shadow-sm">
            {/* Header */}
            <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-2">
                <HeartPulse className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Request Confirmation</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
                Review the details below and confirm the blood request information
            </p>
            </div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <HeartPulse className="h-5 w-5 text-red-600" />
              </div>
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Info */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                    <p className="text-gray-900 font-medium">{bloodRequest?.name}</p>
                    <p className="text-sm text-gray-500">ID: {bloodRequest?.personalId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="text-gray-900 font-medium">{bloodRequest?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Home className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                    <p className="text-gray-900 font-medium">{bloodRequest?.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {urgencyDetails.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Priority Level</h3>
                    <Badge className={`${urgencyDetails.color} rounded-md px-3 py-1 text-sm font-medium`}>
                      {urgencyDetails.level}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Blood Info */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Droplet className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
                    <p className="text-gray-900 font-medium">
                      {formatBloodType(bloodRequest?.bloodType)}
                    </p>
                  </div>
                </div>

                {/* Components Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Required Components
                  </h3>
                  <div className="space-y-3">
                    {bloodRequest?.componentRequests?.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">
                          {formatComponentType(component.componentType)}
                        </span>
                        <Badge variant="outline" className="bg-white">
                          {component.volume} unit(s)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Required By</h3>
                    <p className="text-gray-900 font-medium">
                      {new Date(bloodRequest?.endTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => router.back()}
              >
                Cancel Request
              </Button>
              <Button
                className="flex-1 h-12 bg-red-600 hover:bg-red-700"
                onClick={() => router.push(`/staffs/emergency-request/${id}/stock-checking`)}
              >
                Confirm and Proceed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}