'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLanguage } from '@/context/language_context'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, CalendarDays, Clock, Droplet, User, Building2, Loader2, Edit, Trash2, Users, Phone, Search, FileText, Save, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { getEventById, deleteEventRequest, getEventDonors, recordDonations, registerForEventOffline, registerGuestForEvent } from '@/apis/bloodDonation'
import { getProfileByPersonalId } from '@/apis/user'
import { convertBloodType } from '@/utils/utils'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'
import React from 'react'
import vietnamProvinces from '@/data/vietnam-provinces.json'

// Survey form components for offline registration
const FormRadioGroup = ({ value, onValueChange, children, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue: value,
            onValueChange
          });
        }
        return child;
      })}
    </div>
  );
};

const FormRadioItem = ({ value, id, selectedValue, onValueChange, children, className = "" }) => {
  const isSelected = selectedValue === value;

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
      } ${className}`}
      onClick={() => onValueChange && onValueChange(value)}>
      <div className="relative mt-1">
        <input
          type="radio"
          id={id}
          value={value}
          checked={isSelected}
          onChange={() => onValueChange && onValueChange(value)}
          className="sr-only"
        />
        <div className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${isSelected
            ? 'border-red-600 bg-red-600'
            : 'border-gray-300 bg-white'
          }`}>
          {isSelected && (
            <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <label htmlFor={id} className="text-sm cursor-pointer block">
          {children}
        </label>
      </div>
    </div>
  );
};

