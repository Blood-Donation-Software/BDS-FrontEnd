'use client';

import { createRequest, searchPatient } from "@/apis/bloodrequest";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Clock, Hand, Search, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "lodash";

export default function CreateBloodRequest() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [bloodRequest, setBloodRequests] = useState({
    name: "",
    phone: "",
    address: "",
    personalId: "",
    endTime: "",
    createdTime: new Date().toISOString(),
    urgency: "",
    bloodType: "",
    componentRequests: [],
    pregnant: false,
    servedCountry: false,
    disabled: false,
    automation: true 
  });

  const bloodComponents = [
    { id: 1, type: "Whole", value: "WHOLE_BLOOD" },
    { id: 2, type: "Red Blood Cells", value: "RED_BLOOD_CELLS" },
    { id: 3, type: "Plasma", value: "PLASMA" },
    { id: 4, type: "Platelets", value: "PLATELETS" },
  ];

  const bloodTypes = [
    { id: 1, type: "A+", value: "A_POSITIVE" },
    { id: 2, type: "A-", value: "A_NEGATIVE" },
    { id: 3, type: "B+", value: "B_POSITIVE" },
    { id: 4, type: "B-", value: "B_NEGATIVE" },
    { id: 5, type: "AB+", value: "AB_POSITIVE" },
    { id: 6, type: "AB-", value: "AB_NEGATIVE" },
    { id: 7, type: "O+", value: "O_POSITIVE" },
    { id: 8, type: "O-", value: "O_NEGATIVE" },
  ];

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

  const toLocalISOString = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 19);
  };

  const handleDate = (e) => {
    setBloodRequests((prev) => ({
      ...prev,
      endTime: toLocalISOString(e.target.value),
    }));
  };

  const handleProcessingTypeChange = (checked) => {
    setBloodRequests(prev => ({
      ...prev,
      automation: checked ? true : false
    }));
  };

  const handleBloodRequest = (e) => {
    const { name, value } = e.target;
    setBloodRequests((prev) => ({
      ...prev,
      [name]: value,
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

  const handleSpecialCondition = (condition) => {
    setBloodRequests((prev) => ({
      ...prev,
 
        [condition]: !prev[condition]
    }))
  };

  const handleSearch = debounce(async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    // setIsSearching(true);
    // try {
    //   const results = await searchPatient(query);
    //   setSearchResults(results);
    // } catch (error) {
    //   toast.error("Failed to search patients");
    //   console.error(error);
    // } finally {
    //   setIsSearching(false);
    // }
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const fillPatientData = (patient) => {
    setBloodRequests({
      ...bloodRequest,
      name: patient.name || "",
      phone: patient.phone || "",
      address: patient.address || "",
      personalId: patient.personalId || "",
      bloodType: patient.bloodType || "",
      pregnant: patient.pregnant || false,
      servedCountry: patient.servedCountry || false,
      disabled: patient.disabled || false
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest(bloodRequest);
      toast.success("Create Successfully!");
      router.push("/staffs/emergency-request");
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    }
  };
  return (
    <div className="bg-white w-full">
      <CardContent className="p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Processing Type Toggle */}
          {/* <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <Checkbox 
                  id="processingType"
                  checked={bloodRequest.automation}
                  onCheckedChange={handleProcessingTypeChange}
                />
              <Label htmlFor="processingType" className="font-medium flex items-center">
                {bloodRequest.automation ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    Automatic Processing
                  </>
                ) : (
                  <>
                    <Hand className="h-4 w-4 mr-2 text-blue-500" />
                    Manual Processing
                  </>
                )}
              </Label>
            </div>
            <p className="text-sm text-gray-500">
              {bloodRequest.automation 
                ? "System will automatically process this request based on availability"
                : "Request will require manual review and processing"}
            </p>
          </div> */}

          {/* Patient Search */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">Find Existing Patient</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by ID, name or phone..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                  </div>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => fillPatientData(patient)}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">
                        ID: {patient.personalId} | Phone: {patient.phone}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Basic Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              ["name", "Patient Full Name"],
              ["personalId", "Personal ID"],
              ["phone", "Phone Number"],
              ["address", "Patient Address"]
            ].map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="font-semibold text-gray-800 text-sm">{label} *</Label>
                <Input
                  name={field}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                  onChange={handleBloodRequest}
                  value={bloodRequest[field]}
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="font-semibold text-gray-800 text-sm">Required Date *</Label>
              <Input
                id="endTime"
                type="date"
                className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                onChange={handleDate}
              />
            </div>
          </div>

          {/* Special Conditions */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">Special Conditions</Label>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pregnant" 
                  checked={bloodRequest.pregnant}
                  onCheckedChange={() => handleSpecialCondition('pregnant')}
                />
                <Label htmlFor="pregnant" className="font-normal">Pregnant Patient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="servedCountry" 
                  checked={bloodRequest.servedCountry}
                  onCheckedChange={() => handleSpecialCondition('servedCountry')}
                />
                <Label htmlFor="servedCountry" className="font-normal">Served in Military</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="disabled" 
                  checked={bloodRequest.disabled}
                  onCheckedChange={() => handleSpecialCondition('disabled')}
                />
                <Label htmlFor="disabled" className="font-normal">Person with Disability</Label>
              </div>
            </div>
          </div>

          {/* Component Selection with Volumes */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">Blood Components & Volumes *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bloodComponents.map((component) => {
                const existing = bloodRequest.componentRequests.find(c => c.componentType === component.value);
                return (
                  <div key={component.id} className="flex items-center space-x-4 border p-4 rounded-xl">
                    <input
                      type="checkbox"
                      checked={!!existing}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setBloodRequests((prev) => {
                          let updated = [...prev.componentRequests];
                          if (checked) {
                            updated.push({ componentType: component.value, volume: 1 });
                          } else {
                            updated = updated.filter(c => c.componentType !== component.value);
                          }
                          return { ...prev, componentRequests: updated };
                        });
                      }}
                    />
                    <span className="flex-1 font-medium">{component.type}</span>
                    {existing && (
                      <Input
                        type="number"
                        min="1"
                        value={existing.volume}
                        className="w-24"
                        onChange={(e) => {
                          const volume = Number(e.target.value);
                          setBloodRequests((prev) => {
                            const updated = prev.componentRequests.map((c) =>
                              c.componentType === component.value ? { ...c, volume } : c
                            );
                            return { ...prev, componentRequests: updated };
                          });
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blood Type */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">Blood Type Required *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bloodTypes.map((bloodType) => (
                <Button
                  key={bloodType.id}
                  variant={bloodType.value === bloodRequest.bloodType ? "onchosen" : "onchoosing"}
                  type="button"
                  onClick={() => handleBloodType(bloodType.value)}
                  className="h-16 rounded-xl border-2 font-semibold text-gray-700 text-lg"
                >
                  {bloodType.type}
                </Button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">Urgency Level *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgencyLevels.map((urgency) => (
                <div
                  key={urgency.id}
                  className={`${urgency.value === bloodRequest.urgency ? urgency.chosenColor : urgency.bgColor}
                    flex flex-col items-center justify-center h-[84px] 
                    rounded-xl border-2 ${urgency.borderColor} ${urgency.hoverColor}`}
                  onClick={() => handleUrgency(urgency.value)}
                >
                  <div className="flex items-center">
                    <span className={urgency.textColor}>{urgency.icon}</span>
                    <span className={`ml-2 font-semibold ${urgency.textColor} text-base`}>{urgency.level}</span>
                  </div>
                  <p className={`font-semibold ${urgency.textColor} text-sm mt-1`}>{urgency.timeframe}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {[
            ["medicalCondition", "Medical Condition *"],
            ["additionalNotes", "Additional Notes"]
          ].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="font-semibold text-gray-800 text-sm">{label}</Label>
              <Textarea
                id={field}
                className="min-h-[100px] bg-neutral-50 rounded-xl border-2 border-gray-100"
              />
            </div>
          ))}

          {/* Submit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <Button type="button" variant="outline" className="h-[60px] rounded-xl border-2 font-semibold text-gray-500">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-[60px] rounded-xl font-semibold bg-gradient-to-r from-red-600 to-red-600 shadow-lg"
            >
              {bloodRequest.automation ? "Submit & Auto-Process" : "Submit for Manual Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
}