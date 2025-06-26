import { UserContext } from '@/context/user_context';
import React, { useContext, useState } from 'react'
import { toast } from 'sonner';
// import 


function PersonalInfo() {
  const { profile, loggedIn, account, setProfile } = useContext(UserContext);

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
    dob: profile.dob || '',
    city: profile.city || '',
    emergencyContact: profile.emergencyContact || '',
    medicalConditions: profile.medicalConditions || '',
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values) => {
    values.preventDefault();
    console.log("Success:", values);
    // Submit logic here, form contains all values (changed or unchanged)
    // e.g., updateProfile(form)
    try {
      // values: thông tin người dùng nhập
      // await api.post("register", values);
      toast.success("Update Successfully!");

    } catch (e) {
      console.log(e);
      // show ra màn hình cho người dùng biết lỗi
      toast.error(e.response.data);
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
          <input type='hidden' value={profile.account_id} />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input name="name" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input name="email" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.email} onChange={handleChange} disabled />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Phone Number</label>
              <input name="phone" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Personal ID</label>
              <input name="personalId" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.personalId} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Address</label>
              <input name="address" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.address} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Blood Type</label>
              
              <select
                name="blood_type"
                required
                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                value={form.blood_type}
                onChange={handleChange}
              >
                <option value="">Select blood type</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ward</label>
              <input name="ward" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.ward} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Gender</label>
              <select name="gender" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">District</label>
              <input name="district" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.district} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Date of Birth</label>
              <input name="dob" type="date" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.dob} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">City</label>
              <input name="city" required className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Emergency Contact</label>
              <input name="emergencyContact" className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4" value={form.emergencyContact} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfo
