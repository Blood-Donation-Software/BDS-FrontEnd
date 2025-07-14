import { useEffect, useState } from 'react';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { addBloodRequestDonor } from '@/apis/bloodrequest';
import { useBloodRequests } from '@/context/bloodRequest_context';
import AddressSelector from './addressSelector';

export default function AddDonorForm({ setActiveTab, donor, setDonor, handleAddDonor, setVolume, volume }) {
  const [addressData, setAddressData] = useState({
    address: '',
    ward: '',
    district: '',
    city: ''
  });
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Initialize address data when donor changes (only on mount or when donor ID changes)
  useEffect(() => {
    if (donor) {
      setAddressData({
        address: donor.address || '',
        ward: donor.ward || '',
        district: donor.district || '',
        city: donor.city || ''
      });
      // Set calendar date to selected date or default to a reasonable birth year
      if (donor.dateOfBirth) {
        setCalendarDate(convertToDate(donor.dateOfBirth));
      } else {
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 30); // Default to 30 years ago
        setCalendarDate(defaultDate);
      }
    }
  }, [donor?.id]); // Only depend on donor ID to avoid infinite loops

  // Function to update donor with address data
  const updateDonorWithAddress = (newAddressData) => {
    setAddressData(newAddressData);
    setDonor({
      ...donor,
      address: newAddressData.address,
      ward: newAddressData.ward,
      district: newAddressData.district,
      city: newAddressData.city
    });
  };

  const calculateNextEligibleDate = (lastDonationDate) => {
    if (!lastDonationDate) return '';
    const [day, month, year] = lastDonationDate.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    date.setMonth(date.getMonth() + 3); // Assuming 3 months between donations
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const convertToInputDate = (ddMMyyyyDate) => {
    if (!ddMMyyyyDate) return '';
    const [day, month, year] = ddMMyyyyDate.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const convertToDate = (ddMMyyyyDate) => {
    if (!ddMMyyyyDate) return undefined;
    const [day, month, year] = ddMMyyyyDate.split('-');
    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Generate year options for the selector
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 65; // Maximum 65 years old
    const endYear = currentYear - 18; // Minimum 18 years old
    const years = [];
    
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  };

  const handleYearChange = (year) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(parseInt(year));
    setCalendarDate(newDate);
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCalendarDate(newDate);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const [day, month, year] = dateOfBirth.split('-');
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const isAgeEligible = (dateOfBirth) => {
    const age = calculateAge(dateOfBirth);
    return age >= 18 && age <= 65;
  };

  const isFormValid = () => {
    return donor?.name && 
           donor?.personalId && donor.personalId.length === 12 &&
           donor?.phone && donor.phone.length === 10 &&
           donor?.dateOfBirth && isAgeEligible(donor.dateOfBirth) &&
           addressData.address &&
           addressData.ward &&
           addressData.district &&
           addressData.city &&
           volume > 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlusCircle className="h-6 w-6 mr-2 text-red-500" />
          Thêm Người Hiến Máu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên *</Label>
            <Input 
              id="name" 
              placeholder="Nhập họ tên đầy đủ" 
              value={donor?.name}
              onChange={(e) => setDonor({...donor, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalId">Số CCCD/CMND (12 chữ số) *</Label>
            <Input 
              id="personalId" 
              placeholder="Nhập số CCCD/CMND" 
              value={donor?.personalId}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (value.length <= 12) {
                  setDonor({...donor, personalId: value});
                }
              }}
              maxLength={12}
            />
            {donor?.personalId && donor.personalId.length !== 12 && (
              <p className="text-sm text-red-500">Số CCCD/CMND phải có đúng 12 chữ số</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại (10 chữ số) *</Label>
            <Input 
              id="phone" 
              placeholder="Nhập số điện thoại" 
              value={donor?.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (value.length <= 10) {
                  setDonor({...donor, phone: value});
                }
              }}
              maxLength={10}
            />
            {donor?.phone && donor.phone.length !== 10 && (
              <p className="text-sm text-red-500">Số điện thoại phải có đúng 10 chữ số</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !donor?.dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {donor?.dateOfBirth ? formatDateForDisplay(convertToDate(donor.dateOfBirth)) : "Chọn ngày sinh"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMonthChange(-1)}
                      disabled={(() => {
                        const prevMonth = new Date(calendarDate);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        const minDate = new Date();
                        minDate.setFullYear(minDate.getFullYear() - 65);
                        return prevMonth < minDate;
                      })()}
                    >
                      ‹
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {calendarDate.toLocaleDateString('vi-VN', { month: 'long' })}
                      </span>
                      <Select
                        value={calendarDate.getFullYear().toString()}
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger className="w-[80px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {generateYearOptions().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMonthChange(1)}
                      disabled={(() => {
                        const nextMonth = new Date(calendarDate);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        const maxDate = new Date();
                        maxDate.setFullYear(maxDate.getFullYear() - 18);
                        return nextMonth > maxDate;
                      })()}
                    >
                      ›
                    </Button>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={convertToDate(donor?.dateOfBirth)}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = formatDate(date);
                      setDonor({...donor, dateOfBirth: formattedDate});
                    } else {
                      setDonor({...donor, dateOfBirth: ''});
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    const minDate = new Date();
                    minDate.setFullYear(today.getFullYear() - 65); // Maximum 65 years old
                    const maxDate = new Date();
                    maxDate.setFullYear(today.getFullYear() - 18); // Minimum 18 years old
                    return date > maxDate || date < minDate;
                  }}
                  month={calendarDate}
                  onMonthChange={setCalendarDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {donor?.dateOfBirth && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Ngày sinh: {donor.dateOfBirth} (Tuổi: {calculateAge(donor.dateOfBirth)})
                </p>
                {!isAgeEligible(donor.dateOfBirth) && (
                  <p className="text-sm text-red-500">
                    Người hiến máu phải từ 18 đến 65 tuổi
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodType">Nhóm máu</Label>
            <Select
              value={donor?.bloodType}
              onValueChange={(value) => setDonor({...donor, bloodType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm máu" />
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
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              value={donor?.gender}
              onValueChange={(value) => setDonor({...donor, gender: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Địa chỉ *</Label>
          <AddressSelector 
            address={addressData} 
            setAddress={updateDonorWithAddress}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="volume">Đơn vị máu (ml) *</Label>
          <Input 
            id="volume" 
            placeholder="Nhập số lượng máu hiến" 
            type="number"
            value={volume || ''}
            onChange={(e) => {
              const value = e.target.value;
              setVolume(value === '' ? null : parseFloat(value));
            }}
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('registered')}
          >
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleAddDonor}
            disabled={!isFormValid()}
          >
            Thêm Người Hiến
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}