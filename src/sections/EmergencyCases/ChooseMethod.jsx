'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBloodRequests } from "@/context/bloodRequest_context";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChooseMethodProcess() {
    const router = useRouter();
    const { id } = useBloodRequests();    
    const handleBack = () => {
        router.back();
    };


    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Xử Lý Yêu Cầu Máu</h1>
        <p className="text-gray-600 mb-8">Chọn Phương Thức Cung Cấp Máu</p>
            <div className="flex flex-col">
                <div className="space-y-6">
                    {/* Option 1: Use blood from stock */}
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                    onClick={() => router.push(`/staffs/emergency-request/${id}/stock-confirmation`)}
                    >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        Sử Dụng Máu Từ Kho
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                        Lấy máu trực tiếp từ kho máu hiện có. Phương thức nhanh chóng và hiệu quả.
                        </p>
                        <div className="mt-4 flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-500">Có sẵn sản phẩm</span>
                        </div>
                    </CardContent>
                    </Card>

                    <div className="relative flex items-center justify-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">hoặc</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Option 2: Contact donors */}
                    <Card className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/staffs/emergency-request/${id}/view-donors`)}
                    >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        Liên Hệ Người Hiến Máu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                        Liên hệ với những người hiến máu sẵn sàng để thu nhận máu tươi.
                        </p>
                        <div className="flex items-center bg-blue-50 px-4 py-3 rounded-lg">
                        <span className="font-medium text-blue-700">Có 3 người hiến sẵn sàng</span>
                        </div>
                    </CardContent>
                    </Card>
                </div>

                <div className="mt-10 flex justify-center">
                    <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="px-8 py-6 text-lg"
                    >
                    Quay Lại
                    </Button>
                </div>
            </div>
        </div>
    );
}