export default function StaffEventDetailPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const params = useParams()

  // Status mapping with translations
  const statusMap = {
    PENDING: { label: t?.staffEventDetail?.status?.pending || 'Pending', variant: 'secondary' },
    APPROVED: { label: t?.staffEventDetail?.status?.approved || 'Approved', variant: 'default' },
    ONGOING: { label: t?.staffEventDetail?.status?.ongoing || 'Ongoing', variant: 'default' },
    COMPLETED: { label: t?.staffEventDetail?.status?.completed || 'Completed', variant: 'success' },
    CANCELLED: { label: t?.staffEventDetail?.status?.cancelled || 'Cancelled', variant: 'destructive' },
    REJECTED: { label: t?.staffEventDetail?.status?.rejected || 'Rejected', variant: 'destructive' }
  }

  // Donation type mapping with translations
  const donationTypeMap = {
    WHOLE_BLOOD: t?.staffEventDetail?.donationTypes?.wholeBlood || 'Whole Blood',
    PLATELET: t?.staffEventDetail?.donationTypes?.platelet || 'Platelet',
    PLASMA: t?.staffEventDetail?.donationTypes?.plasma || 'Plasma',
    RED_BLOOD_CELL: t?.staffEventDetail?.donationTypes?.redBloodCell || 'Red Blood Cell'
  }

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [donorListModal, setDonorListModal] = useState(false)
  const [donors, setDonors] = useState([])
  const [filteredDonors, setFilteredDonors] = useState([])
  const [donorSearchTerm, setDonorSearchTerm] = useState('')
  const [donorsLoading, setDonorsLoading] = useState(false)
  const [donorsPagination, setDonorsPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })
  // Report donation states
  const [reportModal, setReportModal] = useState(false)
  const [reportDonors, setReportDonors] = useState([])
  const [reportLoading, setReportLoading] = useState(false)

  // Offline registration states
  const [offlineRegistrationModal, setOfflineRegistrationModal] = useState(false)
  const [offlineRegistrationLoading, setOfflineRegistrationLoading] = useState(false)
  const [personalId, setPersonalId] = useState('')
  const [searchedProfile, setSearchedProfile] = useState(null)
  const [profileSearchLoading, setProfileSearchLoading] = useState(false)
  const [surveyAnswers, setSurveyAnswers] = useState({})
  const [surveyOtherTexts, setSurveyOtherTexts] = useState({})
  const [registrationMode, setRegistrationMode] = useState('existing') // 'existing' or 'new'
  const [newGuestProfile, setNewGuestProfile] = useState({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    bloodType: 'O_POSITIVE',
    gender: 'MALE',
    dateOfBirth: '',
    personalId: ''
  })

  // Location selection state
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [availableDistricts, setAvailableDistricts] = useState([])
  const [availableWards, setAvailableWards] = useState([])

  // Report modal pagination and filtering
  const [filteredReportDonors, setFilteredReportDonors] = useState([])
  const [reportFilter, setReportFilter] = useState('ALL') // ALL, NO_VOLUME, HAS_VOLUME
  const [reportSearchTerm, setReportSearchTerm] = useState('')
  const [reportPagination, setReportPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!params?.id) {
        setError('Event ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getEventById(params.id)
        setEvent(response)
      } catch (error) {
        console.error('Error fetching event details:', error)
        setError(t?.staffEventDetail?.eventNotFound || 'Failed to load event details')
        toast.error(t?.staffEventDetail?.eventNotFound || 'Failed to load event details')
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [params?.id])

  // Filter donors based on search term
  useEffect(() => {
    if (!donorSearchTerm.trim()) {
      setFilteredDonors(donors)
    } else {
      const filtered = donors.filter(donor => {
        const searchLower = donorSearchTerm.toLowerCase()
        return (
          donor.name?.toLowerCase().includes(searchLower) ||
          donor.phone?.toLowerCase().includes(searchLower) ||
          donor.address?.toLowerCase().includes(searchLower) ||
          donor.city?.toLowerCase().includes(searchLower) ||
          donor.district?.toLowerCase().includes(searchLower) ||
          donor.ward?.toLowerCase().includes(searchLower)
        )
      })
      setFilteredDonors(filtered)
    }
  }, [donors, donorSearchTerm])

  // Filter report donors based on search term and volume status
  useEffect(() => {
    let filtered = [...reportDonors]

    // Apply search filter
    if (reportSearchTerm.trim()) {
      const searchLower = reportSearchTerm.toLowerCase()
      filtered = filtered.filter(donor => {
        return (
          donor.name?.toLowerCase().includes(searchLower) ||
          donor.phone?.toLowerCase().includes(searchLower) ||
          donor.address?.toLowerCase().includes(searchLower) ||
          donor.city?.toLowerCase().includes(searchLower) ||
          donor.district?.toLowerCase().includes(searchLower) ||
          donor.ward?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Apply volume filter
    if (reportFilter === 'NO_VOLUME') {
      filtered = filtered.filter(donor => !donor.volume || donor.volume <= 0)
    } else if (reportFilter === 'HAS_VOLUME') {
      filtered = filtered.filter(donor => donor.volume && donor.volume > 0)
    }

    setFilteredReportDonors(filtered)

    // Update pagination
    setReportPagination(prev => ({
      ...prev,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.size),
      page: 0 // Reset to first page when filter changes
    }))
  }, [reportDonors, reportSearchTerm, reportFilter])

  // Handle edit event
  const handleEditEvent = () => {
    router.push(`/staffs/donation-event/${params.id}/edit`)
  }

  // Handle delete event
  const handleDeleteEvent = () => {
    setDeleteDialog(true)
  }

  // Confirm delete event
  const confirmDeleteEvent = async () => {
    if (!params?.id) return

    setIsDeleting(true)
    try {
      await deleteEventRequest(params.id)
      toast.success(t?.staffEventDetail?.messages?.deleteRequestSubmitted || 'Delete request has been submitted successfully!')
      setDeleteDialog(false)
      // Navigate back to events list
      router.push('/staffs/donation-event/list')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error(t?.staffEventDetail?.messages?.deleteRequestFailed || 'Failed to submit delete request. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle view donor list
  const handleViewDonors = () => {
    setDonorListModal(true)
    fetchDonors()
  }

  // Handle offline registration
  const handleOfflineRegistration = () => {
    setOfflineRegistrationModal(true)
    setPersonalId('')
    setSearchedProfile(null)
    setSurveyAnswers({})
    setSurveyOtherTexts({})
    setRegistrationMode('existing')
    setNewGuestProfile({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      bloodType: 'O_POSITIVE',
      gender: 'MALE',
      dateOfBirth: '',
      personalId: ''
    })
    // Reset location selection
    setSelectedCity('')
    setSelectedDistrict('')
    setSelectedWard('')
    setAvailableDistricts([])
    setAvailableWards([])
  }

  // Handle offline registration submission
  const handleOfflineRegistrationSubmit = async () => {
    if (registrationMode === 'existing') {
      // Existing profile registration
      if (!personalId.trim()) {
        toast.error(t?.staffEventDetail?.messages?.personalIdRequired || 'Personal ID is required')
        return
      }

      if (!searchedProfile) {
        toast.error(t?.staffEventDetail?.messages?.profileSearchRequired || 'Please search and select a valid profile first')
        return
      }
    } else {
      // New guest registration
      if (!newGuestProfile.name.trim() || !newGuestProfile.phone.trim() || !newGuestProfile.personalId.trim()) {
        toast.error(t?.staffEventDetail?.messages?.guestProfileRequired || 'Name, phone, and personal ID are required for new guest registration')
        return
      }
    }

    try {
      setOfflineRegistrationLoading(true)

      // Create form data in the same format as online registration
      const formData = {
        experience: surveyAnswers.experience || '',
        experienceDetails: surveyOtherTexts.experience || '',
        currentIllness: surveyAnswers.current_illness || '',
        currentIllnessDetails: surveyOtherTexts.current_illness || '',
        pastDiseases: surveyAnswers.past_diseases || '',
        pastDiseasesDetails: surveyOtherTexts.past_diseases || '',
        recentActivities: surveyAnswers.recent_activities || '',
        recentActivitiesDetails: surveyOtherTexts.recent_activities || '',
        answers: surveyAnswers,
        otherText: surveyOtherTexts,
        submittedAt: new Date().toISOString(),
        registrationType: registrationMode === 'existing' ? 'offline' : 'guest',
        profileInfo: registrationMode === 'existing' ? {
          name: searchedProfile.name,
          phone: searchedProfile.phone,
          bloodType: searchedProfile.bloodType,
          gender: searchedProfile.gender,
          address: searchedProfile.address,
          personalId: personalId.trim()
        } : {
          name: newGuestProfile.name,
          phone: newGuestProfile.phone,
          bloodType: newGuestProfile.bloodType,
          gender: newGuestProfile.gender,
          address: newGuestProfile.address,
          personalId: newGuestProfile.personalId
        }
      }

      // Create ProfileWithFormResponseDto structure
      const profileWithFormData = {
        profile: registrationMode === 'existing' ? {
          id: searchedProfile.id || null,
          accountId: searchedProfile.accountId || null,
          name: searchedProfile.name || '',
          phone: searchedProfile.phone || '',
          address: searchedProfile.address || '',
          ward: searchedProfile.ward || '',
          district: searchedProfile.district || '',
          city: searchedProfile.city || '',
          bloodType: searchedProfile.bloodType || 'O_POSITIVE',
          gender: searchedProfile.gender || 'MALE',
          dateOfBirth: searchedProfile.dateOfBirth || null,
          lastDonationDate: searchedProfile.lastDonationDate || null,
          nextEligibleDonationDate: searchedProfile.nextEligibleDonationDate || null,
          status: searchedProfile.status || 'ACTIVE',
          personalId: personalId.trim()
        } : {
          id: null,
          accountId: null,
          name: newGuestProfile.name,
          phone: newGuestProfile.phone,
          address: newGuestProfile.address,
          ward: newGuestProfile.ward,
          district: newGuestProfile.district,
          city: newGuestProfile.city,
          bloodType: newGuestProfile.bloodType,
          gender: newGuestProfile.gender,
          dateOfBirth: newGuestProfile.dateOfBirth || null,
          lastDonationDate: null,
          nextEligibleDonationDate: null,
          status: 'ACTIVE',
          personalId: newGuestProfile.personalId
        },
        jsonForm: JSON.stringify(formData)
      }

      // Use appropriate API based on registration mode
      if (registrationMode === 'existing') {
        await registerForEventOffline(params.id, personalId.trim(), JSON.stringify(formData))
        toast.success(t?.staffEventDetail?.messages?.offlineRegistrationSuccess || 'Successfully registered offline participant!')
      } else {
        await registerGuestForEvent(params.id, profileWithFormData)
        toast.success(t?.staffEventDetail?.messages?.guestRegistrationSuccess || 'Successfully registered new guest participant!')
      }

      setOfflineRegistrationModal(false)
      setPersonalId('')
      setSearchedProfile(null)
      setSurveyAnswers({})
      setSurveyOtherTexts({})
      setRegistrationMode('existing')
      setNewGuestProfile({
        name: '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        city: '',
        bloodType: 'O_POSITIVE',
        gender: 'MALE',
        dateOfBirth: '',
        personalId: ''
      })

      // Refresh event details to update registration count
      const response = await getEventById(params.id)
      setEvent(response)

    } catch (error) {
      console.error('Error registering participant:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        const errorMessage = registrationMode === 'existing' 
          ? (t?.staffEventDetail?.messages?.offlineRegistrationFailed || 'Failed to register offline participant. Please try again.')
          : (t?.staffEventDetail?.messages?.guestRegistrationFailed || 'Failed to register guest participant. Please try again.')
        toast.error(errorMessage)
      }
    } finally {
      setOfflineRegistrationLoading(false)
    }
  }

  // Survey answer handlers
  const handleSurveyAnswerChange = (questionId, value) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSurveyTextChange = (questionId, value) => {
    setSurveyOtherTexts(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // Profile search handler
  const handleProfileSearch = async () => {
    if (!personalId.trim()) {
      toast.error(t?.staffEventDetail?.messages?.personalIdRequired || 'Personal ID is required')
      return
    }

    try {
      setProfileSearchLoading(true)
      const profileData = await getProfileByPersonalId(personalId.trim())

      if (profileData && profileData.length > 0) {
        setSearchedProfile(profileData[0]) // Take the first profile if multiple exist
        toast.success(t?.staffEventDetail?.messages?.profileFound || 'Profile found successfully!')
      } else {
        setSearchedProfile(null)
        toast.error(t?.staffEventDetail?.messages?.profileNotFound || 'No profile found with this Personal ID')
      }
    } catch (error) {
      console.error('Error searching profile:', error)
      setSearchedProfile(null)
      toast.error(t?.staffEventDetail?.messages?.profileSearchError || 'Error searching for profile. Please try again.')
    } finally {
      setProfileSearchLoading(false)
    }
  }

  // Handle personal ID input change
  const handlePersonalIdChange = (value) => {
    setPersonalId(value)
    if (searchedProfile) {
      setSearchedProfile(null) // Clear previous search when ID changes
    }
  }

  // Handle new guest profile changes
  const handleNewGuestProfileChange = (field, value) => {
    setNewGuestProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle location selection
  const handleCityChange = (cityName) => {
    setSelectedCity(cityName)
    setSelectedDistrict('')
    setSelectedWard('')
    
    // Find the selected city and update available districts
    const city = vietnamProvinces.find(province => province.name === cityName)
    setAvailableDistricts(city ? city.districts : [])
    setAvailableWards([])
    
    // Update the guest profile
    handleNewGuestProfileChange('city', cityName)
    handleNewGuestProfileChange('district', '')
    handleNewGuestProfileChange('ward', '')
  }

  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName)
    setSelectedWard('')
    
    // Find the selected district and update available wards
    const city = vietnamProvinces.find(province => province.name === selectedCity)
    const district = city?.districts.find(dist => dist.name === districtName)
    setAvailableWards(district ? district.wards : [])
    
    // Update the guest profile
    handleNewGuestProfileChange('district', districtName)
    handleNewGuestProfileChange('ward', '')
  }

  const handleWardChange = (wardName) => {
    setSelectedWard(wardName)
    handleNewGuestProfileChange('ward', wardName)
  }

  // Handle registration mode change
  const handleRegistrationModeChange = (mode) => {
    setRegistrationMode(mode)
    // Clear form data when switching modes
    setPersonalId('')
    setSearchedProfile(null)
    setNewGuestProfile({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      bloodType: 'O_POSITIVE',
      gender: 'MALE',
      dateOfBirth: '',
      personalId: ''
    })
    // Reset location selection
    setSelectedCity('')
    setSelectedDistrict('')
    setSelectedWard('')
    setAvailableDistricts([])
    setAvailableWards([])
  }

  // Fetch donors for the event
  const fetchDonors = async (page = 0, size = 10) => {
    if (!params?.id) return

    try {
      setDonorsLoading(true)
      const response = await getEventDonors(params.id, page, size)

      console.log('Donors API response:', response) // Debug log
      if (response && response.content && Array.isArray(response.content)) {
        setDonors(response.content)
        setFilteredDonors(response.content) // Initialize filtered donors
        setDonorsPagination({
          page: response.number || 0,
          size: response.size || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0
        })
      } else {
        console.warn('Unexpected response structure:', response)
        setDonors([])
        setFilteredDonors([])
        setDonorsPagination({
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0
        })
      }
    } catch (error) {
      console.error('Error fetching donors:', error)
      toast.error(t?.staffEventDetail?.messages?.donorListFailed || 'Failed to load donor list')
      setDonors([])
      setFilteredDonors([])
    } finally {
      setDonorsLoading(false)
    }
  }
  // Handle donor pagination
  const handleDonorPageChange = (newPage) => {
    fetchDonors(newPage, donorsPagination.size)
  }

  // Handle report finished event
  const handleReportFinishedEvent = async () => {
    try {
      setReportLoading(true)

      // Get all donors for the event
      const response = await getEventDonors(params.id, 0, 1000) // Get all donors
      const allDonors = response.content || []

      if (allDonors.length === 0) {
        toast.error(t?.staffEventDetail?.reportModal?.noDonors || 'No registered donors found for this event')
        return
      }      // Initialize report donors with default volume
      const initialReportDonors = allDonors.map(donor => ({
        ...donor,
        volume: 0 // Default blood donation volume in ml
      }))

      setReportDonors(initialReportDonors)
      setFilteredReportDonors(initialReportDonors)

      // Initialize pagination
      setReportPagination({
        page: 0,
        size: 10,
        totalElements: initialReportDonors.length,
        totalPages: Math.ceil(initialReportDonors.length / 10)
      })

      // Reset filters
      setReportFilter('ALL')
      setReportSearchTerm('')

      setReportModal(true)
    } catch (error) {
      console.error('Error fetching donors for report:', error)
      toast.error(t?.staffEventDetail?.messages?.reportFailed || 'Failed to load donor list for reporting')
    } finally {
      setReportLoading(false)
    }
  }
  // Handle volume change for individual donor
  const handleVolumeChange = (donorId, volume) => {
    setReportDonors(prev =>
      prev.map(donor =>
        donor.id === donorId ? { ...donor, volume: parseFloat(volume) || 0 } : donor
      )
    )
  }

  // Handle report pagination
  const handleReportPageChange = (newPage) => {
    setReportPagination(prev => ({ ...prev, page: newPage }))
  }

  // Handle report page size change
  const handleReportPageSizeChange = (newSize) => {
    const size = parseInt(newSize)
    setReportPagination(prev => ({
      ...prev,
      size,
      page: 0,
      totalPages: Math.ceil(filteredReportDonors.length / size)
    }))
  }

  // Submit donation report
  const handleSubmitReport = async () => {
    try {
      setReportLoading(true)

      // Validate volumes
      const invalidDonors = reportDonors.filter(donor => !donor.volume || donor.volume <= 0)
      if (invalidDonors.length > 0) {
        toast.error(t?.staffEventDetail?.messages?.volumeValidation || 'Please enter valid volumes for all donors (greater than 0)')
        return
      }

      // Create donation records
      const donationRecords = reportDonors.map(donor => ({
        profileId: donor.id,
        volume: donor.volume
      }))

      // Record the donations
      await recordDonations(params.id, donationRecords)

      toast.success(t?.staffEventDetail?.messages?.reportSuccess?.replace('{count}', reportDonors.length) || `Successfully recorded donations for ${reportDonors.length} donors`)

      // Close modal and refresh event data
      setReportModal(false)

      // Refresh event details
      const response = await getEventById(params.id)
      setEvent(response)

    } catch (error) {
      console.error('Error submitting donation report:', error)
      if (error.response?.data?.message) {
        toast.error(t?.staffEventDetail?.messages?.reportError?.replace('{error}', error.response.data.message) || `Failed to record donations: ${error.response.data.message}`)
      } else {
        toast.error(t?.staffEventDetail?.messages?.reportErrorGeneric || 'Failed to record donations. Please try again.')
      }
    } finally {
      setReportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t?.staffEventDetail?.loading || 'Loading event details...'}</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Event not found'}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/staffs/donation-event/list')}
        >
          Back to Events
        </Button>
      </div>
    )
  }
  // Helper function to parse different date formats
  const parseDate = (dateString) => {
    if (!dateString) return new Date()

    // Try ISO format first (YYYY-MM-DD or full ISO string)
    if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        return parseISO(dateString)
      } catch (error) {
        console.warn('Failed to parse ISO date:', dateString)
      }
    }

    // Try DD-MM-YYYY format
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      try {
        const [day, month, year] = dateString.split('-')
        return new Date(year, month - 1, day) // month is 0-indexed
      } catch (error) {
        console.warn('Failed to parse DD-MM-YYYY date:', dateString)
      }
    }

    // Try MM/DD/YYYY format
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      try {
        return new Date(dateString)
      } catch (error) {
        console.warn('Failed to parse MM/DD/YYYY date:', dateString)
      }
    }

    // Fallback to Date constructor
    try {
      return new Date(dateString)
    } catch (error) {
      console.error('Failed to parse date:', dateString, error)
      return new Date() // Return current date as fallback
    }
  }

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'

    try {
      const birthDate = parseDate(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age
    } catch (error) {
      console.error('Error calculating age:', error)
      return 'N/A'
    }
  }

  // Helper function to check if today is the donation date
  const isToday = (dateString) => {
    try {
      const donationDate = parseDate(dateString)
      const today = new Date()

      return (
        donationDate.getDate() === today.getDate() &&
        donationDate.getMonth() === today.getMonth() &&
        donationDate.getFullYear() === today.getFullYear()
      )
    } catch (error) {
      console.error('Error checking if date is today:', error)
      return false
    }
  }

  // Helper function to check if all time slots have ended
  const hasAllTimeSlotsEnded = () => {
    try {
      if (!event?.timeSlotDtos || event.timeSlotDtos.length === 0) {
        return false
      }

      const now = new Date()
      const today = new Date()
      const donationDate = parseDate(event.donationDate)

      // If donation date is not today, check if it's in the past
      if (!isToday(event.donationDate)) {
        return donationDate < today
      }

      // If donation date is today, check if latest time slot has ended
      const latestEndTime = event.timeSlotDtos.reduce((latest, slot) => {
        // Parse time string (assuming format like "14:30" or "2:30 PM")
        const timeString = slot.endTime
        if (!timeString) return latest

        // Handle different time formats
        let hours, minutes
        if (timeString.includes('PM') || timeString.includes('AM')) {
          // 12-hour format
          const [time, period] = timeString.split(' ')
          const [h, m] = time.split(':').map(Number)
          hours = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h)
          minutes = m
        } else {
          // 24-hour format
          const [h, m] = timeString.split(':').map(Number)
          hours = h
          minutes = m
        }

        const slotEndTime = new Date(donationDate)
        slotEndTime.setHours(hours, minutes, 0, 0)

        return slotEndTime > latest ? slotEndTime : latest
      }, new Date(0)) // Start with epoch time

      return now > latestEndTime
    } catch (error) {
      console.error('Error checking if time slots have ended:', error)
      return false
    }
  }

  const formattedDate = (() => {
    try {
      return format(parseDate(event.donationDate), 'MMMM do, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return event.donationDate || 'Date not available'
    }
  })()

  const fullAddress = [event.address, event.ward, event.district, event.city]
    .filter(Boolean)
    .join(', ')
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex gap-4">
          <Badge variant={statusMap[event.status]?.variant || 'secondary'}>
            {statusMap[event.status]?.label || event.status}
          </Badge>
          <Button
            variant="outline"
            onClick={() => router.push('/staffs/donation-event/list')}
          >
            {t?.staffEventDetail?.backToEvents || 'Back to Events'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t?.staffEventDetail?.eventOverview || 'Event Overview'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t?.staffEventDetail?.location || 'Location'}</h3>
                <p className="font-semibold">{event.hospital}</p>
                {fullAddress && (
                  <p className="text-muted-foreground text-sm">{fullAddress}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CalendarDays className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t?.staffEventDetail?.date || 'Date'}</h3>
                <p>{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Droplet className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t?.staffEventDetail?.donationType || 'Donation Type'}</h3>
                <p>{donationTypeMap[event.donationType] || event.donationType}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <User className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t?.staffEventDetail?.registrationStatus || 'Registration Status'}</h3>
                <p>
                  <span className="font-semibold text-red-600">{event.registeredMemberCount || 0}</span>
                  <span className="text-muted-foreground"> / {event.totalMemberCount} {t?.staffEventDetail?.registered || 'registered'}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.totalMemberCount - (event.registeredMemberCount || 0)} {t?.staffEventDetail?.spotsRemaining || 'spots remaining'}
                </p>
              </div>
            </div>

            {event.organizer && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <Building2 className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="font-medium">{t?.staffEventDetail?.organizerInfo || 'Organizer Information'}</h3>
                    <div className="space-y-1">
                      <p className="font-semibold">{event.organizer.organizationName}</p>
                      <p className="text-sm">{t?.staffEventDetail?.contact || 'Contact'}: {event.organizer.contactPersonName}</p>
                      <p className="text-sm text-muted-foreground">{t?.staffEventDetail?.email || 'Email'}: {event.organizer.email}</p>
                      <p className="text-sm text-muted-foreground">{t?.staffEventDetail?.phone || 'Phone'}: {event.organizer.phoneNumber}</p>
                      {event.organizer.websiteUrl && (
                        <p className="text-sm text-muted-foreground">
                          {t?.staffEventDetail?.website || 'Website'}: <a href={event.organizer.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {event.organizer.websiteUrl}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t?.staffEventDetail?.eventManagement || 'Event Management'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.status === 'AVAILABLE' && <Button className="w-full" onClick={handleEditEvent}>
              <Edit className="h-4 w-4 mr-2" />
              {t?.staffEventDetail?.editEventDetails || 'Edit Event Details'}
            </Button>}
            <Button variant="outline" className="w-full" onClick={handleViewDonors}>
              <Users className="h-4 w-4 mr-2" />
              {t?.staffEventDetail?.viewDonorList || 'View Donor List'}
            </Button>

            {event.status === 'AVAILABLE' && isToday(event.donationDate) && (
              <Button variant="outline" className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200" onClick={handleOfflineRegistration}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t?.staffEventDetail?.registerOffline || 'Register Offline'}
              </Button>
            )}

            {event.status === 'AVAILABLE' && (event.registeredMemberCount || 0) > 0 && hasAllTimeSlotsEnded() && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleReportFinishedEvent}
                disabled={reportLoading}
              >
                <FileText className="h-4 w-4 mr-2" />
                {reportLoading ? (t?.staffEventDetail?.loading || 'Loading...') : (t?.staffEventDetail?.reportFinishedEvent || 'Report Finished Event')}
              </Button>
            )}

            {(event.status === 'PENDING' || event.status === 'APPROVED') && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteEvent}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? (t?.staffEventDetail?.submitting || 'Submitting...') : (t?.staffEventDetail?.requestDeletion || 'Request Deletion')}
              </Button>
            )}
          </CardContent>
        </Card>        {/* Time Slots */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{t?.staffEventDetail?.scheduledTimeSlots || 'Scheduled Time Slots'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.timeSlotDtos && event.timeSlotDtos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.timeSlotDtos.map((slot, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </h3>
                      <Badge variant="outline">
                        {t?.staffEventDetail?.capacity || 'Capacity'}: {slot.maxCapacity}
                      </Badge>
                    </div>                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t?.staffEventDetail?.availableSlots || 'Available slots'}</span>
                      <span>{slot.currentRegistrations || 0}/{slot.maxCapacity} {t?.staffEventDetail?.registered || 'registered'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t?.staffEventDetail?.noTimeSlots || 'No time slots scheduled for this event'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Event Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t?.staffEventDetail?.deleteDialog?.title || 'Submit Delete Request'}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {t?.staffEventDetail?.deleteDialog?.description?.replace('{eventName}', event?.name) || `Are you sure you want to submit a delete request for "${event?.name}"? This will create a deletion request that needs to be approved by an administrator.`}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog(false)} disabled={isDeleting}>
              {t?.staffEventDetail?.deleteDialog?.cancel || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t?.staffEventDetail?.submitting || 'Submitting...'}
                </>
              ) : (
                t?.staffEventDetail?.deleteDialog?.confirm || 'Submit Delete Request'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Donor List Modal */}
      <Dialog open={donorListModal} onOpenChange={setDonorListModal}>
        <DialogContent className="min-w-2/3 max-h-[80vh] overflow-hidden top-[25vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t?.staffEventDetail?.donorList?.title || 'Registered Donors'} - {event?.name}
            </DialogTitle>
            <DialogDescription>
              {t?.staffEventDetail?.donorList?.description?.replace('{count}', donorsPagination.totalElements) || `${donorsPagination.totalElements} donors registered for this event`}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            {donorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>{t?.staffEventDetail?.donorList?.loading || 'Loading donors...'}</span>
              </div>) : donors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">{t?.staffEventDetail?.donorList?.noDonors || 'No donors registered yet'}</p>
                  <p className="text-sm">{t?.staffEventDetail?.donorList?.noDonorsDescription || 'Registered donors will appear here once they sign up for this event'}</p>
                </div>
              ) : (
              <>
                {/* Search bar for donors */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder={t?.staffEventDetail?.donorList?.searchPlaceholder || "Search donors by name, phone, address, or location..."}
                      value={donorSearchTerm}
                      onChange={(e) => setDonorSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {donorSearchTerm && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {t?.staffEventDetail?.donorList?.showing?.replace('{filtered}', filteredDonors.length)?.replace('{total}', donors.length) || `Showing ${filteredDonors.length} of ${donors.length} donors`}
                    </div>
                  )}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.name || 'Name'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.phone || 'Phone'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.address || 'Address'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.bloodType || 'Blood Type'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.gender || 'Gender'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.age || 'Age'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.donorList?.table?.status || 'Status'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>
                          <div className="font-medium">
                            {donor.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {donor.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{donor.address || 'N/A'}</div>
                            {(donor.ward || donor.district || donor.city) && (
                              <div className="text-muted-foreground">
                                {[donor.ward, donor.district, donor.city].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {convertBloodType(donor.bloodType) || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {donor.gender || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {calculateAge(donor.dateOfBirth)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            {donor.status || 'Registered'}
                          </Badge>
                        </TableCell>
                        <TableCell>

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination for donors - hide when searching */}
                {!donorSearchTerm && donorsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {t?.staffEventDetail?.donorList?.pagination?.showing
                        ?.replace('{start}', donorsPagination.page * donorsPagination.size + 1)
                        ?.replace('{end}', Math.min((donorsPagination.page + 1) * donorsPagination.size, donorsPagination.totalElements))
                        ?.replace('{total}', donorsPagination.totalElements)
                        || `Showing ${donorsPagination.page * donorsPagination.size + 1} to ${Math.min((donorsPagination.page + 1) * donorsPagination.size, donorsPagination.totalElements)} of ${donorsPagination.totalElements} donors`}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDonorPageChange(donorsPagination.page - 1)}
                        disabled={donorsPagination.page === 0 || donorsLoading}
                      >
                        {t?.staffEventDetail?.donorList?.pagination?.previous || 'Previous'}
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, donorsPagination.totalPages) }, (_, i) => {
                          let pageNumber
                          if (donorsPagination.totalPages <= 5) {
                            pageNumber = i
                          } else if (donorsPagination.page < 3) {
                            pageNumber = i
                          } else if (donorsPagination.page > donorsPagination.totalPages - 4) {
                            pageNumber = donorsPagination.totalPages - 5 + i
                          } else {
                            pageNumber = donorsPagination.page - 2 + i
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={pageNumber === donorsPagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDonorPageChange(pageNumber)}
                              disabled={donorsLoading}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber + 1}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDonorPageChange(donorsPagination.page + 1)}
                        disabled={donorsPagination.page >= donorsPagination.totalPages - 1 || donorsLoading}
                      >
                        {t?.staffEventDetail?.donorList?.pagination?.next || 'Next'}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Report Donation Modal */}
      <Dialog open={reportModal} onOpenChange={setReportModal}>
        <DialogContent className="min-w-4/5 max-h-[80vh] overflow-hidden top-[20vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t?.staffEventDetail?.reportModal?.title || 'Report Finished Event'} - {event?.name}
            </DialogTitle>
            <DialogDescription>
              {t?.staffEventDetail?.reportModal?.description || 'Enter the donation volume for each donor (in ml). You can filter by volume status and paginate through the list.'}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-auto">
            {reportDonors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t?.staffEventDetail?.reportModal?.noDonors || 'No donors to report'}</p>
              </div>
            ) : (
              <>
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder={t?.staffEventDetail?.reportModal?.searchPlaceholder || "Search donors by name, phone, address..."}
                      value={reportSearchTerm}
                      onChange={(e) => setReportSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={reportFilter} onValueChange={setReportFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t?.staffEventDetail?.reportModal?.filterBy || "Filter by volume"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t?.staffEventDetail?.reportModal?.filterAll || 'All Donors'}</SelectItem>
                      <SelectItem value="NO_VOLUME">{t?.staffEventDetail?.reportModal?.filterNoVolume || 'No Volume Entered'}</SelectItem>
                      <SelectItem value="HAS_VOLUME">{t?.staffEventDetail?.reportModal?.filterHasVolume || 'Volume Entered'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={reportPagination.size.toString()}
                    onValueChange={handleReportPageSizeChange}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Summary */}
                <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                  <div>
                    {t?.staffEventDetail?.reportModal?.showingFiltered
                      ?.replace('{showing}', Math.min(filteredReportDonors.length, reportPagination.size))
                      ?.replace('{filtered}', filteredReportDonors.length)
                      || `Showing ${Math.min(filteredReportDonors.length, reportPagination.size)} of ${filteredReportDonors.length} donors`}
                    {reportFilter !== 'ALL' && ` ${t?.staffEventDetail?.reportModal?.filteredFrom?.replace('{total}', reportDonors.length) || `(filtered from ${reportDonors.length} total)`}`}
                  </div>
                  <div>
                    {reportFilter === 'NO_VOLUME' && (t?.staffEventDetail?.reportModal?.donorsWithoutVolume?.replace('{count}', reportDonors.filter(d => !d.volume || d.volume <= 0).length) || `${reportDonors.filter(d => !d.volume || d.volume <= 0).length} donors without volume`)}
                    {reportFilter === 'HAS_VOLUME' && (t?.staffEventDetail?.reportModal?.donorsWithVolume?.replace('{count}', reportDonors.filter(d => d.volume && d.volume > 0).length) || `${reportDonors.filter(d => d.volume && d.volume > 0).length} donors with volume`)}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t?.staffEventDetail?.reportModal?.table?.name || 'Name'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.reportModal?.table?.phone || 'Phone'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.reportModal?.table?.bloodType || 'Blood Type'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.reportModal?.table?.gender || 'Gender'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.reportModal?.table?.age || 'Age'}</TableHead>
                      <TableHead>{t?.staffEventDetail?.reportModal?.table?.volume || 'Volume (ml)'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReportDonors
                      .slice(
                        reportPagination.page * reportPagination.size,
                        (reportPagination.page + 1) * reportPagination.size
                      )
                      .map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell>
                            <div className="font-medium">
                              {donor.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {donor.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {convertBloodType(donor.bloodType) || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {donor.gender || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {calculateAge(donor.dateOfBirth)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="1000"
                                step="50"
                                value={donor.volume || ''}
                                onChange={(e) => handleVolumeChange(donor.id, e.target.value)}
                                className="w-24"
                                placeholder="450"
                              />
                              {donor.volume > 0 && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {reportPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {t?.staffEventDetail?.reportModal?.pagination?.showing
                        ?.replace('{start}', reportPagination.page * reportPagination.size + 1)
                        ?.replace('{end}', Math.min((reportPagination.page + 1) * reportPagination.size, filteredReportDonors.length))
                        ?.replace('{total}', filteredReportDonors.length)
                        || `Showing ${reportPagination.page * reportPagination.size + 1} to ${Math.min((reportPagination.page + 1) * reportPagination.size, filteredReportDonors.length)} of ${filteredReportDonors.length} donors`}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportPageChange(reportPagination.page - 1)}
                        disabled={reportPagination.page === 0}
                      >
                        {t?.staffEventDetail?.reportModal?.pagination?.previous || 'Previous'}
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, reportPagination.totalPages) }, (_, i) => {
                          let pageNumber
                          if (reportPagination.totalPages <= 5) {
                            pageNumber = i
                          } else if (reportPagination.page < 3) {
                            pageNumber = i
                          } else if (reportPagination.page > reportPagination.totalPages - 4) {
                            pageNumber = reportPagination.totalPages - 5 + i
                          } else {
                            pageNumber = reportPagination.page - 2 + i
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={pageNumber === reportPagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleReportPageChange(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber + 1}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportPageChange(reportPagination.page + 1)}
                        disabled={reportPagination.page >= reportPagination.totalPages - 1}
                      >
                        {t?.staffEventDetail?.reportModal?.pagination?.next || 'Next'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Summary and Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div>{t?.staffEventDetail?.reportModal?.summary?.totalDonors?.replace('{count}', reportDonors.length) || `Total donors: ${reportDonors.length}`}</div>
                    <div>
                      {t?.staffEventDetail?.reportModal?.summary?.volumesEntered
                        ?.replace('{entered}', reportDonors.filter(d => d.volume && d.volume > 0).length)
                        ?.replace('{total}', reportDonors.length)
                        || `Volumes entered: ${reportDonors.filter(d => d.volume && d.volume > 0).length} / ${reportDonors.length}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setReportModal(false)}
                      disabled={reportLoading}
                    >
                      {t?.staffEventDetail?.reportModal?.actions?.cancel || 'Cancel'}
                    </Button>
                    <Button
                      onClick={handleSubmitReport}
                      disabled={reportLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {reportLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t?.staffEventDetail?.submitting || 'Submitting...'}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t?.staffEventDetail?.reportModal?.actions?.submit?.replace('{count}', reportDonors.filter(d => d.volume && d.volume > 0).length) || `Submit Report (${reportDonors.filter(d => d.volume && d.volume > 0).length} donors)`}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Offline Registration Modal */}
      <Dialog open={offlineRegistrationModal} onOpenChange={setOfflineRegistrationModal}>
        <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {t?.staffEventDetail?.registration?.title || 'Register Participant'}
            </DialogTitle>
            <DialogDescription>
              {t?.staffEventDetail?.registration?.description || 'Register a participant for this donation event either by searching existing profiles or creating a new guest profile.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Registration Mode Toggle */}
            <div className="space-y-3">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleRegistrationModeChange('existing')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    registrationMode === 'existing'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t?.staffEventDetail?.registration?.modes?.existing || 'Existing Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRegistrationModeChange('new')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    registrationMode === 'new'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t?.staffEventDetail?.registration?.modes?.newGuest || 'New Guest'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {registrationMode === 'existing' 
                  ? (t?.staffEventDetail?.registration?.modeHelp?.existing || 'Search for existing profiles in the database')
                  : (t?.staffEventDetail?.registration?.modeHelp?.newGuest || 'Create a new guest profile for first-time participants')
                }
              </p>
            </div>
            {/* Existing Profile Search */}
            {registrationMode === 'existing' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t?.staffEventDetail?.registration?.personalIdLabel || 'Personal ID / National ID'} *
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={t?.staffEventDetail?.registration?.personalIdPlaceholder || 'Enter personal ID or national ID number'}
                      value={personalId}
                      onChange={(e) => handlePersonalIdChange(e.target.value)}
                      disabled={offlineRegistrationLoading || profileSearchLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleProfileSearch}
                      disabled={!personalId.trim() || offlineRegistrationLoading || profileSearchLoading}
                      variant="outline"
                      className="px-4"
                    >
                      {profileSearchLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t?.staffEventDetail?.registration?.personalIdHelp || "Enter the participant's ID and click search to find their profile"}
                  </p>
                </div>

                {/* Profile Search Result */}
                {searchedProfile && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-green-800">
                          {t?.staffEventDetail?.registration?.profileFound || 'Profile Found'}
                        </h4>
                        <div className="mt-2 space-y-1 text-xs text-green-700">
                          <div><span className="font-medium">Name:</span> {searchedProfile.name}</div>
                          <div><span className="font-medium">Phone:</span> {searchedProfile.phone}</div>
                          <div><span className="font-medium">Blood Type:</span> {searchedProfile.bloodType}</div>
                          <div><span className="font-medium">Gender:</span> {searchedProfile.gender}</div>
                          {searchedProfile.address && (
                            <div><span className="font-medium">Address:</span> {searchedProfile.address}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {personalId.trim() && !searchedProfile && !profileSearchLoading && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700">
                      {t?.staffEventDetail?.registration?.searchRequired || 'Please click the search button to find the profile'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* New Guest Profile Form */}
            {registrationMode === 'new' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t?.staffEventDetail?.registration?.guestProfileTitle || 'Guest Profile Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.name || 'Full Name'} *
                    </label>
                    <Input
                      type="text"
                      placeholder={t?.staffEventDetail?.registration?.placeholders?.name || 'Enter full name'}
                      value={newGuestProfile.name}
                      onChange={(e) => handleNewGuestProfileChange('name', e.target.value)}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.phone || 'Phone Number'} *
                    </label>
                    <Input
                      type="tel"
                      placeholder={t?.staffEventDetail?.registration?.placeholders?.phone || 'Enter phone number'}
                      value={newGuestProfile.phone}
                      onChange={(e) => handleNewGuestProfileChange('phone', e.target.value)}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.personalId || 'Personal ID'} *
                    </label>
                    <Input
                      type="text"
                      placeholder={t?.staffEventDetail?.registration?.placeholders?.personalId || 'Enter personal ID'}
                      value={newGuestProfile.personalId}
                      onChange={(e) => handleNewGuestProfileChange('personalId', e.target.value)}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.dateOfBirth || 'Date of Birth'}
                    </label>
                    <Input
                      type="date"
                      value={newGuestProfile.dateOfBirth}
                      onChange={(e) => handleNewGuestProfileChange('dateOfBirth', e.target.value)}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.bloodType || 'Blood Type'}
                    </label>
                    <Select 
                      value={newGuestProfile.bloodType} 
                      onValueChange={(value) => handleNewGuestProfileChange('bloodType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O_POSITIVE">O+</SelectItem>
                        <SelectItem value="O_NEGATIVE">O-</SelectItem>
                        <SelectItem value="A_POSITIVE">A+</SelectItem>
                        <SelectItem value="A_NEGATIVE">A-</SelectItem>
                        <SelectItem value="B_POSITIVE">B+</SelectItem>
                        <SelectItem value="B_NEGATIVE">B-</SelectItem>
                        <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                        <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.gender || 'Gender'}
                    </label>
                    <Select 
                      value={newGuestProfile.gender} 
                      onValueChange={(value) => handleNewGuestProfileChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">{t?.staffEventDetail?.registration?.genders?.male || 'Male'}</SelectItem>
                        <SelectItem value="FEMALE">{t?.staffEventDetail?.registration?.genders?.female || 'Female'}</SelectItem>
                        <SelectItem value="OTHER">{t?.staffEventDetail?.registration?.genders?.other || 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t?.staffEventDetail?.registration?.fields?.address || 'Address'}
                  </label>
                  <Input
                    type="text"
                    placeholder={t?.staffEventDetail?.registration?.placeholders?.address || 'Enter street address'}
                    value={newGuestProfile.address}
                    onChange={(e) => handleNewGuestProfileChange('address', e.target.value)}
                    disabled={offlineRegistrationLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.city || 'City'} *
                    </label>
                    <Select 
                      value={selectedCity} 
                      onValueChange={handleCityChange}
                      disabled={offlineRegistrationLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t?.staffEventDetail?.registration?.placeholders?.city || 'Select city'} />
                      </SelectTrigger>
                      <SelectContent>
                        {vietnamProvinces.map((province) => (
                          <SelectItem key={province.name} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.district || 'District'} *
                    </label>
                    <Select 
                      value={selectedDistrict} 
                      onValueChange={handleDistrictChange}
                      disabled={offlineRegistrationLoading || !selectedCity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedCity 
                            ? (t?.staffEventDetail?.registration?.placeholders?.selectCityFirst || 'Select city first')
                            : (t?.staffEventDetail?.registration?.placeholders?.district || 'Select district')
                        } />
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
                    <label className="text-sm font-medium">
                      {t?.staffEventDetail?.registration?.fields?.ward || 'Ward'} *
                    </label>
                    <Select 
                      value={selectedWard} 
                      onValueChange={handleWardChange}
                      disabled={offlineRegistrationLoading || !selectedDistrict}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedDistrict 
                            ? (t?.staffEventDetail?.registration?.placeholders?.selectDistrictFirst || 'Select district first')
                            : (t?.staffEventDetail?.registration?.placeholders?.ward || 'Select ward')
                        } />
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
              </div>
            )}

            {/* Survey Questions */}
            {((registrationMode === 'existing' && searchedProfile) || registrationMode === 'new') && (
              <div className="space-y-6 max-h-96 overflow-y-auto border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t?.staffEventDetail?.registration?.surveyTitle || 'Health Survey Questions'}
                </h3>

              {/* Experience Question */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t?.staffEventDetail?.offlineRegistration?.questions?.experience || '1. Has the participant donated blood before?'}
                </Label>
                <FormRadioGroup
                  value={surveyAnswers.experience}
                  onValueChange={(value) => handleSurveyAnswerChange('experience', value)}
                >
                  <FormRadioItem value="yes" id="exp-yes">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.yes || 'Yes, has donated blood before'}
                  </FormRadioItem>
                  <FormRadioItem value="no" id="exp-no">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.no || 'No, first time donating'}
                  </FormRadioItem>
                </FormRadioGroup>

                {surveyAnswers.experience === 'yes' && (
                  <div className="mt-3">
                    <Label htmlFor="exp-details" className="text-xs font-medium">
                      {t?.staffEventDetail?.offlineRegistration?.detailsLabel || 'Please describe the experience:'}
                    </Label>
                    <Textarea
                      id="exp-details"
                      placeholder={t?.staffEventDetail?.offlineRegistration?.detailsPlaceholder || 'e.g. Donated 3 times, last time was 6 months ago...'}
                      value={surveyOtherTexts.experience || ''}
                      onChange={(e) => handleSurveyTextChange('experience', e.target.value)}
                      className="mt-1"
                      rows={2}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>
                )}
              </div>

              {/* Current Health Question */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t?.staffEventDetail?.offlineRegistration?.questions?.currentHealth || '2. Does the participant currently have any health issues?'}
                </Label>
                <FormRadioGroup
                  value={surveyAnswers.current_illness}
                  onValueChange={(value) => handleSurveyAnswerChange('current_illness', value)}
                >
                  <FormRadioItem value="yes" id="illness-yes">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.hasIllness || 'Yes, has health issues'}
                  </FormRadioItem>
                  <FormRadioItem value="no" id="illness-no">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.healthy || 'No, completely healthy'}
                  </FormRadioItem>
                </FormRadioGroup>

                {surveyAnswers.current_illness === 'yes' && (
                  <div className="mt-3">
                    <Label htmlFor="illness-details" className="text-xs font-medium">
                      {t?.staffEventDetail?.offlineRegistration?.healthDetailsLabel || 'Please describe current health condition:'}
                    </Label>
                    <Textarea
                      id="illness-details"
                      placeholder={t?.staffEventDetail?.offlineRegistration?.healthDetailsPlaceholder || 'Describe the health condition...'}
                      value={surveyOtherTexts.current_illness || ''}
                      onChange={(e) => handleSurveyTextChange('current_illness', e.target.value)}
                      className="mt-1"
                      rows={2}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>
                )}
              </div>

              {/* Past Diseases Question */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t?.staffEventDetail?.offlineRegistration?.questions?.pastDiseases || '3. Has the participant ever had any serious diseases?'}
                </Label>
                <FormRadioGroup
                  value={surveyAnswers.past_diseases}
                  onValueChange={(value) => handleSurveyAnswerChange('past_diseases', value)}
                >
                  <FormRadioItem value="yes" id="past-yes">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.hadSeriousDisease || 'Yes, had serious diseases'}
                  </FormRadioItem>
                  <FormRadioItem value="no" id="past-no">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.noSeriousDisease || 'No, never had serious diseases'}
                  </FormRadioItem>
                </FormRadioGroup>

                {surveyAnswers.past_diseases === 'yes' && (
                  <div className="mt-3">
                    <Label htmlFor="past-details" className="text-xs font-medium">
                      {t?.staffEventDetail?.offlineRegistration?.pastDiseasesLabel || 'Please list the diseases:'}
                    </Label>
                    <Textarea
                      id="past-details"
                      placeholder={t?.staffEventDetail?.offlineRegistration?.pastDiseasesPlaceholder || 'e.g. High blood pressure, diabetes, heart disease...'}
                      value={surveyOtherTexts.past_diseases || ''}
                      onChange={(e) => handleSurveyTextChange('past_diseases', e.target.value)}
                      className="mt-1"
                      rows={2}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>
                )}
              </div>

              {/* Recent Activities Question */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t?.staffEventDetail?.offlineRegistration?.questions?.recentActivities || '4. In the past 3 months, has the participant had any of the following activities?'}
                </Label>
                <FormRadioGroup
                  value={surveyAnswers.recent_activities}
                  onValueChange={(value) => handleSurveyAnswerChange('recent_activities', value)}
                >
                  <FormRadioItem value="yes" id="activities-yes">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.hadActivities || 'Yes (surgery, vaccination, tattoo, etc.)'}
                  </FormRadioItem>
                  <FormRadioItem value="no" id="activities-no">
                    {t?.staffEventDetail?.offlineRegistration?.answers?.noSpecialActivities || 'No special activities'}
                  </FormRadioItem>
                </FormRadioGroup>

                {surveyAnswers.recent_activities === 'yes' && (
                  <div className="mt-3">
                    <Label htmlFor="activities-details" className="text-xs font-medium">
                      {t?.staffEventDetail?.offlineRegistration?.activitiesLabel || 'Please describe the activities:'}
                    </Label>
                    <Textarea
                      id="activities-details"
                      placeholder={t?.staffEventDetail?.offlineRegistration?.activitiesPlaceholder || 'Describe activities in the past 3 months...'}
                      value={surveyOtherTexts.recent_activities || ''}
                      onChange={(e) => handleSurveyTextChange('recent_activities', e.target.value)}
                      className="mt-1"
                      rows={2}
                      disabled={offlineRegistrationLoading}
                    />
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setOfflineRegistrationModal(false)}
                disabled={offlineRegistrationLoading}
              >
                {t?.staffEventDetail?.registration?.actions?.cancel || 'Cancel'}
              </Button>
              <Button
                onClick={handleOfflineRegistrationSubmit}
                disabled={
                  offlineRegistrationLoading ||
                  (registrationMode === 'existing' && (!personalId.trim() || !searchedProfile || profileSearchLoading)) ||
                  (registrationMode === 'new' && (!newGuestProfile.name || !newGuestProfile.phone || !newGuestProfile.personalId || !selectedCity || !selectedDistrict || !selectedWard))
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {offlineRegistrationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t?.staffEventDetail?.submitting || 'Submitting...'}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {registrationMode === 'existing' 
                      ? (t?.staffEventDetail?.registration?.actions?.registerExisting || 'Register Participant')
                      : (t?.staffEventDetail?.registration?.actions?.registerGuest || 'Register Guest')
                    }
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}