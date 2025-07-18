'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, Clock, Droplet, Plus, Trash2, Loader2, Building2, User, MapPin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import vietnamProvinces from '@/data/vietnam-provinces.json'
import { getEventById, updateEventRequest } from '@/apis/bloodDonation'
import { getActiveOrganizers, createOrganizer, checkEmailExists } from '@/apis/organizer'

// Sort provinces alphabetically
const sortedProvinces = vietnamProvinces.sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }))

// Zod validation schemas
const timeSlotSchema = z.object({
  startTime: z.string()
    .min(1, "Start time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string()
    .min(1, "End time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  maxCapacity: z.number()
    .min(1, "Capacity must be at least 1")
    .max(100, "Capacity cannot exceed 100")
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}:00`)
  const end = new Date(`1970-01-01T${data.endTime}:00`)
  return end > start
}, {
  message: "End time must be after start time",
  path: ["endTime"]
})

const donationEventSchema = z.object({
  name: z.string()
    .min(5, "Event name must be at least 5 characters")
    .max(200, "Event name cannot exceed 200 characters"),
  hospital: z.string()
    .min(3, "Hospital/Location must be at least 3 characters")
    .max(200, "Hospital/Location cannot exceed 200 characters"),
  address: z.string()
    .min(10, "Address must be at least 10 characters")
    .max(300, "Address cannot exceed 300 characters"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().min(1, "Ward is required"),
  donationDate: z.date({
    required_error: "Donation date is required"
  }).refine((date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, "Donation date must be today or in the future"),
  donationType: z.enum(['WHOLE_BLOOD', 'PLASMA', 'PLATELETS', 'RED_BLOOD_CELL'], {
    required_error: "Please select a donation type"
  }),
  totalMemberCount: z.number()
    .min(1, "Total capacity must be at least 1")
    .max(10000, "Total capacity cannot exceed 10000"),
  organizerId: z.string().optional(),
  timeSlots: z.array(timeSlotSchema)
    .min(1, "At least one time slot is required")
    .max(10, "Maximum 10 time slots allowed")
    .refine((timeSlots) => {
      // Check for overlapping time slots
      for (let i = 0; i < timeSlots.length; i++) {
        for (let j = i + 1; j < timeSlots.length; j++) {
          const slot1 = timeSlots[i]
          const slot2 = timeSlots[j]

          const start1 = new Date(`1970-01-01T${slot1.startTime}:00`)
          const end1 = new Date(`1970-01-01T${slot1.endTime}:00`)
          const start2 = new Date(`1970-01-01T${slot2.startTime}:00`)
          const end2 = new Date(`1970-01-01T${slot2.endTime}:00`)

          // Check if slots overlap: start1 < end2 && start2 < end1
          if (start1 < end2 && start2 < end1) {
            return false
          }
        }
      }
      return true
    }, {
      message: "Time slots cannot overlap with each other"
    })
})

const organizerSchema = z.object({
  organizationName: z.string()
    .min(2, "Organization name must be at least 2 characters")
    .max(200, "Organization name cannot exceed 200 characters"),
  contactPersonName: z.string()
    .min(2, "Contact person name must be at least 2 characters")
    .max(100, "Contact person name cannot exceed 100 characters"),
  email: z.string()
    .email("Please provide a valid email address"),
  phoneNumber: z.string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  address: z.string()
    .max(300, "Address cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
  ward: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  description: z.string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  websiteUrl: z.string()
    .url("Please provide a valid website URL")
    .optional()
    .or(z.literal(""))
})

const donationTypes = [
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PLASMA', label: 'Plasma' },
  { value: 'PLATELETS', label: 'Platelets' },
  { value: 'RED_BLOOD_CELL', label: 'Red Blood Cell' },
]

export default function EditDonationEventPage() {
  const router = useRouter()
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingOrganizer, setIsCreatingOrganizer] = useState(false)
  const [organizers, setOrganizers] = useState([])
  const [activeTab, setActiveTab] = useState("event")
  const [organizersLoading, setOrganizersLoading] = useState(true)
  const [eventLoading, setEventLoading] = useState(true)
  const [eventData, setEventData] = useState(null)
  const [error, setError] = useState(null)

  // Event form
  const eventForm = useForm({
    resolver: zodResolver(donationEventSchema),
    defaultValues: {
      name: '',
      hospital: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      donationDate: undefined,
      donationType: 'WHOLE_BLOOD',
      totalMemberCount: 0,
      organizerId: '',
      timeSlots: [
        { startTime: '09:00', endTime: '10:00', maxCapacity: 25 }
      ]
    }
  })

  // Organizer form
  const organizerForm = useForm({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      organizationName: '',
      contactPersonName: '',
      email: '',
      phoneNumber: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      description: '',
      websiteUrl: ''
    }
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: eventForm.control,
    name: "timeSlots"
  })

  const watchedCity = eventForm.watch("city")
  const watchedDistrict = eventForm.watch("district")
  const watchedOrganizerCity = organizerForm.watch("city")
  const watchedOrganizerDistrict = organizerForm.watch("district")
  const watchedTimeSlots = eventForm.watch("timeSlots")

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

  // Load event data and organizers on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) {
        setError('Event ID not found')
        setEventLoading(false)
        return
      }

      try {
        // Load event data and organizers in parallel
        const [eventResponse, organizersResponse] = await Promise.all([
          getEventById(params.id),
          getActiveOrganizers()
        ])

        setEventData(eventResponse)
        setOrganizers(organizersResponse)

        // Populate the form with event data
        populateForm(eventResponse)
        
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load event details')
        toast.error('Failed to load event details')
      } finally {
        setEventLoading(false)
        setOrganizersLoading(false)
      }
    }

    fetchData()
  }, [params?.id])

  // Function to populate form with existing event data
  const populateForm = (event) => {
    // Basic event information
    eventForm.setValue("name", event.name || '')
    eventForm.setValue("hospital", event.hospital || '')
    eventForm.setValue("address", event.address || '')
    eventForm.setValue("city", event.city || '')
    eventForm.setValue("district", event.district || '')
    eventForm.setValue("ward", event.ward || '')
    eventForm.setValue("donationType", event.donationType || 'WHOLE_BLOOD')
    eventForm.setValue("totalMemberCount", event.totalMemberCount || 0)
    eventForm.setValue("organizerId", event.organizerId ? event.organizerId.toString() : '')

    // Parse and set donation date
    if (event.donationDate) {
      try {
        const parsedDate = parseDate(event.donationDate)
        eventForm.setValue("donationDate", parsedDate)
      } catch (error) {
        console.error('Error parsing donation date:', error)
      }
    }

    // Set time slots
    if (event.timeSlotDtos && event.timeSlotDtos.length > 0) {
      const timeSlots = event.timeSlotDtos.map(slot => ({
        startTime: slot.startTime || '09:00',
        endTime: slot.endTime || '10:00',
        maxCapacity: slot.maxCapacity || 25
      }))
      replace(timeSlots)
    }
  }

  // Get districts for selected city (event form)
  const getDistricts = () => {
    const province = sortedProvinces.find(p => p.name === watchedCity)
    return province ? province.districts.sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true })) : []
  }

  // Get wards for selected district (event form)
  const getWards = () => {
    const province = sortedProvinces.find(p => p.name === watchedCity)
    if (!province) return []
    const district = province.districts.find(d => d.name === watchedDistrict)
    return district ? district.wards.sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true })) : []
  }

  // Get districts for organizer form
  const getOrganizerDistricts = () => {
    const province = sortedProvinces.find(p => p.name === watchedOrganizerCity)
    return province ? province.districts.sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true })) : []
  }

  // Get wards for organizer form
  const getOrganizerWards = () => {
    const province = sortedProvinces.find(p => p.name === watchedOrganizerCity)
    if (!province) return []
    const district = province.districts.find(d => d.name === watchedOrganizerDistrict)
    return district ? district.wards.sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true })) : []
  }

  // Reset dependent fields when city changes (event form)
  useEffect(() => {
    eventForm.setValue("district", "")
    eventForm.setValue("ward", "")
  }, [watchedCity, eventForm])

  // Reset ward when district changes (event form)
  useEffect(() => {
    eventForm.setValue("ward", "")
  }, [watchedDistrict, eventForm])

  // Reset dependent fields when city changes (organizer form)
  useEffect(() => {
    organizerForm.setValue("district", "")
    organizerForm.setValue("ward", "")
  }, [watchedOrganizerCity, organizerForm])

  // Reset ward when district changes (organizer form)
  useEffect(() => {
    organizerForm.setValue("ward", "")
  }, [watchedOrganizerDistrict, organizerForm])
  // Calculate total capacity from time slots
    useEffect(() => {
    const totalCapacity = watchedTimeSlots?.reduce((sum, slot) => {
      return sum + (slot.maxCapacity || 0);
    }, 0) || 0;

    eventForm.setValue("totalMemberCount", totalCapacity);
  }, [
    eventForm,
    watchedTimeSlots,
    ...(watchedTimeSlots?.map(slot => slot.maxCapacity) || [])
  ]);

  const handleAddTimeSlot = () => {
    const lastSlot = fields[fields.length - 1]
    let newStartTime = lastSlot ? lastSlot.endTime : '09:00'
    let newEndTime = addMinutes(newStartTime, 60)

    // If the new slot would go past 18:00, start from the next available hour
    if (newEndTime > '18:00') {
      newStartTime = '09:00'
      newEndTime = '10:00'
    }

    append({
      startTime: newStartTime,
      endTime: newEndTime,
      maxCapacity: 25
    })
  }

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, mins + minutes, 0)
    return format(date, 'HH:mm')
  }

  // Helper function to check if two time slots overlap
  const checkTimeSlotConflict = (slot1, slot2) => {
    const start1 = new Date(`1970-01-01T${slot1.startTime}:00`)
    const end1 = new Date(`1970-01-01T${slot1.endTime}:00`)
    const start2 = new Date(`1970-01-01T${slot2.startTime}:00`)
    const end2 = new Date(`1970-01-01T${slot2.endTime}:00`)

    // Check if slots overlap: start1 < end2 && start2 < end1
    return start1 < end2 && start2 < end1
  }

  // Function to get conflicting time slot indices
  const getConflictingSlots = (timeSlots) => {
    const conflicts = new Set()
    for (let i = 0; i < timeSlots.length; i++) {
      for (let j = i + 1; j < timeSlots.length; j++) {
        if (checkTimeSlotConflict(timeSlots[i], timeSlots[j])) {
          conflicts.add(i)
          conflicts.add(j)
        }
      }
    }
    return conflicts
  }

  const loadOrganizers = async () => {
    try {
      setOrganizersLoading(true)
      const data = await getActiveOrganizers()
      setOrganizers(data)
    } catch (error) {
      console.error('Error loading organizers:', error)
      toast.error('Failed to load organizers')
    } finally {
      setOrganizersLoading(false)
    }
  }

  const onSubmitEvent = async (data) => {
    if (!params?.id) {
      toast.error('Event ID not found')
      return
    }

    setIsSubmitting(true)
    try {
      // Get the selected organizer details if organizerId is provided
      let organizerDetails = null
      if (data.organizerId && data.organizerId !== "") {
        const selectedOrganizer = organizers.find(org => org.id.toString() === data.organizerId)
        if (selectedOrganizer) {
          organizerDetails = {
            id: selectedOrganizer.id,
            organizationName: selectedOrganizer.organizationName,
            contactPersonName: selectedOrganizer.contactPersonName,
            email: selectedOrganizer.email,
            phoneNumber: selectedOrganizer.phoneNumber,
            address: selectedOrganizer.address,
            ward: selectedOrganizer.ward,
            district: selectedOrganizer.district,
            city: selectedOrganizer.city,
            description: selectedOrganizer.description,
            websiteUrl: selectedOrganizer.websiteUrl
          }
        }
      }

      // Format the data for the backend
      const eventData = {
        name: data.name,
        hospital: data.hospital,
        address: data.address,
        ward: data.ward,
        district: data.district,
        city: data.city,
        donationDate: format(data.donationDate, 'dd-MM-yyyy'),
        totalMemberCount: data.totalMemberCount,
        donationType: data.donationType,
        organizerId: data.organizerId && data.organizerId !== "" ? parseInt(data.organizerId) : null,
        organizer: organizerDetails,
        timeSlotDtos: data.timeSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          maxCapacity: slot.maxCapacity
        }))
      }

      const response = await updateEventRequest(params.id, eventData)
      toast.success("Blood donation event updation submitted!")
      router.push(`/staffs/donation-event/${params.id}`)
    } catch (error) {
      console.error('Error updating event:', error)

      // Handle different types of API errors
      if (error.response) {
        const { status, data: errorData } = error.response

        switch (status) {
          case 400:
            if (errorData.message) {
              toast.error(`Validation Error: ${errorData.message}`)
            } else if (errorData.errors) {
              Object.entries(errorData.errors).forEach(([field, message]) => {
                eventForm.setError(field, { message })
              })
              toast.error("Please fix the validation errors")
            } else {
              toast.error("Invalid request data")
            }
            break
          case 401:
            toast.error("You are not authorized to update events")
            router.push('/login')
            break
          case 403:
            toast.error("You don't have permission to update events")
            break
          case 404:
            toast.error("Event not found")
            break
          case 409:
            toast.error("An event with this name already exists")
            break
          case 422:
            toast.error("Event data is invalid or conflicts with existing data")
            break
          case 500:
            toast.error("Server error. Please try again later")
            break
          default:
            toast.error(`Error: ${errorData.message || 'Failed to update event'}`)
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection")
      } else {
        toast.error(error.message || "An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitOrganizer = async (data) => {
    setIsCreatingOrganizer(true)
    try {
      // Check if email exists
      const emailExists = await checkEmailExists(data.email)
      if (emailExists) {
        organizerForm.setError("email", { message: "An organizer with this email already exists" })
        return
      }

      // Create organizer
      const organizerData = {
        ...data,
        status: 'ENABLE'
      }

      const newOrganizer = await createOrganizer(organizerData)
      toast.success("Organizer created successfully!")

      // Reload organizers list
      await loadOrganizers()

      // Reset form and switch to event tab
      organizerForm.reset()
      setActiveTab("event")

      // Pre-select the newly created organizer
      eventForm.setValue("organizerId", newOrganizer.id.toString())

    } catch (error) {
      console.error('Error creating organizer:', error)

      if (error.response) {
        const { status, data: errorData } = error.response

        switch (status) {
          case 400:
            if (errorData.errors) {
              Object.entries(errorData.errors).forEach(([field, message]) => {
                organizerForm.setError(field, { message })
              })
              toast.error("Please fix the validation errors")
            } else {
              toast.error(errorData.message || "Invalid request data")
            }
            break
          case 409:
            toast.error("An organizer with this email already exists")
            break
          default:
            toast.error(`Error: ${errorData.message || 'Failed to create organizer'}`)
        }
      } else {
        toast.error(error.message || "An unexpected error occurred")
      }
    } finally {
      setIsCreatingOrganizer(false)
    }
  }

  // Loading state
  if (eventLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading event details...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !eventData) {
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
          onClick={() => router.push('/staffs/donation-event')}
        >
          Back to Events
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Blood Donation Event</h1>
          <p className="text-muted-foreground mt-2">Update the details of "{eventData.name}"</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => router.push(`/staffs/donation-event/${params.id}`)}
        >
          Back to Details
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2" key={activeTab}>
          <TabsTrigger value="event" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            Edit Event
          </TabsTrigger>
          <TabsTrigger value="organizer" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Add Organizer
          </TabsTrigger>
        </TabsList>

        {/* Event Edit Tab */}
        <TabsContent value="event">
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(onSubmitEvent)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-6 w-6 text-red-500" />
                    <span>Event Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={eventForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Blood Donation Drive 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={eventForm.control}
                      name="donationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donation Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select donation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {donationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Organizer Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Organizer (Optional)</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("organizer")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Organizer
                      </Button>
                    </div>

                    <FormField
                      control={eventForm.control}
                      name="organizerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Organizer</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={organizersLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={organizersLoading ? "Loading organizers..." : "Select an organizer (optional)"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="*">No organizer</SelectItem>
                              {organizers.length === 0 ? (
                                <SelectItem value="none" disabled>No organizers found</SelectItem>
                              ) : (
                                organizers.map((organizer) => (
                                  <SelectItem key={organizer.id} value={organizer.id.toString()}>
                                    <div className="flex flex-col items-start">
                                      <span className="font-medium">{organizer.organizationName}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={eventForm.control}
                        name="hospital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hospital/Venue Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Community Center, Hospital, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={eventForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={eventForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/City *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sortedProvinces.map((province) => (
                                  <SelectItem key={province.name} value={province.name}>
                                    {province.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={eventForm.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCity}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={watchedCity ? "Select district" : "Select province first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getDistricts().map((district) => (
                                  <SelectItem key={district.name} value={district.name}>
                                    {district.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={eventForm.control}
                        name="ward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ward *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedDistrict}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={watchedDistrict ? "Select ward" : "Select district first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getWards().map((ward) => (
                                  <SelectItem key={ward.name} value={ward.name}>
                                    {ward.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={eventForm.control}
                      name="donationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={eventForm.control}
                      name="totalMemberCount"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Total Capacity (Auto-calculated) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                readOnly
                                className="bg-muted cursor-not-allowed"
                                value={eventForm.getValues("totalMemberCount") || 0}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">
                              This is automatically calculated from the sum of all time slot capacities
                            </p>
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <Separator />

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Time Slots</h3>
                        <p className="text-sm text-muted-foreground">
                          Total Capacity: {watchedTimeSlots?.reduce((sum, slot) => sum + (slot.maxCapacity || 0), 0) || 0} people
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTimeSlot}
                        disabled={fields.length >= 10}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time Slot
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const conflictingSlots = getConflictingSlots(watchedTimeSlots)
                        const hasConflict = conflictingSlots.has(index)

                        return (
                          <div
                            key={field.id}
                            className={cn(
                              "grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 rounded-lg border-2 transition-colors",
                              hasConflict
                                ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                                : "bg-muted/50 border-transparent"
                            )}
                          >
                            {hasConflict && (
                              <div className="md:col-span-4 mb-2">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  This time slot conflicts with another time slot
                                </div>
                              </div>
                            )}

                            <FormField
                              control={eventForm.control}
                              name={`timeSlots.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Time</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        type="time"
                                        className="pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={eventForm.control}
                              name={`timeSlots.${index}.endTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Time</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        type="time"
                                        className="pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={eventForm.control}
                              name={`timeSlots.${index}.maxCapacity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Max Capacity</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="100"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="space-y-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Time Slots Summary */}
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        {getConflictingSlots(watchedTimeSlots).size > 0 && (
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">
                              {getConflictingSlots(watchedTimeSlots).size} conflicting slots detected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push(`/staffs/donation-event/${params.id}`)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Event...
                      </>
                    ) : (
                      'Update Event'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        {/* Organizer Creation Tab */}
        <TabsContent value="organizer">
          <Form {...organizerForm}>
            <form onSubmit={organizerForm.handleSubmit(onSubmitOrganizer)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-500" />
                    <span>Add New Organizer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={organizerForm.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Red Cross Vietnam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizerForm.control}
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={organizerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@organization.org" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="0123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={organizerForm.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              placeholder="https://www.organization.org"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={organizerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the organization and its mission..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information (Optional)
                    </h3>

                    <FormField
                      control={organizerForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Organization Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={organizerForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/City</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sortedProvinces.map((province) => (
                                  <SelectItem key={province.name} value={province.name}>
                                    {province.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={organizerForm.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedOrganizerCity}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={watchedOrganizerCity ? "Select district" : "Select province first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getOrganizerDistricts().map((district) => (
                                  <SelectItem key={district.name} value={district.name}>
                                    {district.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={organizerForm.control}
                        name="ward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ward</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedOrganizerDistrict}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={watchedOrganizerDistrict ? "Select ward" : "Select district first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getOrganizerWards().map((ward) => (
                                  <SelectItem key={ward.name} value={ward.name}>
                                    {ward.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setActiveTab("event")}
                    disabled={isCreatingOrganizer}
                  >
                    Back to Event
                  </Button>
                  <Button type="submit" disabled={isCreatingOrganizer}>
                    {isCreatingOrganizer ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Organizer...
                      </>
                    ) : (
                      'Create Organizer'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
