'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, ArrowUpDown, Phone, MapPin, Droplet, User, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DonorListPage() {
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bloodType: '*',
    availability: '*'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'lastDonationDate',
    direction: 'desc'
  });
  const [activeTab, setActiveTab] = useState('registered');
  const [newDonor, setNewDonor] = useState({
    name: '',
    phone: '',
    bloodType: 'A+',
    location: '',
    notes: ''
  });


  // Mock data - replace with API call in real implementation
  useEffect(() => {
    const mockDonors = [
      {
        id: 1,
        name: 'Nguyen Van A',
        personalId: '123456789',
        bloodType: 'A+',
        phone: '0901234567',
        location: 'District 1, HCMC',
        lastDonationDate: '2023-10-15',
        available: true
      },
      {
        id: 2,
        name: 'Tran Thi B',
        personalId: '987654321',
        bloodType: 'O+',
        phone: '0912345678',
        location: 'District 3, HCMC',
        lastDonationDate: '2023-09-20',
        available: true
      },
      {
        id: 3,
        name: 'Le Van C',
        personalId: '456789123',
        bloodType: 'B+',
        phone: '0987654321',
        location: 'District 5, HCMC',
        lastDonationDate: '2023-11-05',
        available: false
      },
      {
        id: 4,
        name: 'Pham Thi D',
        personalId: '321654987',
        bloodType: 'AB+',
        phone: '0978123456',
        location: 'District 7, HCMC',
        lastDonationDate: '2023-08-12',
        available: true
      },
      {
        id: 5,
        name: 'Hoang Van E',
        personalId: '654987321',
        bloodType: 'A+',
        phone: '0965432187',
        location: 'Binh Thanh District, HCMC',
        lastDonationDate: '2023-12-01',
        available: true
      }
    ];
    setDonors(mockDonors);
    setFilteredDonors(mockDonors);
  }, []);

  const handleAddUnregisteredDonor = () => {
    // In a real app, this would submit to your API
    const donor = {
      id: Date.now(), // temporary ID
      ...newDonor,
      personalId: 'UNREGISTERED',
      lastDonationDate: new Date().toISOString().split('T')[0],
      available: true
    };
    
    setDonors([...donors, donor]);
    setFilteredDonors([...filteredDonors, donor]);
    setNewDonor({
      name: '',
      phone: '',
      bloodType: 'A+',
      location: '',
      notes: ''
    });
    
    // Switch back to registered tab
    setActiveTab('registered');
    alert('Đã thêm người hiến máu tạm thời thành công!');
  };

  const SortableHeader = ({ children, sortKey }) => (
    <div 
      className="flex items-center cursor-pointer hover:text-primary"
      onClick={() => handleSort(sortKey)}
    >
      {children}
      <ArrowUpDown className="h-4 w-4 ml-2" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Danh Sách Người Hiến Máu</h1>
        <p className="text-gray-600">{filteredDonors.length} người hiến phù hợp</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="registered">
            <User className="h-4 w-4 mr-2" />
            Người hiến đã đăng ký
          </TabsTrigger>
          <TabsTrigger value="unregistered">
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm thông tin người hiến
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registered">
          {/* Search and Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc CCCD"
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
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.availability}
                  onValueChange={(value) => setFilters({...filters, availability: value})}
                >
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <SelectValue placeholder="Tình trạng" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Tất cả</SelectItem>
                    <SelectItem value="available">Sẵn sàng</SelectItem>
                    <SelectItem value="unavailable">Không sẵn sàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Donor Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader sortKey="name">Tên người hiến</SortableHeader>
                  </TableHead>
                  <TableHead>CCCD</TableHead>
                  <TableHead>
                    <SortableHeader sortKey="bloodType">Nhóm máu</SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader sortKey="location">Địa chỉ</SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader sortKey="lastDonationDate">Lần hiến cuối</SortableHeader>
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor) => (
                    <TableRow key={donor.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>{donor.personalId}</TableCell>
                      <TableCell>
                        <Badge variant={donor.bloodType === 'A+' ? 'destructive' : 'outline'}>
                          {donor.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          {donor.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(donor.lastDonationDate).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          disabled={!donor.available}
                          className="h-8"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Liên hệ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Không tìm thấy người hiến phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="unregistered">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-6 w-6 mr-2 text-red-500" />
                Thêm Người Hiến Tạm Thời
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input 
                    id="name" 
                    placeholder="Nhập họ tên đầy đủ" 
                    value={newDonor.name}
                    onChange={(e) => setNewDonor({...newDonor, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input 
                    id="phone" 
                    placeholder="Nhập số điện thoại" 
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({...newDonor, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Nhóm máu</Label>
                  <Select
                    value={newDonor.bloodType}
                    onValueChange={(value) => setNewDonor({...newDonor, bloodType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm máu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Địa chỉ</Label>
                  <Input 
                    id="location" 
                    placeholder="Nhập địa chỉ" 
                    value={newDonor.location}
                    onChange={(e) => setNewDonor({...newDonor, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    placeholder="Thông tin bổ sung về người hiến"
                    value={newDonor.notes}
                    onChange={(e) => setNewDonor({...newDonor, notes: e.target.value})}
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
                  onClick={handleAddUnregisteredDonor}
                  disabled={!newDonor.name || !newDonor.phone}
                >
                  Thêm Người Hiến
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}