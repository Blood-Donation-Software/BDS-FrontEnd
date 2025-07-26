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
import { getAllProfilesOrderedByDistance, getProfilesWithinDistance, getProfilesWithinDistanceAsProfileDto } from '@/apis/profileDistance';
import { useBloodRequests } from '@/context/bloodRequest_context';
import { Button } from '@/components/ui/button';
import { addBloodRequestDonor, fulfillBloodRequest } from '@/apis/bloodrequest';
import { toast } from 'sonner';

export default function DonorListPage() {
  const router = useRouter();
  const { bloodRequest, setBloodRequest } = useBloodRequests();
  const [donor, setDonor] = useState({
    id: null,
    name: '',
    personalId: '',
    phone: '',
    bloodType: 'A_POSITIVE',
    gender: 'MALE',
    address: '',
    ward: '',
    district: '',
    city: '',
    dateOfBirth: '',
  }); 
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bloodType: '*',
    availability: '*',
    gender: '*',
    maxDistance: 50 // Default max distance in km
  });
  const [distanceEnabled, setDistanceEnabled] = useState(false);
  const [distanceProfiles, setDistanceProfiles] = useState([]);
  const [loadingDistance, setLoadingDistance] = useState(false);
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

  // Helper function to convert backend date format (yyyy-MM-dd) to frontend format (dd-MM-yyyy)
  const convertBackendDateToFrontend = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleAddDonor = async () => {  
    // Convert date format from dd-MM-yyyy to yyyy-MM-dd for backend
    const convertDateFormat = (dateString) => {
      if (!dateString) return null;
      const [day, month, year] = dateString.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Prepare donor data with proper date format
    const donorData = {
      ...donor,
      dateOfBirth: convertDateFormat(donor.dateOfBirth),
      lastDonationDate: donor.lastDonationDate ? convertDateFormat(donor.lastDonationDate) : null,
      nextEligibleDonationDate: donor.nextEligibleDonationDate ? convertDateFormat(donor.nextEligibleDonationDate) : null,
    };

    const bloodUnit = {
      "volume": volume,
      "bloodType": bloodRequest.bloodType,
      "componentType": "WHOLE_BLOOD",
      "status": "COMPLETED",
      "profileId": donorData.id ? donorData.id : null,
    }

    const updated = await addBloodRequestDonor(bloodRequest, bloodUnit, donorData);
    setBloodRequest({ ...updated }); // shallow clone to force state change


    setDonor({
      id: null,
      name: '',
      personalId: '',
      phone: '',
      bloodType: 'A_POSITIVE',
      gender: 'MALE',
      address: '',
      ward: '',
      district: '',
      city: '',
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
      
      // Ensure address fields are properly formatted
      const donorProfiles = response.content.map(profile => ({
        ...profile,
        address: profile.address || '',
        ward: profile.ward || '',
        district: profile.district || '',
        city: profile.city || '',
        // Convert date format if needed (backend sends yyyy-MM-dd, frontend expects dd-MM-yyyy)
        dateOfBirth: profile.dateOfBirth ? convertBackendDateToFrontend(profile.dateOfBirth) : '',
        lastDonationDate: profile.lastDonationDate ? convertBackendDateToFrontend(profile.lastDonationDate) : '',
        nextEligibleDonationDate: profile.nextEligibleDonationDate ? convertBackendDateToFrontend(profile.nextEligibleDonationDate) : '',
      }));
      
      setDonors(donorProfiles);
      setFilteredDonors(donorProfiles);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch donor profiles:', error);
    }
  };

  // Fetch donors by distance with pagination
  const fetchDonorsByDistance = async (maxDistance, page = 0) => {
    try {
      setLoadingDistance(true);
      const response = await getProfilesWithinDistanceAsProfileDto(maxDistance, page, donorsPerPage);
      
      // The response now contains ProfileDto objects with distance information
      const donorProfiles = response.content.map(profile => ({
        ...profile,
        // Ensure address fields are properly formatted
        address: profile.address || '',
        ward: profile.ward || '',
        district: profile.district || '',
        city: profile.city || '',
        // Distance fields are already included in ProfileDto from backend
        distance: profile.distanceInKilometers,
        distanceText: profile.distanceText,
        durationText: profile.durationText,
        // Convert date format if needed (backend sends yyyy-MM-dd, frontend expects dd-MM-yyyy)
        dateOfBirth: profile.dateOfBirth ? convertBackendDateToFrontend(profile.dateOfBirth) : '',
        lastDonationDate: profile.lastDonationDate ? convertBackendDateToFrontend(profile.lastDonationDate) : '',
        nextEligibleDonationDate: profile.nextEligibleDonationDate ? convertBackendDateToFrontend(profile.nextEligibleDonationDate) : '',
      }));
      setDonors(donorProfiles);
      setFilteredDonors(donorProfiles);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error) {
      console.error('Failed to fetch donors by distance:', error);
      toast.error('Failed to load donors by distance');
    } finally {
      setLoadingDistance(false);
    }
  };

  // Enhanced fetch function that handles both regular and distance-based fetching
  const fetchDonorsWithFilters = async (page = 0) => {
    if (distanceEnabled) {
      await fetchDonorsByDistance(filters.maxDistance, page);
    } else {
      await fetchDonors(page);
    }
  };

  useEffect(() => {
    fetchDonorsWithFilters(currentPage);
  }, [currentPage]); // Removed distanceEnabled from dependency array

  // Initial data loading
  useEffect(() => {
    fetchDonorsWithFilters(0);
  }, []); // Run once on component mount

  useEffect(() => {
    // Only fetch when distanceEnabled changes, not on every render
    if (distanceEnabled) {
      setCurrentPage(0); // Reset to first page when distance changes
      fetchDonorsByDistance(filters.maxDistance, 0);
    } else {
      // Fetch regular donors when distance is disabled
      fetchDonors(0);
      setCurrentPage(0);
    }
  }, [distanceEnabled]); // Only depend on distanceEnabled

  // Handle distance filter changes
  useEffect(() => {
    if (distanceEnabled) {
      setCurrentPage(0); // Reset to first page when distance changes
      fetchDonorsByDistance(filters.maxDistance, 0);
    }
  }, [filters.maxDistance]); // Only depend on maxDistance, not distanceEnabled

  useEffect(() => {
    if (bloodRequest && bloodRequest.bloodType !== filters.bloodType) {
      setFilters(prev => ({
        ...prev,
        bloodType: bloodRequest.bloodType
      }));
    }
  }, [bloodRequest?.bloodType]); // Only depend on bloodType, not the entire bloodRequest object

  const handleConfirmRequest = async () => {
    await fulfillBloodRequest(bloodRequest);
    toast.success('Yêu cầu hiến máu đã được xác nhận!');
    router.push("/staffs/emergency-request/list");
  }
  // Filter and sort donors (client-side for the current page)
  useEffect(() => {
    if (donors.length === 0) return; // Don't filter if no donors
    
    let result = [...donors];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(donor => 
        donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.personalId?.includes(searchTerm) ||
        donor.phone?.includes(searchTerm)
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
        if (!donor.nextEligibleDonationDate) return filters.availability === 'available';
        const eligibleDate = new Date(donor.nextEligibleDonationDate);
        return filters.availability === 'available' 
          ? eligibleDate <= today 
          : eligibleDate > today;
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredDonors(result);
  }, [donors, searchTerm, filters.bloodType, filters.gender, filters.availability, sortConfig.key, sortConfig.direction]);

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
    <div className="w-full px-6 py-6">
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
            distanceEnabled={distanceEnabled}
            setDistanceEnabled={setDistanceEnabled}
            loadingDistance={loadingDistance}
          />
          {bloodRequest ? (
            <DonorTable 
              donors={filteredDonors}
              handleSort={handleSort}
              sortConfig={sortConfig}
              setActiveTab={setActiveTab}
              setDonor={setDonor}
              bloodRequest={bloodRequest}
              distanceEnabled={distanceEnabled}
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