'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TakeBloodFromStock() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    // Handle confirmation logic here
    router.push('/next-step'); // Replace with your actual next step route
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Xác Nhận Cung Cấp Máu Từ Kho</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Thông Tin Cung Cấp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nhóm máu</p>
              <p className="font-medium">A+</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng trong kho</p>
              <p className="font-medium">12 đơn vị</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số đơn vị cung cấp</p>
              <p className="font-medium">3 đơn vị</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thời gian dự kiến</p>
              <p className="font-medium">15-30 phút</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

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
          className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700"
        >
          Xác Nhận Cung Cấp
        </Button>
      </div>
    </div>
  );
}