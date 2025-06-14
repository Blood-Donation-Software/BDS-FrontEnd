'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DonorSearchFilter from '@/components/donorSearchFilter';
import DonorTable from '@/components/donorTable';
import AddDonorForm from '@/components/addDonorForm';
import PaginationControls from '@/components/paginationControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, PlusCircle } from 'lucide-react';
import { getAllProfile } from '@/apis/user';
import { useBloodRequests } from '@/context/bloodRequest_context';
import { Button } from '@/components/ui/button';
import { addBloodRequestDonor, fulfillBloodRequest } from '@/apis/bloodrequest';
import { toast } from 'sonner';

export default function DonorListPage() {
  const router = useRouter();
  const { bloodRequest, setBloodRequest } = useBloodRequests();
  const [donor, setDonor] = useState(); 
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bloodType: '*',
    availability: '*',
    gender: '*'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'lastDonationDate',
    direction: 'desc'
  });
  const [activeTab, setActiveTab] = useState('registered');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const donorsPerPage = 10; 
  const [disable, setDisable] = useState(true);
  const [volume, setVolume] = useState(0);
  const getComponentPercentage = (componentType) => {
    if (componentType === 'RED_BLOOD_CELLS') return 0.44;
    else if (componentType === 'PLASMA') return 0.55;
    else if (componentType === 'PLATELETS') return 0.01;
    return 1;
  }

  const handleAddDonor = async () => {  

    const bloodUnit = {
      "volume": volume,
      "bloodType": bloodRequest.bloodType,
      "componentType": "WHOLE_BLOOD",
      "status": "COMPLETED",
      "profileId": donor.id ? donor.id : null,
    }

    const updated = await addBloodRequestDonor(bloodRequest, bloodUnit, donor);
    setBloodRequest({ ...updated }); // shallow clone to force state change


    setDonor({
      id: null,
      name: '',
      personalId: '',
      phone: '',
      bloodType: 'A_POSITIVE',
      gender: 'MALE',
      address: '',
      dateOfBirth: '',
    });
    
    setActiveTab('registered');
    toast.success('Thêm người hiến máu thành công!')
  };  
  useEffect(() => {
    setDisable(!hasEnoughBlood());
  }, [bloodRequest]);

const hasEnoughBlood = () => {
  if (bloodRequest) {
    let totalBlood = 0;
    bloodRequest.bloodUnits.forEach(unit => {
      totalBlood += unit.volume;
    });

    for (let req of bloodRequest.componentRequests) {
      const requiredVolume = req.volume;
      const availableVolume = totalBlood * getComponentPercentage(req.componentType);
      if (availableVolume < requiredVolume) {
        return false; 
      }
    }

    return true; 
  }
  return false;
}

  // Fetch donors with pagination
  const fetchDonors = async (page = 0) => {
    try {
      const response = await getAllProfile(page, donorsPerPage);
      setDonors(response.content);
      setFilteredDonors(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch donor profiles:', error);
    }
  };

  useEffect(() => {
    fetchDonors(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (bloodRequest) {
      setFilters(prev => ({
        ...prev,
        bloodType: bloodRequest.bloodType
      }));
    }
  }, [bloodRequest]);

  const handleConfirmRequest = async () => {
    await fulfillBloodRequest(bloodRequest);
    router.push("/staffs/emergency-request");
  }
  // Filter and sort donors (client-side for the current page)
  useEffect(() => {
    let result = [...donors];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.personalId?.includes(searchTerm) ||
        donor.phone.includes(searchTerm)
      );
    }
    
    // Apply blood type filter
    if (filters.bloodType !== '*') {
      result = result.filter(donor => donor.bloodType === filters.bloodType);
    }
    
    // Apply gender filter
    if (filters.gender !== '*') {
      result = result.filter(donor => donor.gender === filters.gender);
    }
    
    // Apply availability filter (based on next eligible donation date)
    if (filters.availability !== '*') {
      const today = new Date();
      result = result.filter(donor => {
        const eligibleDate = new Date(donor.nextEligibleDonationDate);
        return filters.availability === 'available' 
          ? eligibleDate <= today 
          : eligibleDate > today;
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredDonors(result);
  }, [donors, searchTerm, filters, sortConfig]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Danh Sách Người Hiến Máu</h1>
        <p className="text-gray-600">{totalElements} người hiến phù hợp</p>
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
          <DonorSearchFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
          />
          {bloodRequest ? (
            <DonorTable 
              donors={filteredDonors}
              handleSort={handleSort}
              sortConfig={sortConfig}
              setActiveTab={setActiveTab}
              setDonor={setDonor}
              bloodRequest={bloodRequest}
            />
          ) : (
            <div className='w-full flex justify-center'>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
            </div>
          )}

          {totalPages > 1 && (
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </TabsContent>
        <TabsContent value="unregistered">
          <AddDonorForm 
            setDonors={setDonors}
            setFilteredDonors={setFilteredDonors}
            setActiveTab={setActiveTab}
            donor={donor}
            bloodRequest={bloodRequest}
            setDonor={setDonor}
            handleAddDonor={handleAddDonor}
            volume={volume}
            setVolume={setVolume}
          />
        </TabsContent>
      </Tabs>
      <div className=' w-full flex justify-center gap-20 mt-5'>
        <Button variant="outline" >Hủy yêu cầu</Button>
        <Button disabled={disable} onClick={handleConfirmRequest}>Xác nhận hoàn tất</Button>
      </div>
    </div>
  );
}