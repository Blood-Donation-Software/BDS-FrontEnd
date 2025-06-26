import { UserContext } from '@/context/user_context';
import React, { useContext, useState, useEffect } from 'react'
import { toast } from 'sonner';
import vietnamProvinces from '@/data/vietnam-provinces.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile } from '@/apis/user';


function PersonalInfo() {
  const { profile, loggedIn, account, setProfile } = useContext(UserContext);

  // Helper function to convert DD-MM-YYYY to YYYY-MM-DD
  const convertDateFormat = (dateString) => {
    if (!dateString) return '';

    // Check if it's already in YYYY-MM-DD format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }

    // Convert from DD-MM-YYYY to YYYY-MM-DD
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateString.split('-');
      return `${year}-${month}-${day}`;
    }

    return dateString;
  };

  // Helper function to convert YYYY-MM-DD back to DD-MM-YYYY for server
  const convertDateForServer = (dateString) => {
    if (!dateString) return '';

    // Check if it's in YYYY-MM-DD format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  // Local state for each field, initialized with profile values
  const [form, setForm] = useState({
    name: profile.name || '',
    email: account.email || '',
    phone: profile.phone || '',
    personalId: profile.personalId || '',
    address: profile.address || '',
    blood_type: profile.bloodType || '',
    ward: profile.ward || '',
    gender: profile.gender || '',
    district: profile.district || '',
    dob: convertDateFormat(profile.dateOfBirth) || '',
    city: profile.city || '',
    emergencyContact: profile.emergencyContact || '',
    medicalConditions: profile.medicalConditions || '',
  });

  // State for location dropdowns
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update districts when city changes
  useEffect(() => {
    if (form.city) {
      const selectedProvince = vietnamProvinces.find(province => province.name === form.city);
      if (selectedProvince) {
        setAvailableDistricts(selectedProvince.districts);
        // Reset district and ward when city changes
        if (form.district && !selectedProvince.districts.find(d => d.name === form.district)) {
          setForm(prev => ({ ...prev, district: '', ward: '' }));
          setAvailableWards([]);
        }
      } else {
        setAvailableDistricts([]);
        setAvailableWards([]);
      }
    } else {
      setAvailableDistricts([]);
      setAvailableWards([]);
    }
  }, [form.city]);

  // Update wards when district changes
  useEffect(() => {
    if (form.district && availableDistricts.length > 0) {
      const selectedDistrict = availableDistricts.find(district => district.name === form.district);
      if (selectedDistrict) {
        setAvailableWards(selectedDistrict.wards);
        // Reset ward when district changes
        if (form.ward && !selectedDistrict.wards.find(w => w.name === form.ward)) {
          setForm(prev => ({ ...prev, ward: '' }));
        }
      } else {
        setAvailableWards([]);
      }
    } else {
      setAvailableWards([]);
    }
  }, [form.district, availableDistricts]);

  // Initialize districts and wards on component mount
  useEffect(() => {
    if (form.city) {
      const selectedProvince = vietnamProvinces.find(province => province.name === form.city);
      if (selectedProvince) {
        setAvailableDistricts(selectedProvince.districts);

        if (form.district) {
          const selectedDistrict = selectedProvince.districts.find(district => district.name === form.district);
          if (selectedDistrict) {
            setAvailableWards(selectedDistrict.wards);
          }
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the data for server - convert field names and date format
      const profileData = {
        id: profile.id,
        accountId: profile.accountId,
        status: "AVAILABLE",
        name: form.name,
        phone: form.phone,
        personalId: form.personalId,
        address: form.address,
        bloodType: form.blood_type,
        ward: form.ward,
        gender: form.gender,
        district: form.district,
        dateOfBirth: convertDateForServer(form.dob), // Convert back to DD-MM-YYYY
        city: form.city,
        emergencyContact: form.emergencyContact,
        medicalConditions: form.medicalConditions,
      };

      console.log("Updating profile with data:", profileData);

      const response = await updateProfile(profileData);

      // Update the context with new profile data
      setProfile(response);

      toast.success("Profile updated successfully!");

    } catch (error) {
      console.error("Update profile error:", error);

      // Handle different error types
      if (error?.message) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex-1">
      <div className="bg-white rounded-2xl shadow-md p-8 relative">
        {/* Status */}
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
        <form onSubmit={handleSubmit}>
          <input type='hidden' value={profile.id} />
          <input type='hidden' value={profile.accountId} />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input name="name" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                name="email"
                required
                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                value={form.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Phone Number</label>
              <input
                name="phone"
                required
                pattern="^(03|05|07|08|09)\d{8}$"
                title="Please enter a valid Vietnamese phone number (e.g., 0912345678)"
                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Personal ID</label>
              <input
                name="personalId"
                required
                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                value={form.personalId}
                onChange={handleChange} />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Blood Type</label>
              <Select
                value={form.blood_type}
                onValueChange={(value) => handleSelectChange('blood_type', value)}
              >
                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A_POSITIVE">A+</SelectItem>
                  <SelectItem value="A_NEGATIVE">A-</SelectItem>
                  <SelectItem value="B_POSITIVE">B+</SelectItem>
                  <SelectItem value="B_NEGATIVE">B-</SelectItem>
                  <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                  <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                  <SelectItem value="O_POSITIVE">O+</SelectItem>
                  <SelectItem value="O_NEGATIVE">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Gender</label>
              <Select
                value={form.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">City/Province</label>
              <Select
                value={form.city}
                onValueChange={(value) => handleSelectChange('city', value)}
              >
                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4">
                  <SelectValue placeholder="Select city/province" />
                </SelectTrigger>
                <SelectContent>
                  {vietnamProvinces.map((province, index) => (
                    <SelectItem key={index} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Date of Birth</label>
              <input name="dob" type="date" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.dob} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">District</label>
              <Select
                value={form.district}
                onValueChange={(value) => handleSelectChange('district', value)}
                disabled={availableDistricts.length === 0}
              >
                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district, index) => (
                    <SelectItem key={index} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ward</label>
              <Select
                value={form.ward}
                onValueChange={(value) => handleSelectChange('ward', value)}
                disabled={availableWards.length === 0}
              >
                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {availableWards.map((ward, index) => (
                    <SelectItem key={index} value={ward.name}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Address</label>
              <input name="address" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.address} onChange={handleChange} />
            </div>


            <div>
              <label className="block text-gray-600 mb-1">Emergency Contact</label>
              <input name="emergencyContact" className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.emergencyContact} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfo
