'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon, Clock, MapPin, Droplet, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"

// Import or fetch your Vietnam provinces data
import vietnamProvinces from '@/data/vietnam-provinces.json'
import { createEvent } from '@/apis/bloodDonation'

export default function CreateDonationEventPage() {
  const router = useRouter()
  const [date, setDate] = useState()
  const [event, setEvent] = useState({
    name: '',
    location: 'City Hospital',
    address: '123 Street',
    ward: '',
    district: '',
    city: '',
    donationDate: '',
    totalMemberCount: 6,
    status: 'PENDING',
    donationType: 'WHOLE_BLOOD',
    timeSlots: [
      { startTime: '09:00', endTime: '10:00', maxCapacity: 4 },
      { startTime: '10:00', endTime: '11:00', maxCapacity: 2 }
    ]
  })

  // State for available districts and wards based on selection
  const [availableDistricts, setAvailableDistricts] = useState([])
  const [availableWards, setAvailableWards] = useState([])

  // Initialize cities from the JSON data
  const cities = vietnamProvinces.map(province => ({
    value: province.name,
    label: province.name
  }))

  // Update districts when city changes
  useEffect(() => {
    if (event.city) {
      const selectedCity = vietnamProvinces.find(p => p.name === event.city)
      if (selectedCity) {
        const districts = selectedCity.districts.map(district => ({
          value: district.name,
          label: district.name
        }))
        setAvailableDistricts(districts)
        setEvent(prev => ({ ...prev, district: '', ward: '' }))
      }
    }
  }, [event.city])

  // Update wards when district changes
  useEffect(() => {
    if (event.city && event.district) {
      const selectedCity = vietnamProvinces.find(p => p.name === event.city)
      if (selectedCity) {
        const selectedDistrict = selectedCity.districts.find(d => d.name === event.district)
        if (selectedDistrict) {
          const wards = selectedDistrict.wards.map(ward => ({
            value: ward.name,
            label: ward.name
          }))
          setAvailableWards(wards)
          setEvent(prev => ({ ...prev, ward: '' }))
        }
      }
    }
  }, [event.district, event.city])

  const donationTypes = [
    { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
    { value: 'PLATELETS', label: 'Platelets' },
  ]

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return
    setDate(selectedDate)
    setEvent({
      ...event,
      donationDate: format(selectedDate, 'dd-MM-yyyy')
    })
  }

  const handleAddTimeSlot = () => {
    const lastSlot = event.timeSlots[event.timeSlots.length - 1]
    const newEndTime = lastSlot ? add30Minutes(lastSlot.endTime) : '09:00'
    
    setEvent({
      ...event,
      timeSlots: [
        ...event.timeSlots,
        { 
          startTime: newEndTime, 
          endTime: add30Minutes(newEndTime), 
          maxCapacity: 2
        }
      ]
    })
  }

  const add30Minutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes + 30, 0)
    return format(date, 'HH:mm')
  }

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = [...event.timeSlots]
    newTimeSlots.splice(index, 1)
    setEvent({ ...event, timeSlots: newTimeSlots })
  }

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...event.timeSlots]
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value }
    
    if (field === 'startTime') {
      const [hours, minutes] = value.split(':').map(Number)
      const endTime = new Date()
      endTime.setHours(hours, minutes + 60, 0)
      newTimeSlots[index].endTime = format(endTime, 'HH:mm')
    }
    
    setEvent({ ...event, timeSlots: newTimeSlots })
  }

  const validateForm = () => {
    if (!event.name) {
      toast.error("Event name is required")
      return false
    }
    if (!event.location) {
      toast.error("Location is required")
      return false
    }
    if (!event.donationDate) {
      toast.error("Date is required")
      return false
    }
    if (event.timeSlots.length === 0) {
      toast.error("At least one time slot is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const requestData = {
      name: event.name,
      location: event.location,
      address: event.address,
      ward: event.ward,
      district: event.district,
      city: event.city,
      donationDate: event.donationDate,
      totalMemberCount: event.totalMemberCount,
      status: 'PENDING',
      donationType: event.donationType,
      timeSlotDtos: event.timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxCapacity: slot.maxCapacity
      }))
    }

    const data = await createEvent(requestData);

    toast.success("Blood donation event created successfully!")
    router.push(`/blood-donation-events/${data.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Blood Donation Event</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-6 w-6 text-red-500" />
              <span>Event Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  placeholder="Blood Donation Drive 2024"
                  value={event.name}
                  onChange={(e) => setEvent({...event, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donationType">Donation Type</Label>
                <Select
                  value={event.donationType}
                  onValueChange={(value) => setEvent({...event, donationType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select donation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={event.location}
                  onChange={(e) => setEvent({...event, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={event.address}
                  onChange={(e) => setEvent({...event, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>City *</Label>
                <Select
                  value={event.city}
                  onValueChange={(value) => setEvent({...event, city: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>District *</Label>
                <Select
                  value={event.district}
                  onValueChange={(value) => setEvent({...event, district: value})}
                  disabled={!event.city}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={event.city ? "Select district" : "Select city first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district.value} value={district.value}>
                        {district.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ward *</Label>
                <Select
                  value={event.ward}
                  onValueChange={(value) => setEvent({...event, ward: value})}
                  disabled={!event.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={event.district ? "Select ward" : "Select district first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWards.map((ward) => (
                      <SelectItem key={ward.value} value={ward.value}>
                        {ward.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            
              <div className="space-y-2">
                <Label>Donation Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMemberCount">Total Capacity</Label>
                <Input
                  id="totalMemberCount"
                  type="number"
                  min="1"
                  value={event.totalMemberCount}
                  onChange={(e) => setEvent({
                    ...event, 
                    totalMemberCount: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Time Slots</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddTimeSlot}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>

              <div className="space-y-4">
                {event.timeSlots.map((slot, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          value={slot.startTime}
                          onChange={(e) => 
                            handleTimeSlotChange(index, 'startTime', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          value={slot.endTime}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Max Capacity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={slot.maxCapacity}
                        onChange={(e) => 
                          handleTimeSlotChange(
                            index, 
                            'maxCapacity', 
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveTimeSlot(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push('/blood-donation-events')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}