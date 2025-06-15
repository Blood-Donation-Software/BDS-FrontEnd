import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Droplet, Heart, Zap } from "lucide-react";
import React from "react";

export default function BloodCompatibility() {
  // Blood component data
  const bloodComponents = [
    { id: 1, name: "Whole Blood", icon: <Droplet className="h-6 w-6" /> },
    { id: 2, name: "Red Blood Cells", icon: <Heart className="h-6 w-6" /> },
    { id: 3, name: "Platelets", icon: <Activity className="h-6 w-6" /> },
    { id: 4, name: "Plasma", icon: <Zap className="h-6 w-6" /> },
  ];

  // Blood types data
  const bloodTypes = [
    { id: 1, type: "A+" },
    { id: 2, type: "A-" },
    { id: 3, type: "B+" },
    { id: 4, type: "B-" },
    { id: 5, type: "AB+" },
    { id: 6, type: "AB-" },
    { id: 7, type: "O+" },
    { id: 8, type: "O-" },
  ];

  // Blood component information
  const bloodComponentInfo = [
    {
      id: 1,
      name: "Whole Blood",
      icon: <Droplet className="h-6 w-6" />,
      description:
        "Máu toàn phần chứa tất cả các thành phần của máu, bao gồm hồng cầu, bạch cầu, tiểu cầu và huyết tương.",
    },
    {
      id: 2,
      name: "Red Blood Cells",
      icon: <Heart className="h-6 w-6" />,
      description:
        "Hồng cầu vận chuyển oxy từ phổi đến các mô trong cơ thể. Quan trọng trong điều trị thiếu máu.",
    },
    {
      id: 3,
      name: "Platelets",
      icon: <Activity className="h-6 w-6" />,
      description:
        "Tiểu cầu giúp máu đông lại và ngăn chặn chảy máu. Thường được sử dụng trong điều trị ung thư.",
    },
    {
      id: 4,
      name: "Plasma",
      icon: <Zap className="h-6 w-6" />,
      description:
        "Huyết tương là phần lỏng của máu, chứa các protein và chất dinh dưỡng. Quan trọng trong điều trị bỏng và sốc.",
    },
  ];

  return (
    <div className=" flex flex-row justify-center bg-gray-100 w-full">
      <div className="w-full max-w-[1271px]">
        <div className="relative min-h-[874px] px-9 py-8">
          <header className="flex flex-col items-center mb-16">
            <h1 className="font-bold text-5xl text-slate-800 text-center tracking-[0] leading-[72px] [font-family:'Inter-Bold',Helvetica]">
              Tra cứu tương thích nhóm máu
            </h1>
            <p className="font-normal text-xl text-slate-500 text-center tracking-[0] leading-[30px] mt-4 [font-family:'Inter-Regular',Helvetica]">
              Kiểm tra khả năng tương thích giữa các nhóm máu và thành phần máu
            </p>
          </header>

          <Card className="w-full mb-12 shadow-[0px_4px_24px_#0000000d]">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-semibold text-xl text-slate-800 mb-4 [font-family:'Inter-SemiBold',Helvetica]">
                    1. Chọn thành phần máu
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bloodComponents.slice(0, 2).map((component) => (
                      <Button
                        key={component.id}
                        variant="outline"
                        className="h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium"
                      >
                        {component.name}
                      </Button>
                    ))}
                    {bloodComponents.slice(2, 4).map((component) => (
                      <Button
                        key={component.id}
                        variant="outline"
                        className="h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium"
                      >
                        {component.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-xl text-slate-800 mb-4 [font-family:'Inter-SemiBold',Helvetica]">
                    2. Chọn nhóm máu của bạn
                  </h2>
                  <div className="grid grid-cols-4 gap-4">
                    {bloodTypes.slice(0, 4).map((bloodType) => (
                      <Button
                        key={bloodType.id}
                        variant="outline"
                        className="h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium"
                      >
                        {bloodType.type}
                      </Button>
                    ))}
                    {bloodTypes.slice(4, 8).map((bloodType) => (
                      <Button
                        key={bloodType.id}
                        variant="outline"
                        className="h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium"
                      >
                        {bloodType.type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-[0px_4px_24px_#0000000d]">
              <CardContent className="p-8">
                <h2 className="font-semibold text-2xl text-slate-800 mb-6 [font-family:'Inter-SemiBold',Helvetica]">
                  Thông tin thành phần máu
                </h2>

                {bloodComponentInfo.slice(0, 2).map((info) => (
                  <div key={info.id} className="mb-6 flex">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800 [font-family:'Inter-SemiBold',Helvetica]">
                        {info.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 [font-family:'Inter-Regular',Helvetica] max-w-[446px]">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-[0px_4px_24px_#0000000d]">
              <CardContent className="p-8">
                {bloodComponentInfo.slice(2, 4).map((info) => (
                  <div key={info.id} className="mb-6 flex">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800 [font-family:'Inter-SemiBold',Helvetica]">
                        {info.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 [font-family:'Inter-Regular',Helvetica] max-w-[456px]">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}