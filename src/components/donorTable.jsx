import { ArrowUpDown, Phone, MapPin, ClipboardEdit, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from 'react';

const bloodTypeMap = {
  'A_POSITIVE': 'A+',
  'A_NEGATIVE': 'A-',
  'B_POSITIVE': 'B+',
  'B_NEGATIVE': 'B-',
  'AB_POSITIVE': 'AB+',
  'AB_NEGATIVE': 'AB-',
  'O_POSITIVE': 'O+',
  'O_NEGATIVE': 'O-'
};

const genderMap = {
  'MALE': 'Nam',
  'FEMALE': 'Nữ',
  'OTHER': 'Khác'
};

export default function DonorTable({ donors, handleSort, setActiveTab, setDonor, bloodRequest, distanceEnabled = false }) {
  const SortableHeader = ({ children, sortKey }) => (
    <div 
      className="flex items-center cursor-pointer hover:text-primary"
      onClick={() => handleSort(sortKey)}
    >
      {children}
      <ArrowUpDown className="h-4 w-4 ml-2" />
    </div>
  );

  const isEligibleToDonate = (nextEligibleDonationDate) => {
    const today = new Date();
    const eligibleDate = new Date(nextEligibleDonationDate);
    return eligibleDate <= today;
  };

  const hasDonatedForRequest = (donor) => {
    if (!bloodRequest || !bloodRequest.bloodUnits) return false;
    for(const bloodUnit of bloodRequest.bloodUnits) {
      if(bloodUnit.profileId === donor.id) return true;
    }
    return false
  };


  return (
      <div className="rounded-md border mb-4">
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
              <TableHead>Giới tính</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>
                <SortableHeader sortKey="address">Địa chỉ</SortableHeader>
              </TableHead>
              {distanceEnabled && (
                <TableHead>
                  <SortableHeader sortKey="distance">Khoảng cách</SortableHeader>
                </TableHead>
              )}
              <TableHead>Tình trạng</TableHead>
              <TableHead>Đã hiến</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donors.length > 0 ? (
              donors.map((donor) => (
                <TableRow key={donor.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{donor.name}</TableCell>
                  <TableCell>{donor.personalId}</TableCell>
                  <TableCell>
                    <Badge variant={donor.bloodType === 'A_POSITIVE' ? 'destructive' : 'outline'}>
                      {bloodTypeMap[donor.bloodType]}
                    </Badge>
                  </TableCell>
                  <TableCell>{genderMap[donor.gender]}</TableCell>
                  <TableCell>{donor.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {donor.address}
                    </div>
                  </TableCell>
                  {distanceEnabled && (
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                        <div className="flex flex-col">
                          {donor.distanceText && (
                            <span className="text-blue-600 font-medium">{donor.distanceText}</span>
                          )}
                          {donor.durationText && (
                            <span className="text-gray-500 text-xs">{donor.durationText}</span>
                          )}
                          {!donor.distanceText && !donor.durationText && (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    {isEligibleToDonate(donor.nextEligibleDonationDate) ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Có thể hiến
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Chưa thể hiến
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {hasDonatedForRequest(donor) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {setDonor(donor); setActiveTab('unregistered')}}
                      className="h-8"
                    >
                      <ClipboardEdit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={distanceEnabled ? 10 : 9} className="h-24 text-center">
                  Không tìm thấy người hiến phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  );
}