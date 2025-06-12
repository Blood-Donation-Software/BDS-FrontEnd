import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Clock, Heart } from "lucide-react";
import React from "react";

export default function RequestForm() {
  // Blood type options for selection
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

  // Urgency level options
  const urgencyLevels = [
    {
      id: 1,
      level: "Critical",
      timeframe: "Within 2 hours",
      icon: <AlertTriangle className="h-5 w-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
    },
    {
      id: 2,
      level: "Urgent",
      timeframe: "Within 24 hours",
      icon: <Clock className="h-5 w-5" />,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-500",
    },
    {
      id: 3,
      level: "Normal",
      timeframe: "Within 3 days",
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-emerald-500",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1271px]">
        <div className="relative w-full max-w-[1254px] mx-auto">
          <Card className="w-full max-w-[1120px] mx-auto mt-8 rounded-3xl border border-solid border-[#e834341a] shadow-[0px_20px_60px_#e8343414]">
            <div className="w-full h-[204px] bg-gradient-to-r from-red-600 to-red-600 rounded-t-3xl relative">
              <div className="absolute w-16 h-16 top-[52px] left-[32px] bg-[#ffffff33] rounded-2xl backdrop-blur-sm">
                <Heart className="w-8 h-8 absolute top-4 left-4 text-white" />
              </div>

              <div className="absolute top-[52px] left-[112px]">
                <h1 className="font-bold text-white text-3xl leading-9">
                  Emergency Blood Request
                </h1>
                <p className="font-normal text-[#ffffffe6] text-lg leading-7 mt-2">
                  Help save a life by providing accurate information
                </p>
              </div>

              <div className="absolute bottom-[27px] left-[32px] flex space-x-5">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-[#ffffff99] rounded-full"></div>
                <div className="w-3 h-3 bg-[#ffffff4c] rounded-full"></div>
              </div>
            </div>

            <CardContent className="p-8">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label
                      htmlFor="patientName"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Patient Full Name *
                    </Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient full name"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactEmail"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Contact Email *
                    </Label>
                    <Input
                      id="contactEmail"
                      placeholder="Enter contact email"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter phone number"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="hospitalName"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Hospital Name *
                    </Label>
                    <Input
                      id="hospitalName"
                      placeholder="Enter hospital name"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="doctorName"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Attending Doctor *
                    </Label>
                    <Input
                      id="doctorName"
                      placeholder="Enter doctor name"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="patientAge"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Patient Age *
                    </Label>
                    <Input
                      id="patientAge"
                      placeholder="Enter age"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-gray-800 text-sm">
                    Blood Component Type *
                  </Label>
                  {/* Blood component type selector would go here */}
                </div>

                <div className="space-y-4">
                  <Label className="font-semibold text-gray-800 text-sm">
                    Blood Type Required *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {bloodTypes.map((bloodType) => (
                      <Button
                        key={bloodType.id}
                        variant="outline"
                        type="button"
                        className="h-16 bg-gray-50 rounded-xl border-2 font-semibold text-gray-700 text-lg"
                      >
                        {bloodType.type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-semibold text-gray-800 text-sm">
                    Urgency Level *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {urgencyLevels.map((urgency) => (
                      <div
                        key={urgency.id}
                        className={`flex flex-col items-center justify-center h-[84px] ${urgency.bgColor} rounded-xl border-2 ${urgency.borderColor}`}
                      >
                        <div className="flex items-center">
                          <span className={urgency.textColor}>
                            {urgency.icon}
                          </span>
                          <span
                            className={`ml-2 font-semibold ${urgency.textColor} text-base`}
                          >
                            {urgency.level}
                          </span>
                        </div>
                        <p
                          className={`font-semibold ${urgency.textColor} text-sm mt-1`}
                        >
                          {urgency.timeframe}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label
                      htmlFor="unitsRequired"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Units Required *
                    </Label>
                    <Input
                      id="unitsRequired"
                      placeholder="Number of units"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="requiredDate"
                      className="font-semibold text-gray-800 text-sm"
                    >
                      Required Date *
                    </Label>
                    <Input
                      id="requiredDate"
                      type="date"
                      className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="medicalCondition"
                    className="font-semibold text-gray-800 text-sm"
                  >
                    Medical Condition *
                  </Label>
                  <Textarea
                    id="medicalCondition"
                    className="min-h-[100px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="additionalNotes"
                    className="font-semibold text-gray-800 text-sm"
                  >
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    className="min-h-[100px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[60px] rounded-xl border-2 font-semibold text-gray-500"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="h-[60px] rounded-xl font-semibold bg-gradient-to-r from-red-600 to-red-600 shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]"
                  >
                    Submit Blood Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
