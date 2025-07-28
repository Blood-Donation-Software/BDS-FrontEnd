'use client';

import { createRequest } from "@/apis/bloodrequest";
import { searchProfiles } from "@/apis/profile";
import { searchProfiles } from "@/apis/profile";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Clock, CalendarIcon, Loader2, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Clock, CalendarIcon, Loader2, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import vietnamProvinces from "@/data/vietnam-provinces.json";
import { convertBloodType } from "@/utils/utils";
import { useLanguage } from "@/context/language_context";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function CreateBloodRequest() {
  const {t} = useLanguage();
  const router = useRouter();

  const [bloodRequest, setBloodRequests] = useState({
    profileId: null,
    selectedProfile: null,
    requiredDate: null,
    urgency: "",
    bloodType: "",
    componentRequests: [],
    medicalConditions: [],
    additionalMedicalInformation: "",
    additionalNotes: ""
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // New profile creation states
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    profileId: null,
    selectedProfile: null,
    requiredDate: null,
    urgency: "",
    bloodType: "",
    componentRequests: [],
    medicalConditions: [],
    additionalMedicalInformation: "",
    additionalNotes: ""
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // New profile creation states
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: "",
    personalId: "",
    personalId: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    ward: "",
    district: "",
    city: "",
    bloodType: "",
    gender: "",
    dateOfBirth: null
  });

  // Location selection state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
    gender: "",
    dateOfBirth: null
  });

  // Location selection state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);

  const bloodComponents = [
    { id: 1, type: t?.blood_components?.whole_blood?.name, value: "WHOLE_BLOOD" },
    { id: 2, type: t?.blood_components?.red_blood_cells?.name, value: "RED_BLOOD_CELLS" },
    { id: 3, type: t?.blood_components?.plasma?.name, value: "PLASMA" },
    { id: 4, type: t?.blood_components?.platelets?.name, value: "PLATELETS" },
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
      level: t?.createBloodRequest?.urgency?.critical,
      timeframe: t?.createBloodRequest?.bloodRequest?.urgency?.timeframes?.critical,
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
      level: t?.createBloodRequest?.urgency?.urgent,
      timeframe: t?.createBloodRequest?.bloodRequest?.urgency?.timeframes?.urgent,
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
      level: t?.createBloodRequest?.urgency?.normal,
      timeframe: t?.createBloodRequest?.bloodRequest?.urgency?.timeframes?.normal,
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-emerald-500",
      hoverColor: "hover:bg-green-100",
      chosenColor: "bg-green-300",
      value: "LOW"
    },
  ];

  const medicalConditions = [
    {
      id: 1,
      condition: t?.createBloodRequest?.medicalConditions?.trauma,
      description: t?.createBloodRequest?.criticalNeeds?.severeInjury,
      urgencyLevel: "HIGH",
      enumValue: "TRAUMA_EMERGENCY_SURGERY"
    },
    {
      id: 2,
      condition: t?.createBloodRequest?.medicalConditions?.severeAnemia,
      description: t?.createBloodRequest?.criticalNeeds?.lowHemoglobin,
      urgencyLevel: "HIGH",
      enumValue: "SEVERE_ANEMIA"
    },
    {
      id: 3,
      condition: t?.createBloodRequest?.medicalConditions?.activeBleeding,
      description: t?.createBloodRequest?.criticalNeeds?.ongoingBloodLoss,
      urgencyLevel: "HIGH",
      enumValue: "ACTIVE_BLEEDING"
    },
    {
      id: 4,
      condition: t?.createBloodRequest?.medicalConditions?.cardiacSurgery,
      description: t?.createBloodRequest?.criticalNeeds?.heartSurgery,
      urgencyLevel: "MEDIUM",
      enumValue: "CARDIAC_SURGERY"
    },
    {
      id: 5,
      condition: t?.createBloodRequest?.medicalConditions?.cancerTreatment,
      description: t?.createBloodRequest?.criticalNeeds?.chemoDisorders,
      urgencyLevel: "MEDIUM",
      enumValue: "CANCER_TREATMENT"
    },
    {
      id: 6,
      condition: t?.createBloodRequest?.medicalConditions?.organTransplant,
      description: t?.createBloodRequest?.criticalNeeds?.majorTransplant,
      urgencyLevel: "MEDIUM",
      enumValue: "ORGAN_TRANSPLANT"
    },
    {
      id: 7,
      condition: t?.createBloodRequest?.medicalConditions?.plannedSurgery,
      description: t?.createBloodRequest?.criticalNeeds?.electiveSurgery,
      urgencyLevel: "LOW",
      enumValue: "PLANNED_SURGERY"
    },
    {
      id: 8,
      condition: t?.createBloodRequest?.medicalConditions?.bloodDisorder,
      description: t?.createBloodRequest?.criticalNeeds?.chronicConditions,
      urgencyLevel: "LOW",
      enumValue: "BLOOD_DISORDER"
    },
    {
      id: 9,
      condition: t?.createBloodRequest?.medicalConditions?.pregnancyComplications,
      description: t?.createBloodRequest?.criticalNeeds?.maternalFetalComplications,
      urgencyLevel: "MEDIUM",
      enumValue: "PREGNANCY_COMPLICATIONS"
    }
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Pass the query directly as a string - the backend API handles the search logic
        const results = await searchProfiles(query.trim());
        setSearchResults(results || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching profiles:', error);
        setSearchResults([]);
        toast.error('Failed to search profiles. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle profile selection
  const handleProfileSelect = (profile) => {
    setBloodRequests(prev => ({
      ...prev,
      profileId: profile.id,
      selectedProfile: profile,
      // Auto-select blood type if profile has one
      bloodType: profile.bloodType || prev.bloodType
    }));
    setSearchQuery(`${profile.name} - ${profile.personalId}`);
    setShowSearchResults(false);
  };

  // Clear selected profile
  const clearSelectedProfile = () => {
    setBloodRequests(prev => {
      // Only reset blood type if it was auto-selected from the profile
      const shouldResetBloodType = prev.selectedProfile && 
                                   prev.selectedProfile.bloodType === prev.bloodType;
      
      return {
        ...prev,
        profileId: null,
        selectedProfile: null,
        // Reset blood type only if it was auto-selected
        bloodType: shouldResetBloodType ? "" : prev.bloodType
      };
    });
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleDate = (date) => {
    setBloodRequests((prev) => {
      const updated = {
        ...prev,
        requiredDate: date,
      };
      // Auto-calculate urgency after setting date
      return calculateUrgency(updated);
    });
  };

  const handleMedicalCondition = (conditionId) => {
    setBloodRequests((prev) => {
      const condition = medicalConditions.find(c => c.id === conditionId);
      const isSelected = prev.medicalConditions.some(c => c.id === conditionId);
      
      let updatedConditions;
      if (isSelected) {
        updatedConditions = prev.medicalConditions.filter(c => c.id !== conditionId);
      } else {
        updatedConditions = [...prev.medicalConditions, condition];
      }
      
      const updated = {
        ...prev,
        medicalConditions: updatedConditions
      };
      
      // Auto-calculate urgency after medical condition change
      return calculateUrgency(updated);
    });
  };

  const calculateUrgency = (requestData) => {
    const { medicalConditions, requiredDate } = requestData;
    
    // Only auto-calculate urgency if both required date and medical conditions are selected
    if (!requiredDate || medicalConditions.length === 0) {
      return requestData; // Don't auto-calculate urgency
    }
    
    // Check if any high-priority conditions are selected
    const hasHighPriorityCondition = medicalConditions.some(c => c.urgencyLevel === "HIGH");
    
    // Calculate days until required date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reqDate = new Date(requiredDate);
    reqDate.setHours(0, 0, 0, 0);
    const daysUntilRequired = Math.ceil((reqDate - today) / (1000 * 60 * 60 * 24));
    
    let autoUrgency = requestData.urgency;
    
    // Auto-calculate urgency based on conditions and timing
    if (hasHighPriorityCondition || daysUntilRequired <= 0) {
      autoUrgency = "HIGH";
    } else if (medicalConditions.some(c => c.urgencyLevel === "MEDIUM") || daysUntilRequired <= 1) {
      autoUrgency = "MEDIUM";
    } else if (daysUntilRequired <= 3) {
      autoUrgency = "MEDIUM";
    } else {
      // If only low-priority conditions or longer timeframe
      autoUrgency = autoUrgency || "LOW";
    }
    
    return {
      ...requestData,
      urgency: autoUrgency
    };
      profileId: profile.id,
      selectedProfile: profile,
      // Auto-select blood type if profile has one
      bloodType: profile.bloodType || prev.bloodType
    }));
    setSearchQuery(`${profile.name} - ${profile.personalId}`);
    setShowSearchResults(false);
  };

  // Clear selected profile
  const clearSelectedProfile = () => {
    setBloodRequests(prev => {
      // Only reset blood type if it was auto-selected from the profile
      const shouldResetBloodType = prev.selectedProfile && 
                                   prev.selectedProfile.bloodType === prev.bloodType;
      
      return {
        ...prev,
        profileId: null,
        selectedProfile: null,
        // Reset blood type only if it was auto-selected
        bloodType: shouldResetBloodType ? "" : prev.bloodType
      };
    });
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleDate = (date) => {
    setBloodRequests((prev) => {
      const updated = {
        ...prev,
        requiredDate: date,
      };
      // Auto-calculate urgency after setting date
      return calculateUrgency(updated);
    });
  };

  const handleMedicalCondition = (conditionId) => {
    setBloodRequests((prev) => {
      const condition = medicalConditions.find(c => c.id === conditionId);
      const isSelected = prev.medicalConditions.some(c => c.id === conditionId);
      
      let updatedConditions;
      if (isSelected) {
        updatedConditions = prev.medicalConditions.filter(c => c.id !== conditionId);
      } else {
        updatedConditions = [...prev.medicalConditions, condition];
      }
      
      const updated = {
        ...prev,
        medicalConditions: updatedConditions
      };
      
      // Auto-calculate urgency after medical condition change
      return calculateUrgency(updated);
    });
  };

  const calculateUrgency = (requestData) => {
    const { medicalConditions, requiredDate } = requestData;
    
    // Only auto-calculate urgency if both required date and medical conditions are selected
    if (!requiredDate || medicalConditions.length === 0) {
      return requestData; // Don't auto-calculate urgency
    }
    
    // Check if any high-priority conditions are selected
    const hasHighPriorityCondition = medicalConditions.some(c => c.urgencyLevel === "HIGH");
    
    // Calculate days until required date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reqDate = new Date(requiredDate);
    reqDate.setHours(0, 0, 0, 0);
    const daysUntilRequired = Math.ceil((reqDate - today) / (1000 * 60 * 60 * 24));
    
    let autoUrgency = requestData.urgency;
    
    // Auto-calculate urgency based on conditions and timing
    if (hasHighPriorityCondition || daysUntilRequired <= 0) {
      autoUrgency = "HIGH";
    } else if (medicalConditions.some(c => c.urgencyLevel === "MEDIUM") || daysUntilRequired <= 1) {
      autoUrgency = "MEDIUM";
    } else if (daysUntilRequired <= 3) {
      autoUrgency = "MEDIUM";
    } else {
      // If only low-priority conditions or longer timeframe
      autoUrgency = autoUrgency || "LOW";
    }
    
    return {
      ...requestData,
      urgency: autoUrgency
    };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that a profile is selected
    if (!bloodRequest.profileId) {
      toast.error(t?.createBloodRequest?.error?.noProfile);
      return;
    }
    
    // Prepare the request data
    let requestData = {
      requiredDate: bloodRequest.requiredDate,
      urgency: bloodRequest.urgency,
      bloodType: bloodRequest.bloodType,
      componentRequests: bloodRequest.componentRequests,
      endTime: bloodRequest.requiredDate ? bloodRequest.requiredDate.toISOString() : "",
      // Convert selected medical conditions to enum values for backend
      medicalConditions: bloodRequest.medicalConditions.map(c => c.enumValue),
      additionalMedicalInformation: bloodRequest.additionalMedicalInformation,
      additionalNotes: bloodRequest.additionalNotes
    };

    // If it's a new profile, include the profile data instead of profileId
    if (bloodRequest.selectedProfile && bloodRequest.selectedProfile.isNew) {
      requestData.profile = { 
        name: bloodRequest.selectedProfile.name,
        personalId: bloodRequest.selectedProfile.personalId,
        phone: bloodRequest.selectedProfile.phone,
        address: bloodRequest.selectedProfile.address,
        ward: bloodRequest.selectedProfile.ward,
        district: bloodRequest.selectedProfile.district,
        city: bloodRequest.selectedProfile.city,
        bloodType: bloodRequest.selectedProfile.bloodType,
        gender: bloodRequest.selectedProfile.gender,
        dateOfBirth: bloodRequest.selectedProfile.dateOfBirth
      };
    } else {
      // Existing profile
      requestData.profileId = bloodRequest.profileId;
    }
    
    // Store the data and show confirmation dialog
    setPendingRequestData(requestData);
    setShowConfirmDialog(true);
  };

  const confirmSubmitRequest = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      await createRequest(pendingRequestData);
      toast.success(t?.createBloodRequest?.success);
      router.push("/staffs/emergency-request/list");
    } catch (error) {
      console.error(error);
      toast.error(t?.createBloodRequest?.error?.submission)
    } finally {
      setIsSubmitting(false);
      setPendingRequestData(null);
    }
  };

  const cancelRequestCreation = () => {
    setShowConfirmDialog(false);
    setPendingRequestData(null);
  };

  // Handle new profile input change
  const handleNewProfileChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new profile date of birth
  const handleNewProfileDOB = (date) => {
    setNewProfile(prev => ({
      ...prev,
      dateOfBirth: date
    }));
  };

  // Handle new profile blood type
  const handleNewProfileBloodType = (bloodType) => {
    setNewProfile(prev => ({
      ...prev,
      bloodType: bloodType
    }));
  };

  // Handle new profile gender
  const handleNewProfileGender = (gender) => {
    setNewProfile(prev => ({
      ...prev,
      gender: gender
    }));
  };

  // Handle location selection
  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    setSelectedDistrict("");
    setSelectedWard("");
    
    // Update newProfile with selected city
    setNewProfile(prev => ({
      ...prev,
      city: cityName,
      district: "",
      ward: ""
    }));

    // Find and set available districts for selected city
    const city = vietnamProvinces.find(city => city.name === cityName);
    if (city) {
      setAvailableDistricts(city.districts || []);
      setAvailableWards([]);
    }
  };

  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    setSelectedWard("");
    
    // Update newProfile with selected district
    setNewProfile(prev => ({
      ...prev,
      district: districtName,
      ward: ""
    }));

    // Find and set available wards for selected district
    const city = vietnamProvinces.find(city => city.name === selectedCity);
    if (city) {
      const district = city.districts.find(district => district.name === districtName);
      if (district) {
        setAvailableWards(district.wards || []);
      }
    }
  };

  const handleWardChange = (wardName) => {
    setSelectedWard(wardName);
    
    // Update newProfile with selected ward
    setNewProfile(prev => ({
      ...prev,
      ward: wardName
    }));
  };

  // Create new profile and select it
  const handleCreateNewProfile = () => {
    // Basic validation
    if (!newProfile.name || !newProfile.personalId || !newProfile.phone) {
      toast.error(t?.createBlog?.errrorRequired);
      return;
    }

    // Create a profile object similar to what comes from the database
    const createdProfile = {
      id: `temp_${Date.now()}`, // Temporary ID
      name: newProfile.name,
      personalId: newProfile.personalId,
      phone: newProfile.phone,
      address: newProfile.address,
      ward: newProfile.ward,
      district: newProfile.district,
      city: newProfile.city,
      bloodType: newProfile.bloodType,
      gender: newProfile.gender,
      dateOfBirth: newProfile.dateOfBirth,
      isNew: true // Flag to indicate this is a new profile
    };

    // Select the new profile
    setBloodRequests(prev => ({
      ...prev,
      profileId: createdProfile.id,
      selectedProfile: createdProfile,
      // Auto-select blood type if profile has one
      bloodType: createdProfile.bloodType || prev.bloodType
    }));

    // Clear search and close form
    setSearchQuery(`${createdProfile.name} - ${createdProfile.personalId}`);
    setShowSearchResults(false);
    setShowNewProfileForm(false);
    
    // Reset new profile form
    setNewProfile({
      name: "",
      personalId: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      bloodType: "",
      gender: "",
      dateOfBirth: null
    });

    // Reset location selection state
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAvailableDistricts([]);
    setAvailableWards([]);

    toast.success(t?.createBloodRequest?.profileCreatedAndSelected);
  };

  // Cancel new profile creation
  const cancelNewProfile = () => {
    setShowNewProfileForm(false);
    setNewProfile({
      name: "",
      personalId: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      bloodType: "",
      gender: "",
      dateOfBirth: null
    });
    // Reset location selection state
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAvailableDistricts([]);
    setAvailableWards([]);
  };

  return (
    <div className="bg-white w-full">
      <CardContent className="p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Profile Search */}
          <div className="space-y-4">
            <Label htmlFor="profileSearch" className="font-semibold text-gray-800 text-sm">
              {t?.createBloodRequest?.patientProfile?.search?.title}
            </Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="profileSearch"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t?.createBloodRequest?.patientProfile?.search?.placeholder}
                  className="pl-10 h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
              
              {/* Search Results */}
              {showSearchResults && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleProfileSelect(profile)}
                        >
                          <User className="h-4 w-4 text-gray-400 mr-3" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{profile.name}</div>
                            <div className="text-sm text-gray-500">
                              {t?.createBloodRequest?.patientProfile?.selectedProfile?.id} {profile.personalId} • {t?.createBloodRequest?.patientProfile?.selectedProfile?.phone} {profile.phone}
                            </div>
                            <div className="text-xs text-gray-400">
                              {profile.address}, {profile.ward}, {profile.district}, {profile.city}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3">
                      <div className="text-sm text-gray-500 mb-2">
                        {t?.createBloodRequest?.patientProfile?.search?.noResults}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowNewProfileForm(true);
                          setShowSearchResults(false);
                        }}
                        className="w-full"
                      >
                        {t?.createBloodRequest?.patientProfile?.search?.search?.createNew}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Create New Profile Button */}
            {!showNewProfileForm && !bloodRequest.selectedProfile && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewProfileForm(true)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {t?.createBloodRequest?.patientProfile?.search?.search?.createNew}
                </Button>
              </div>
            )}
            
            {/* New Profile Form */}
            {showNewProfileForm && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{t?.createBloodRequest?.patientProfile?.newProfile?.title}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelNewProfile}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t?.createBloodRequest?.patientProfile?.newProfile?.cancel}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="newProfileName" className="font-semibold text-gray-800 text-sm">
                     {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.name}
                    </Label>
                    <Input
                      id="newProfileName"
                      name="name"
                      value={newProfile.name}
                      onChange={handleNewProfileChange}
                      placeholder="Enter full name"
                      className="h-[48px] bg-white rounded-xl border-2 border-gray-200"
                    />
                  </div>
                  
                  {/* Personal ID */}
                  <div className="space-y-2">
                    <Label htmlFor="newProfilePersonalId" className="font-semibold text-gray-800 text-sm">
                      {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.personalId}
                    </Label>
                    <Input
                      id="newProfilePersonalId"
                      name="personalId"
                      value={newProfile.personalId}
                      onChange={handleNewProfileChange}
                      placeholder="Enter personal ID"
                      className="h-[48px] bg-white rounded-xl border-2 border-gray-200"
                    />
                  </div>
                  
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="newProfilePhone" className="font-semibold text-gray-800 text-sm">
                      {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.phone}
                    </Label>
                    <Input
                      id="newProfilePhone"
                      name="phone"
                      value={newProfile.phone}
                      onChange={handleNewProfileChange}
                      placeholder="Enter phone number"
                      className="h-[48px] bg-white rounded-xl border-2 border-gray-200"
                    />
                  </div>
                  
                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.patientProfile?.search?.search?.fields?.gender}</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={newProfile.gender === "MALE" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNewProfileGender("MALE")}
                        className="flex-1"
                      >
                        {t?.createBloodRequest?.patientProfile?.newProfile?.fields?.male}
                      </Button>
                      <Button
                        type="button"
                        variant={newProfile.gender === "FEMALE" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNewProfileGender("FEMALE")}
                        className="flex-1"
                      >
                        {t?.createBloodRequest?.patientProfile?.newProfile?.fields?.female}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.patientProfile?.search?.search?.fields?.dob}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-[48px] bg-white rounded-xl border-2 border-gray-200 w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newProfile.dateOfBirth ? format(newProfile.dateOfBirth, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3">
                          {/* Enhanced Year and Month Selectors */}
                          <div className="flex items-center justify-between space-x-2 mb-4">
                            <Select 
                              value={newProfile.dateOfBirth ? newProfile.dateOfBirth.getMonth().toString() : ""}
                              onValueChange={(month) => {
                                const currentDate = newProfile.dateOfBirth || new Date();
                                const newDate = new Date(currentDate.getFullYear(), parseInt(month), 1);
                                // Ensure we don't exceed the number of days in the month
                                const maxDays = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                                const day = Math.min(currentDate.getDate(), maxDays);
                                newDate.setDate(day);
                                handleNewProfileDOB(newDate);
                              }}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={newProfile.dateOfBirth ? newProfile.dateOfBirth.getFullYear().toString() : ""}
                              onValueChange={(year) => {
                                const currentDate = newProfile.dateOfBirth || new Date();
                                const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
                                handleNewProfileDOB(newDate);
                              }}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Calendar
                            mode="single"
                            selected={newProfile.dateOfBirth}
                            onSelect={handleNewProfileDOB}
                            disabled={(date) => date > new Date()}
                            month={newProfile.dateOfBirth || new Date()}
                            onMonthChange={(month) => {
                              // Update the selected date when month changes via calendar navigation
                              const currentDate = newProfile.dateOfBirth || new Date();
                              const newDate = new Date(month.getFullYear(), month.getMonth(), currentDate.getDate());
                              handleNewProfileDOB(newDate);
                            }}
                            initialFocus
                            className="rounded-md border-0"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Blood Type */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.patientProfile?.search?.search?.fields?.bloodType}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypes.map((type) => (
                        <Button
                          key={type.id}
                          type="button"
                          variant={newProfile.bloodType === type.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleNewProfileBloodType(type.value)}
                          className="text-xs"
                        >
                          {type.type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newProfileAddress" className="font-semibold text-gray-800 text-sm">
                      {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.address}
                    </Label>
                    <Input
                      id="newProfileAddress"
                      name="address"
                      value={newProfile.address}
                      onChange={handleNewProfileChange}
                      placeholder="Enter address"
                      className="h-[48px] bg-white rounded-xl border-2 border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-800 text-sm">
                      {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.city}
                    </Label>
                    <Select value={selectedCity} onValueChange={handleCityChange}>
                      <SelectTrigger className="h-[48px] bg-white rounded-xl border-2 border-gray-200">
                        <SelectValue placeholder="Select city/province" />
                      </SelectTrigger>
                      <SelectContent>
                        {vietnamProvinces.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-800 text-sm">
                      {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.district}
                    </Label>
                    <Select 
                      value={selectedDistrict} 
                      onValueChange={handleDistrictChange}
                      disabled={!selectedCity}
                    >
                      <SelectTrigger className="h-[48px] bg-white rounded-xl border-2 border-gray-200">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDistricts.map((district) => (
                          <SelectItem key={district.name} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-800 text-sm">
                      {t?.createBloodRequest?.patientProfile?.search?.search?.fields?.ward}
                    </Label>
                    <Select 
                      value={selectedWard} 
                      onValueChange={handleWardChange}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger className="h-[48px] bg-white rounded-xl border-2 border-gray-200">
                        <SelectValue placeholder="Select ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWards.map((ward) => (
                          <SelectItem key={ward.name} value={ward.name}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelNewProfile}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateNewProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {t?.createBloodRequest?.patientProfile?.newProfile?.createButton}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Selected Profile Display */}
            {bloodRequest.selectedProfile && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">{bloodRequest.selectedProfile.name}</h4>
                      <p className="text-sm text-blue-700">
                        {t?.createBloodRequest?.patientProfile?.selectedProfile?.id}
                      </p>
                      <p className="text-sm text-blue-700">
                        {t?.createBloodRequest?.patientProfile?.selectedProfile?.phone}
                      </p>
                      <p className="text-sm text-blue-700">
                        Address: {bloodRequest.selectedProfile.address}, {bloodRequest.selectedProfile.ward}, {bloodRequest.selectedProfile.district}, {bloodRequest.selectedProfile.city}
                      </p>
                      {bloodRequest.selectedProfile.bloodType && (
                        <p className="text-sm text-blue-700">
                          {t?.createBloodRequest?.patientProfile?.selectedProfile?.bloodType}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSelectedProfile}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {t?.createBloodRequest?.patientProfile?.search?.change}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="requiredDate" className="font-semibold text-gray-800 text-sm">Required Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[52px] bg-neutral-50 rounded-xl border-2 border-gray-100 w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bloodRequest.requiredDate ? format(bloodRequest.requiredDate, "PPP") : t?.createBloodRequest?.selectRequiredDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={bloodRequest.requiredDate}
                  onSelect={handleDate}
                  disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Component Selection with Volumes */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.components?.label} *</Label>
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
            <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.bloodType?.label}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bloodTypes.map((bloodType) => (
                <Button
                  key={bloodType.id}
                  variant={bloodType.value === bloodRequest.bloodType ? "default" : "outline"}
                  variant={bloodType.value === bloodRequest.bloodType ? "default" : "outline"}
                  type="button"
                  onClick={() => handleBloodType(bloodType.value)}
                  className={`h-16 rounded-xl border-2 font-semibold text-lg transition-all ${
                    bloodType.value === bloodRequest.bloodType
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-neutral-50 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200"
                  }`}
                  className={`h-16 rounded-xl border-2 font-semibold text-lg transition-all ${
                    bloodType.value === bloodRequest.bloodType
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-neutral-50 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200"
                  }`}
                >
                  {bloodType.type}
                </Button>
              ))}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.medicalConditions?.label}</Label>
            <p className="text-sm text-gray-600">{t?.createBloodRequest?.medicalConditions?.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicalConditions.map((condition) => {
                const isSelected = bloodRequest.medicalConditions.some(c => c.id === condition.id);
                return (
                  <div
                    key={condition.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => handleMedicalCondition(condition.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by onClick above
                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{condition.condition}</h4>
                        <p className="text-xs text-gray-600 mt-1">{condition.description}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            condition.urgencyLevel === 'HIGH' 
                              ? 'bg-red-100 text-red-800' 
                              : condition.urgencyLevel === 'MEDIUM' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {condition.urgencyLevel === 'HIGH' ? t?.createBloodRequest?.bloodRequest?.urgency?.critical : 
                             condition.urgencyLevel === 'MEDIUM' ? t?.createBloodRequest?.bloodRequest?.urgency?.urgent : t?.createBloodRequest?.bloodRequest?.urgency?.normal} {t?.blogRequest?.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-4">
            <Label className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.urgency?.label}*</Label>
            <p className="text-sm text-gray-600">
              {bloodRequest.urgency ? 
                "Urgency level automatically calculated based on medical conditions and required date. You can override if needed." :
                "Urgency level will be automatically set based on your medical condition selections and required date."
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgencyLevels.map((urgency) => (
                <div
                  key={urgency.id}
                  className={`${urgency.value === bloodRequest.urgency ? urgency.chosenColor : urgency.bgColor}
                    flex flex-col items-center justify-center h-[84px] 
                    rounded-xl border-2 ${urgency.borderColor} ${urgency.hoverColor} cursor-pointer
                    ${urgency.value === bloodRequest.urgency ? 'ring-2 ring-offset-2 ring-red-500' : ''}`}
                    rounded-xl border-2 ${urgency.borderColor} ${urgency.hoverColor} cursor-pointer
                    ${urgency.value === bloodRequest.urgency ? 'ring-2 ring-offset-2 ring-red-500' : ''}`}
                  onClick={() => handleUrgency(urgency.value)}
                >
                  <div className="flex items-center">
                    <span className={urgency.textColor}>{urgency.icon}</span>
                    <span className={`ml-2 font-semibold ${urgency.textColor} text-base`}>{urgency.level}</span>
                  </div>
                  <p className={`font-semibold ${urgency.textColor} text-sm mt-1`}>{urgency.timeframe}</p>
                  {urgency.value === bloodRequest.urgency && (
                    <p className="text-xs text-gray-600 mt-1">{t?.createBloodRequest?.urgency?.autoSelected}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="additionalMedicalInformation" className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.notes?.medicalInfo?.label}</Label>
              <Textarea
                id="additionalMedicalInformation"
                name="additionalMedicalInformation"
                placeholder={t?.createBloodRequest?.notes?.medicalInfo?.placeholder}
                className="min-h-[100px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                onChange={handleBloodRequest}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="font-semibold text-gray-800 text-sm">{t?.createBloodRequest?.notes?.additional?.label}</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                placeholder={t?.createBloodRequest?.notes?.additional?.placeholder}     
                className="min-h-[100px] bg-neutral-50 rounded-xl border-2 border-gray-100"
                onChange={handleBloodRequest}
                onChange={handleBloodRequest}
              />
            </div>
          </div>
          </div>

          {/* Submit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <Button type="button" variant="outline" className="h-[60px] rounded-xl border-2 font-semibold text-gray-500">{t?.createBloodRequest?.buttons?.cancel}</Button>
            <Button type="submit" className="h-[60px] rounded-xl font-semibold bg-gradient-to-r from-red-600 to-red-600 shadow-lg">{t?.createBloodRequest?.buttons?.submit}</Button>
          </div>
        </form>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={(open) => !open && cancelRequestCreation()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Blood Request</DialogTitle>
            <DialogDescription>
              Please review the blood request details before submitting. This will create an emergency blood request.
            </DialogDescription>
          </DialogHeader>
          
          {pendingRequestData && (
            <div className="space-y-2 py-4">
              {bloodRequest.selectedProfile && (
                <>
                  <div><strong>Patient Name:</strong> {bloodRequest.selectedProfile.name}</div>
                  <div><strong>Personal ID:</strong> {bloodRequest.selectedProfile.personalId}</div>
                  <div><strong>Phone:</strong> {bloodRequest.selectedProfile.phone}</div>
                  {bloodRequest.selectedProfile.address && (
                    <div><strong>Address:</strong> {bloodRequest.selectedProfile.address}, {bloodRequest.selectedProfile.ward}, {bloodRequest.selectedProfile.district}, {bloodRequest.selectedProfile.city}</div>
                  )}
                  {bloodRequest.selectedProfile.bloodType && (
                    <div><strong>Patient Blood Type:</strong> {convertBloodType(bloodRequest.selectedProfile.bloodType)}</div>
                  )}
                  {bloodRequest.selectedProfile.isNew && (
                    <div className="text-sm text-blue-600 font-medium">* This is a new profile that will be created</div>
                  )}
                </>
              )}
              <div><strong>Blood Type Requested:</strong> {bloodRequest.bloodType}</div>
              <div><strong>Required Date:</strong> {bloodRequest.requiredDate ? format(bloodRequest.requiredDate, "PPP") : "Not specified"}</div>
              <div><strong>Urgency:</strong> {bloodRequest.urgency}</div>
              {bloodRequest.componentRequests && bloodRequest.componentRequests.length > 0 && (
                <div>
                  <strong>Components Requested:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {bloodRequest.componentRequests.map((comp, index) => (
                      <li key={index}>
                        {comp.componentType.replace(/_/g, ' ')} - Volume: {comp.volume}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bloodRequest.medicalConditions && bloodRequest.medicalConditions.length > 0 && (
                <div>
                  <strong>Medical Conditions:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {bloodRequest.medicalConditions.map((condition, index) => (
                      <li key={index}>{condition.condition}</li>
                    ))}
                  </ul>
                </div>
              )}
              {bloodRequest.additionalMedicalInformation && (
                <div><strong>Additional Medical Info:</strong> {bloodRequest.additionalMedicalInformation}</div>
              )}
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={cancelRequestCreation}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmSubmitRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                'Confirm & Submit Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={(open) => !open && cancelRequestCreation()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Blood Request</DialogTitle>
            <DialogDescription>
              Please review the blood request details before submitting. This will create an emergency blood request.
            </DialogDescription>
          </DialogHeader>
          
          {pendingRequestData && (
            <div className="space-y-2 py-4">
              {bloodRequest.selectedProfile && (
                <>
                  <div><strong>Patient Name:</strong> {bloodRequest.selectedProfile.name}</div>
                  <div><strong>Personal ID:</strong> {bloodRequest.selectedProfile.personalId}</div>
                  <div><strong>Phone:</strong> {bloodRequest.selectedProfile.phone}</div>
                  {bloodRequest.selectedProfile.address && (
                    <div><strong>Address:</strong> {bloodRequest.selectedProfile.address}, {bloodRequest.selectedProfile.ward}, {bloodRequest.selectedProfile.district}, {bloodRequest.selectedProfile.city}</div>
                  )}
                  {bloodRequest.selectedProfile.bloodType && (
                    <div><strong>Patient Blood Type:</strong> {convertBloodType(bloodRequest.selectedProfile.bloodType)}</div>
                  )}
                  {bloodRequest.selectedProfile.isNew && (
                    <div className="text-sm text-blue-600 font-medium">* This is a new profile that will be created</div>
                  )}
                </>
              )}
              <div><strong>Blood Type Requested:</strong> {bloodRequest.bloodType}</div>
              <div><strong>Required Date:</strong> {bloodRequest.requiredDate ? format(bloodRequest.requiredDate, "PPP") : "Not specified"}</div>
              <div><strong>Urgency:</strong> {bloodRequest.urgency}</div>
              {bloodRequest.componentRequests && bloodRequest.componentRequests.length > 0 && (
                <div>
                  <strong>Components Requested:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {bloodRequest.componentRequests.map((comp, index) => (
                      <li key={index}>
                        {comp.componentType.replace(/_/g, ' ')} - Volume: {comp.volume}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bloodRequest.medicalConditions && bloodRequest.medicalConditions.length > 0 && (
                <div>
                  <strong>Medical Conditions:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {bloodRequest.medicalConditions.map((condition, index) => (
                      <li key={index}>{condition.condition}</li>
                    ))}
                  </ul>
                </div>
              )}
              {bloodRequest.additionalMedicalInformation && (
                <div><strong>Additional Medical Info:</strong> {bloodRequest.additionalMedicalInformation}</div>
              )}
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={cancelRequestCreation}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmSubmitRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                'Confirm & Submit Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
