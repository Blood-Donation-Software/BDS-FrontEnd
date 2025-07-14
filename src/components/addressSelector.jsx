import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import vietnamProvinces from '@/data/vietnam-provinces.json';

export default function AddressSelector({ address, setAddress }) {
  const [provinces] = useState(vietnamProvinces);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);

  // Initialize with existing address data
  useEffect(() => {
    if (address?.city) {
      const province = provinces.find(p => p.name === address.city);
      if (province) {
        setSelectedProvince(province);
        setAvailableDistricts(province.districts);
        
        if (address?.district) {
          const district = province.districts.find(d => d.name === address.district);
          if (district) {
            setSelectedDistrict(district);
            setAvailableWards(district.wards);
          }
        }
      }
    }
  }, [address?.city, address?.district, provinces]);

  const handleProvinceChange = (provinceName) => {
    const province = provinces.find(p => p.name === provinceName);
    setSelectedProvince(province);
    setAvailableDistricts(province?.districts || []);
    setSelectedDistrict(null);
    setAvailableWards([]);
    
    setAddress({
      ...address,
      city: provinceName,
      district: '',
      ward: ''
    });
  };

  const handleDistrictChange = (districtName) => {
    const district = availableDistricts.find(d => d.name === districtName);
    setSelectedDistrict(district);
    setAvailableWards(district?.wards || []);
    
    setAddress({
      ...address,
      district: districtName,
      ward: ''
    });
  };

  const handleWardChange = (wardName) => {
    setAddress({
      ...address,
      ward: wardName
    });
  };

  const handleStreetAddressChange = (streetAddress) => {
    setAddress({
      ...address,
      address: streetAddress
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="streetAddress">Địa chỉ cụ thể *</Label>
        <Input 
          id="streetAddress" 
          placeholder="Nhập số nhà, đường/phố" 
          value={address?.address || ''}
          onChange={(e) => handleStreetAddressChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
        <Select
          value={address?.city || ''}
          onValueChange={handleProvinceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province.name} value={province.name}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district">Quận/Huyện *</Label>
        <Select
          value={address?.district || ''}
          onValueChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn quận/huyện" />
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
        <Label htmlFor="ward">Phường/Xã *</Label>
        <Select
          value={address?.ward || ''}
          onValueChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn phường/xã" />
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
  );
}
