'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBloodRequests } from "@/context/bloodRequest_context";
import { useEffect } from "react";

export default function TakeBloodFromStock() {
  const router = useRouter();
  const {
    bloodRequest,
    requiredBlood,
    findRequiredBlood,
    isLoading,
  } = useBloodRequests();

  useEffect(() => {
    if (bloodRequest) {
      findRequiredBlood();
    }
  }, [bloodRequest]);

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    router.push('/next-step'); // Replace with your actual next step route
  };

  const renderComponentInfo = () => {
    if (!bloodRequest || !requiredBlood) return null;

    return bloodRequest.componentRequests.map((request, index) => {
      const matchingStocks = requiredBlood.filter(
        stock =>
          stock.componentType === request.componentType &&
          stock.bloodType === bloodRequest.bloodType
      );

      const totalAvailable = matchingStocks.reduce(
        (sum, stock) => sum + stock.volume,
        0
      );

      const isAvailable = totalAvailable >= request.volume;

      return (
        <Card
          key={index}
          className={`border ${isAvailable ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'} mb-4`}
        >
          <CardHeader>
            <CardTitle className="text-lg">
              Thành phần: {request.componentType.replace('_', ' ')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Yêu cầu</p>
              <p className="font-medium">{request.volume} đơn vị</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trong kho</p>
              <p className="font-medium">{totalAvailable} đơn vị</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className={`font-semibold ${isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                {isAvailable ? 'Có thể cung cấp' : 'Không đủ trong kho'}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay Lại
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Xử Lý Yêu Cầu Máu</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Xác Nhận Cung Cấp Máu Từ Kho</h2>

      {renderComponentInfo()}

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

      {bloodRequest && requiredBlood && bloodRequest.componentRequests.every(req => {
        const matched = requiredBlood.filter(s =>
          s.componentType === req.componentType &&
          s.bloodType === bloodRequest.bloodType
        );
        const total = matched.reduce((acc, s) => acc + s.volume, 0);
        return total >= req.volume;
      }) ? (
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-2">Sẵn sàng cung cấp</h3>
                <p className="text-green-700">
                  Kho máu có đủ số lượng để đáp ứng yêu cầu. Máu sẽ được chuẩn bị và vận chuyển ngay lập tức.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-6">
            <div className="flex items-start">
              <XCircle className="h-6 w-6 text-red-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Không đủ trong kho</h3>
                <p className="text-red-700">
                  Một số thành phần máu không đủ để đáp ứng yêu cầu. Vui lòng xem lại hoặc yêu cầu hỗ trợ bổ sung.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="px-8 py-6 text-lg"
        >
          Quay Lại
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading || !bloodRequest || !requiredBlood || !bloodRequest.componentRequests.every(req => {
            const matched = requiredBlood.filter(s =>
              s.componentType === req.componentType &&
              s.bloodType === bloodRequest.bloodType
            );
            const total = matched.reduce((acc, s) => acc + s.volume, 0);
            return total >= req.volume;
          })}
          className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Xác Nhận Cung Cấp
        </Button>
      </div>
    </div>
  );
}
