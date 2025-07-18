"use client"

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Droplet, Heart, Table, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function BloodLookUp() {
  const [selectedComponent, setSelectedComponent] = useState()
  const [selectedType, setselectedType] = useState()
  const [active, setActive] = useState(false)
  const [tab, setTab] = useState('donate'); // 'donate' hoặc 'receive'
  // Blood component data
  const bloodComponents = [
    { id: 1, name: "Whole Blood", icon: <Droplet className="h-6 w-6" /> },
    { id: 2, name: "Red Blood Cells", icon: <Heart className="h-6 w-6" /> },
    { id: 3, name: "Platelets", icon: <Activity className="h-6 w-6" /> },
    { id: 4, name: "Plasma", icon: <Zap className="h-6 w-6" /> },
  ];

  // Blood types data
  const bloodTypes = [
    {
      id: 1,
      type: "A+",
      canReceiveFrom: ["A+", "A-", "O+", "O-"],
      canDonateTo: ["A+", "AB+"],
    },
    {
      id: 2,
      type: "A-",
      canReceiveFrom: ["A-", "O-"],
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
    },
    {
      id: 3,
      type: "B+",
      canReceiveFrom: ["B+", "B-", "O+", "O-"],
      canDonateTo: ["B+", "AB+"],
    },
    {
      id: 4,
      type: "B-",
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
      canReceiveFrom: ["B-", "O-"]
    },
    {
      id: 5,
      type: "AB+",
      canDonateTo: ["AB+"],
      canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    {
      id: 6,
      type: "AB-",
      canDonateTo: ["AB+", "AB-"],
      canReceiveFrom: ["A-", "B-", "AB-", "O-"]
    },
    {
      id: 7,
      type: "O+",
      canDonateTo: ["A+", "B+", "AB+", "O+"],
      canReceiveFrom: ["O+", "O-"]
    },
    {
      id: 8,
      type: "O-",
      canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      canReceiveFrom: ["O-"]
    },
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

  const handleComponent = (component) => {
    if (selectedComponent && component.id === selectedComponent.id) {
      setSelectedComponent(null);
    }
    else {
      setSelectedComponent(component);
    }
    console.log(component.id)
    console.log(selectedComponent)
  }

  const handleType = (type) => {
    if (selectedType && type.id === selectedType.id) {
      setselectedType(null);
    }
    else {
      setselectedType(type);
    }

  }

  useEffect(() => {
    if (selectedType && selectedComponent) {
      setActive(true);
    } else {
      setActive(false);
    }

  }, [selectedComponent, selectedType])

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
                        onClick={() => handleComponent(component)}
                        variant="outline"
                        className={`h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium 
                          ${selectedComponent && selectedComponent.id === component.id ? "bg-red-500 text-white border-0" : "text-gray-700"}`}
                      >
                        {component.name}
                      </Button>
                    ))}
                    {bloodComponents.slice(2, 4).map((component) => (
                      <Button
                        key={component.id}
                        variant="outline"
                        onClick={() => handleComponent(component)}
                        className={`h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium 
                          ${selectedComponent && selectedComponent.id === component.id ? "bg-red-500 text-white border-0" : "text-gray-700"}`}
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
                        onClick={() => handleType(bloodType)}
                        className={`h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium
                          ${selectedType && selectedType.id === bloodType.id ? "bg-red-500 text-white border-0" : "text-gray-700"}`}
                      >
                        {bloodType.type}
                      </Button>
                    ))}
                    {bloodTypes.slice(4, 8).map((bloodType) => (
                      <Button
                        key={bloodType.id}
                        variant="outline"
                        onClick={() => handleType(bloodType)}
                        className={`h-[58px] justify-center items-center rounded-xl border border-slate-200 shadow-[0px_2px_8px_#0000000d] [font-family:'Inter-Medium',Helvetica] font-medium
                          ${selectedType && selectedType.id === bloodType.id ? "bg-red-500 text-white border-0" : "text-gray-700"}`}
                      >
                        {bloodType.type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/*Selected two*/}
          {active ? (
            <Card className="w-full mb-12 shadow-[0px_4px_24px_#0000000d]">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  <button
                    className={`flex-1 py-3 rounded-l-xl font-semibold text-lg transition-all ${tab === 'donate'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                      }`}
                    onClick={() => setTab('donate')}
                  >
                    Có thể hiến cho
                  </button>
                  <button
                    className={`flex-1 py-3 rounded-r-xl font-semibold text-lg transition-all ${tab === 'receive'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                      }`}
                    onClick={() => setTab('receive')}
                  >
                    Có thể nhận từ
                  </button>
                </div>
                <div className="flex flex-wrap gap-6 justify-center min-h-[120px]">
                  {selectedType ? (
                    (tab === 'donate'
                      ? selectedType.canDonateTo
                      : selectedType.canReceiveFrom
                    ).map((type) => (
                      <div
                        key={type}
                        className="bg-white rounded-xl shadow-md px-10 py-6 flex flex-col items-center min-w-[120px] border border-red-100"
                      >
                        <span className="text-3xl font-bold text-red-500 mb-2">{type}</span>
                        <span className="text-gray-500 font-medium">Tương thích</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400 text-lg py-8">Vui lòng chọn nhóm máu để xem kết quả</span>
                  )}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Thông tin quan trọng:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• O- là nhóm máu cho (có thể hiến cho tất cả các nhóm máu)</li>
                    <li>• AB+ là nhóm máu nhận (có thể nhận từ tất cả các nhóm máu)</li>
                    <li>• Rh âm có thể hiến cho Rh dương, nhưng ngược lại thì không</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <span></span>
          )}

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