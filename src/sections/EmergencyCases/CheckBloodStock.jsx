'use client';
import { useEffect } from 'react';
import { useBloodRequests } from "@/context/bloodRequest_context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, CircleAlert } from "lucide-react";
import Link from "next/link";

// Helper function to get the nearest expiry date
function getNearestExpiryDate(stocks) {
    if (!stocks || stocks.length === 0) return null;
    return stocks.reduce((earliest, stock) => {
        const date = new Date(stock.expiryDate);
        return !earliest || date < earliest ? date : earliest;
    }, null);
}

export default function CheckBloodStock() {
    const { bloodRequest, isLoading, id, findRequiredBlood, requiredBlood } = useBloodRequests();

    useEffect(() => {
        if (bloodRequest) findRequiredBlood();
    }, [bloodRequest]);

    // Check availability and render each component's status
    function checkingAvailability(requiredBlood, bloodRequest) {
        if (!requiredBlood || !bloodRequest) return null;

        const rows = bloodRequest.componentRequests.map(request => {
            const matchingStocks = requiredBlood.filter(
                stock =>
                    stock.componentType === request.componentType &&
                    stock.bloodType === bloodRequest.bloodType
            );

            const totalVolume = matchingStocks.reduce((sum, stock) => sum + stock.volume, 0);
            const nearestExpiry = getNearestExpiryDate(matchingStocks);
            const isEnough = totalVolume >= request.volume;

            return {
                componentType: request.componentType,
                requiredVolume: request.volume,
                totalAvailableVolume: totalVolume,
                nearestExpiry,
                isEnough,
            };
        });

        const allAvailable = rows.every(row => row.isEnough);

        return (
            <div className="flex flex-col items-center space-y-3">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full ${allAvailable ? 'bg-[#4caf50]' : 'bg-[#FF5722]'}`}>
                    {allAvailable ? (
                        <CheckIcon className="text-white w-8 h-8" />
                    ) : (
                        <CircleAlert className="text-white w-8 h-8" />
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <span className={`font-semibold ${allAvailable ? 'text-[#4CAF50]' : 'text-[#FF5722]'}`}>
                        {allAvailable ? "Tất cả thành phần máu đều có sẵn" : "Thiếu thành phần máu"}
                    </span>
                    <span className="text-[#757575] text-[13px]">
                        Nhóm máu {bloodRequest.bloodType} đang kiểm tra
                    </span>
                </div>

                <div className="w-full space-y-4">
                    {rows.map((row, index) => (
                        <div key={index} className={`rounded-xl p-4 ${row.isEnough ? 'bg-[#E8F5E8]' : 'bg-[#FFEBEE]'} shadow`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-[15px]">{row.componentType}</span>
                                <span className={`font-semibold ${row.isEnough ? 'text-[#4CAF50]' : 'text-[#FF5722]'}`}>
                                    {row.isEnough ? "Đủ" : "Không đủ"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-[#757575]">
                                <span>Số lượng cần:</span>
                                <span className="text-black font-medium">{row.requiredVolume} đơn vị</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#757575]">
                                <span>Số lượng có sẵn:</span>
                                <span className="text-black font-medium">{row.totalAvailableVolume} đơn vị</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#757575]">
                                <span>Hạn gần nhất:</span>
                                <span className="text-black font-medium">
                                    {row.nearestExpiry ? new Date(row.nearestExpiry).toLocaleDateString("vi-VN") : "Không có"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const infoPoints = [
        "Thời gian kiểm tra có thể dao động từ 3-7 giây tùy thuộc vào tình trạng hệ thống",
        "Kết quả hiển thị tình trạng tồn kho thời gian thực từ ngân hàng máu",
        "Trong trường hợp khẩn cấp, vui lòng liên hệ trực tiếp với bệnh viện",
    ];

    return (
        <div className="flex justify-center mt-5">
            <div className="w-1/2 min-w-[500px] bg-white rounded-[25px] shadow-[0px_4px_24px_#00000014] p-12 flex flex-col items-center space-y-5">
                <h1 className="font-medium text-[#1e1e1e] text-[32px] text-center leading-[38.4px]">
                    Kiểm Tra Tồn Kho Máu
                </h1>

                <p className="text-[#757575] text-base text-center">
                    Hệ thống đang kiểm tra tình trạng tồn kho máu trong ngân hàng máu
                </p>

                <Card className="w-[400px] bg-neutral-100 rounded-2xl border-none">
                    <CardContent className="p-0 relative h-full flex flex-col items-center space-y-5 p-5">
                        <div className="flex">
                            <Badge className="w-12 h-12 bg-[#e83333] rounded-3xl flex items-center justify-center hover:bg-[#e83333]">
                                <span className="font-semibold text-white text-xl leading-[30px]">
                                    {bloodRequest?.bloodType || "?"}
                                </span>
                            </Badge>
                            <div className="ml-4">
                                <h3 className="font-medium text-[#1e1e1e] text-lg">Nhóm Máu Cần Kiểm Tra</h3>
                                <p className="text-[#757575] text-sm">Đang tìm kiếm trong kho</p>
                            </div>
                        </div>

                        {!isLoading && checkingAvailability(requiredBlood, bloodRequest)}

                        {isLoading && (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
                                <p className="text-[#757575] text-sm text-center">Đang kiểm tra tồn kho...</p>
                                <p className="text-[#757575] text-sm text-center">Vui lòng chờ trong giây lát</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="space-x-5">
                    <Button variant="outline" className="h-[47px] rounded-lg font-medium text-base">
                        Quay lại
                    </Button>
                    {isLoading ? (
                        <Button className="h-[47px] bg-[#e83333] opacity-60 rounded-lg text-white text-base" disabled>
                            Đang Kiểm Tra...
                        </Button>
                    ) : (
                        <Link href={`/staffs/emergency-request/${id}/choosing-method`}>
                            <Button className="h-[47px] bg-[#e83333] rounded-lg text-white text-base hover:opacity-80">
                                Tiếp tục
                            </Button>
                        </Link>
                    )}
                </div>

                <Card className="w-full bg-neutral-100 rounded-xl border-none">
                    <CardContent className="p-6 space-y-5">
                        <h3 className="font-medium text-[#1e1e1e] text-lg">Thông Tin Bổ Sung</h3>
                        <ul className="space-y-4">
                            {infoPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <div className="w-1.5 h-1.5 mt-2 bg-[#e83333] rounded-[3px]" />
                                    <span className="ml-4 text-[#757575] text-sm">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
