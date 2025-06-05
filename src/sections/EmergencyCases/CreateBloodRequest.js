'use client'

import { createRequest } from "@/apis/bloodrequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CreateBloodRequest() {
    const router = useRouter();
    const [bloodRequest, setBloodRequests] = useState({
        name: "",
        phone: "",
        address: "",
        personalId: "",
        componentType: "",
        volume: 0,
        endTime: "",
        urgency: "",
        bloodType: "",
    });
    const bloodComponents = [
        { id: 1, type: "Whole", value: "WHOLE_BLOOD"},
        { id: 2, type: "Red Blood Cells", value: "RED_BLOOD_CELLS"},
        { id: 3, type: "Plasma", value: "PLASMA"},
        { id: 4, type: "Platelets", value: "PLATELETS" },
    ];

    const toLocalISOString = (date) => {
        const d = new Date(date); // Convert string to Date
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 19);
        return localISOTime; // Already in "yyyy-MM-ddTHH:mm:ss" format
    };

    const handleDate = (e) => {
        setBloodRequests((prev) => ({
            ...prev,
            endTime: toLocalISOString(e.target.value),
        }));
    };

    const handleBloodRequest = (e) => {
        const { name, value } = e.target;
        setBloodRequests((prev) => ({
            ...prev,
            [name]: name === "volume" ? Number(value) : value,
        }));
    };
    const handleComponentType = (value) => {
        setBloodRequests((prev) => ({
            ...prev,
            componentType: value,
        }));
    };

    const handleBloodType = (value) => {
        setBloodRequests((prev) => ({
            ...prev,
            bloodType: value,
        }));
    };

    const handleUrgency = (value) => {
        setBloodRequests((prev) => ({
            ...prev,
            urgency: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createRequest(bloodRequest);
        } catch(error) {
            console.log(error);
            return;
        }
        toast.success("Create Sucessfully!");
        router.push("/staffs/emergency-request");
    }
  // Blood type options for selection
  const bloodTypes = [
    { id: 1, type: "A+", value: "A_POSITIVE"},
    { id: 2, type: "A-", value: "A_NEGATIVE"},
    { id: 3, type: "B+", value: "B_POSITIVE"},
    { id: 4, type: "B-", value: "B_NEGATIVE"},
    { id: 5, type: "AB+", value: "AB_POSITIVE"},
    { id: 6, type: "AB-", value: "AB_NEGATIVE"},
    { id: 7, type: "O+", value: "O_POSITIVE"},
    { id: 8, type: "O-", value: "O_NEGATIVE"},
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
      hoverColor: "hover:bg-red-100",
      chosenColor: "bg-red-300",
      value: "HIGH",
    },
    {
      id: 2,
      level: "Urgent",
      timeframe: "Within 24 hours",
      icon: <Clock className="h-5 w-5" />,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-500",
      hoverColor: "hover:bg-amber-100",
      chosenColor: "bg-amber-300",
      value: "MEDIUM"
    },
    {
      id: 3,
      level: "Normal",
      timeframe: "Within 3 days",
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-emerald-500",
      hoverColor: "hover:bg-green-100",
      chosenColor: "bg-green-300",
      value: "LOW"
    },
  ];

  return (
    <div className="bg-white w-full">
        <div className="bg-white w-full ">
            <div className="w-full">
                <div>
                    <div className="absolute bottom-[27px] left-[32px] flex space-x-5">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <div className="w-3 h-3 bg-[#ffffff99] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#ffffff4c] rounded-full"></div>
                    </div>
                </div>

                <CardContent className="p-8">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label
                                htmlFor="name"
                                className="font-semibold text-gray-800 text-sm"
                                >
                                    Patient Full Name *
                                </Label>
                                <Input
                                name="name"
                                placeholder="Enter patient full name"
                                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                                onChange={handleBloodRequest}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                htmlFor="personalId"
                                className="font-semibold text-gray-800 text-sm"
                                >
                                    Personal ID *
                                </Label>
                                <Input
                                name="personalId"
                                placeholder="Enter personal ID"
                                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                                onChange={handleBloodRequest}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                htmlFor="phone"
                                className="font-semibold text-gray-800 text-sm"
                                >
                                    Phone Number *
                                </Label>
                                <Input
                                name="phone"
                                placeholder="Enter phone number"
                                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                                onChange={handleBloodRequest}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                htmlFor="address"
                                className="font-semibold text-gray-800 text-sm"
                                >
                                    Patient Address *
                                </Label>
                                <Input
                                name="address"
                                placeholder="Enter patient address"
                                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                                onChange={handleBloodRequest}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                htmlFor="volume"
                                className="font-semibold text-gray-800 text-sm"
                                >
                                    Units Required *
                                </Label>
                                <Input
                                name="volume"
                                type="number"
                                placeholder="Number of units"
                                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                                onChange={handleBloodRequest}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                htmlFor="endTime"
                                className="font-semibold text-gray-800 text-sm"
                                >
                                    Required Date *
                                </Label>
                                <Input
                                id="endTime"
                                type="date"
                                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                                onChange={handleDate}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold text-gray-800 text-sm">
                                Blood Component Type *
                            </Label>
                        </div>
                        {/* Blood component type selector would go here */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {bloodComponents.map((component) => (
                                <Button
                                    key={component.id}
                                    type="button"
                                    variant={component.value === bloodRequest.componentType ? "onchosen" : "onchoosing"}
                                    onClick={() => handleComponentType(component.value)}
                                    className= "h-16 rounded-xl border-2 font-semibold text-gray-700 text-sm"
                                >
                                    {component.type}
                                </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="font-semibold text-gray-800 text-sm">
                                Blood Type Required *
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {bloodTypes.map((bloodType) => (
                                <Button
                                    key={bloodType.id}
                                    variant={bloodType.value === bloodRequest.bloodType ?  "onchosen" : "onchoosing"}
                                    type="button"
                                    onClick={() => handleBloodType(bloodType.value)}
                                    className="h-16 rounded-xl border-2 font-semibold text-gray-700 text-lg"
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
                                className={`${urgency.value === bloodRequest.urgency ? urgency.chosenColor : urgency.bgColor}
                                flex flex-col items-center justify-center h-[84px] 
                                rounded-xl border-2 ${urgency.borderColor} ${urgency.hoverColor} `}
                                onClick={() => handleUrgency(urgency.value)}
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
            </div>
        </div>
    </div>
  );
}
