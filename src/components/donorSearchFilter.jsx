import { Search, User, Droplet } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DonorSearchFilter({ searchTerm, setSearchTerm, filters, setFilters }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm theo tên, CCCD hoặc số điện thoại"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={filters.bloodType}
            onValueChange={(value) => setFilters({...filters, bloodType: value})}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                <SelectValue placeholder="Nhóm máu" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">Tất cả</SelectItem>
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

          <Select 
            value={filters.gender}
            onValueChange={(value) => setFilters({...filters, gender: value})}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" />
                <SelectValue placeholder="Giới tính" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">Tất cả</SelectItem>
              <SelectItem value="MALE">Nam</SelectItem>
              <SelectItem value="FEMALE">Nữ</SelectItem>
              <SelectItem value="OTHER">Khác</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.availability}
            onValueChange={(value) => setFilters({...filters, availability: value})}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-green-500" />
                <SelectValue placeholder="Tình trạng" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">Tất cả</SelectItem>
              <SelectItem value="available">Có thể hiến</SelectItem>
              <SelectItem value="unavailable">Chưa thể hiến</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
} 