import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
import { toast } from 'sonner';
import { addBloodRequestDonor } from '@/apis/bloodrequest';
import { useBloodRequests } from '@/context/bloodRequest_context';

export default function AddDonorForm({ setActiveTab, donor, setDonor, handleAddDonor, setVolume, volume }) {

  const calculateNextEligibleDate = (lastDonationDate) => {
    if (!lastDonationDate) return '';
    const [day, month, year] = lastDonationDate.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    date.setMonth(date.getMonth() + 3); // Assuming 3 months between donations
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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
            <Label htmlFor="personalId">Số CCCD/CMND *</Label>
            <Input 
              id="personalId" 
              placeholder="Nhập số CCCD/CMND" 
              value={donor?.personalId}
              onChange={(e) => setDonor({...donor, personalId: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input 
              id="phone" 
              placeholder="Nhập số điện thoại" 
              value={donor?.phone}
              onChange={(e) => setDonor({...donor, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Ngày sinh (dd-mm-yyyy) *</Label>
            <Input 
              id="dateOfBirth" 
              placeholder="Nhập ngày sinh" 
              value={donor?.dateOfBirth}
              onChange={(e) => setDonor({...donor, dateOfBirth: e.target.value})}
            />
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
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input 
              id="address" 
              placeholder="Nhập địa chỉ" 
              value={donor?.address}
              onChange={(e) => setDonor({...donor, address: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">Đơn vị máu (ml) *</Label>
            <Input 
              id="volume" 
              placeholder="Nhập số lượng máu hiến" 
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                setVolume(value === '' ? null : parseFloat(value));
              }}
            />
          </div>
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
            disabled={!donor?.name || !donor?.personalId || !donor?.phone || !donor?.dateOfBirth}
          >
            Thêm Người Hiến
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}