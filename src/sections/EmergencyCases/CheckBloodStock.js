'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBloodRequests } from "@/context/bloodRequest_context";
import { CheckIcon, CircleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CheckBloodStock() {
    const { bloodRequest, isLoading, id } = useBloodRequests();
    
    const checkingAvailability = (status) => {
        if (status === true) return(
            <div className="flex items-center flex-col space-y-3">
                <div className="w-16 h-16 flex items-center justify-center bg-[#4caf50] rounded-full">
                    <CheckIcon className="rounded-full text-white border-white border-s-white border-2 w-8 h-8 p-1 font-extrabold"></CheckIcon>
                </div>
                <div className="flex flex-col items-center screen-y-2">
                    <span className="font-semibold text-[#4CAF50]">Có sẵn trong kho</span>
                    <span className="font-base text-[#757575] text-[13px]">Máu nhóm A+ hiện có sẵn trong kho máu</span>
                </div>
                <div className="w-75 bg-[#E8F5E8] rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-base text-[#757575] text-[13px]">Số lượng có sẵn:</span>
                        <span className="font-semibold text-[#4CAF50] text-[17px]">12 đơn vị</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-base text-[#757575] text-[13px]">Hạn sử dụng gần nhất:</span>
                        <span className="font-semibold text-[#4CAF50] text-[17px]">15/02/2025</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-base text-[#757575] text-[13px]">Trạng thái:</span>
                        <span className="font-semibold text-[#4CAF50] text-[17px]">Sẵn sàng sử dụng</span>
                    </div>
                </div>
            </div>
        ); else return(
            <div className="flex items-center flex-col space-y-3">
                <div className="w-16 h-16 flex items-center justify-center bg-[#FF5722] rounded-full">
                    <CircleAlert></CircleAlert>
                </div>
                <div className="flex flex-col items-center screen-y-2">
                    <span className="font-semibold text-[#FF5722]">Không có sẵn</span>
                    <span className="font-base text-[#757575] text-[13px]">Máu nhóm A+ hiện không có đủ trong kho</span>
                </div>
                <div className="w-75 bg-[#FFEBEE] rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-base text-[#757575] text-[13px]">Số lượng có sẵn:</span>
                        <span className="font-semibold text-[#FF5722] text-[17px]">0 đơn vị</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-base text-[#757575] text-[13px]">Trạng thái:</span>
                        <span className="font-semibold text-[#FF5722] text-[17px]">Cần bổ sung</span>
                    </div>
                </div>
            </div>
        );
    }
    const bloodInfo = {
        type: "A+",
        status: "Có Sẵn Trong Kho",
        statusColor: "#4caf50",
        searchStatus: "Đang tìm kiếm trong kho",
        availability: {
        quantity: "12 đơn vị",
        expiryDate: "15/02/2025",
        status: "Sẵn sàng sử dụng",
        },
    };
  // Information bullet points
    const infoPoints = [
        "Thời gian kiểm tra có thể dao động từ 3-7 giây tùy thuộc vào tình trạng hệ thống",
        "Kết quả hiển thị tình trạng tồn kho thời gian thực từ ngân hàng máu",
        "Trong trường hợp khẩn cấp, vui lòng liên hệ trực tiếp với bệnh viện",
    ];
    return (
        <div className="flex justify-center mt-5">
            <div className="w-1/2 min-w-[500px] bg-white rounded-[25px] shadow-[0px_4px_24px_#00000014] p-12 flex flex-col items-center space-y-5">
                    
                <h1 className="font-medium text-[#1e1e1e] text-[32px] text-center leading-[38.4px] [font-family:'Roboto-Medium',Helvetica]">
                Kiểm Tra Tồn Kho Máu
                </h1>

                <p className="font-normal text-[#757575] text-base text-center leading-[22.4px] [font-family:'Roboto-Regular',Helvetica]">
                Hệ thống đang kiểm tra tình trạng tồn kho máu trong ngân hàng máu
                </p>
                <Card className="w-[400px] bg-neutral-100 rounded-2xl border-none">
                <CardContent className="p-0 relative h-full flex flex-col items-center space-y-5">
                    <div className="flex">
                    <Badge className="w-12 h-12 bg-[#e83333] rounded-3xl flex items-center justify-center hover:bg-[#e83333]">
                        <span className="font-semibold text-white text-xl leading-[30px] [font-family:'Roboto-SemiBold',Helvetica]">
                        A+
                        </span>
                    </Badge>
                    <div className="ml-4">
                        <h3 className="font-medium text-[#1e1e1e] text-lg leading-[27px] [font-family:'Roboto-Medium',Helvetica]">
                        Nhóm Máu Cần Kiểm Tra
                        </h3>
                        <p className="font-normal text-[#757575] text-sm leading-[21px] [font-family:'Roboto-Regular',Helvetica]">
                        Đang tìm kiếm trong kho
                        </p>
                    </div>
                    </div>
                    {!isLoading && checkingAvailability(false)}
                    {isLoading && (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 " />

                            <p className="font-normal text-[#757575] text-sm text-center leading-[21px] [font-family:'Roboto-Regular',Helvetica]">
                            Đang kiểm tra tồn kho...
                            </p>
                            <p className="font-normal text-[#757575] text-sm text-center leading-[21px] [font-family:'Roboto-Regular',Helvetica]">
                            Vui lòng chờ trong giây lát
                            </p>
                        </>
                    )}
                </CardContent>
                </Card>

                <div className="space-x-5">
                    <Button
                        variant="outline"
                        className="h-[47px] rounded-lg font-medium text-base [font-family:'Roboto-Medium',Helvetica]"
                    >
                        Quay lại
                    </Button>
                    {isLoading && (
                        <Button className="h-[47px] bg-[#e83333] opacity-60 rounded-lg font-medium text-white text-base [font-family:'Roboto-Medium',Helvetica] hover:bg-[#e83333] hover:opacity-70">
                            Đang Kiểm Tra...
                        </Button>
                    )}
                    {!isLoading && (
                        <Link href={`/staffs/emergency-request/${id}/choosing-method`}>
                            <Button className="h-[47px] bg-[#e83333] rounded-lg font-medium text-white 
                            text-base [font-family:'Roboto-Medium',Helvetica] hover:bg-[#e83333] hover:opacity-70">
                                Tiếp tục
                            </Button>
                        </Link>
                    )}
                </div>

                <Card className="w-full bg-neutral-100 rounded-xl border-none">
                <CardContent className="p-6 space-y-5">
                    <h3 className="font-medium text-[#1e1e1e] text-lg leading-[27px] [font-family:'Roboto-Medium',Helvetica]">
                    Thông Tin Bổ Sung
                    </h3>
                    <ul className="space-y-4">
                    {infoPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 mt-2 bg-[#e83333] rounded-[3px]" />
                        <span className="ml-4 font-normal text-[#757575] text-sm leading-[19.6px] [font-family:'Roboto-Regular',Helvetica]">
                            {point}
                        </span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                </Card>
            </div>
        </div>
  );
}
