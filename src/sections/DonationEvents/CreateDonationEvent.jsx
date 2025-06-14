'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon, Clock, MapPin, Droplet, Plus, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"


export default function CreateDonationEventPage() {
  const router = useRouter()
  const [date, setDate] = useState()
  const [event, setEvent] = useState({
    name: '',
    location: '',
    description: '',
    donationDate: '',
    donationType: 'WHOLE_BLOOD',
    status: 'PENDING',
    totalMemberCount: 50,
    timeSlots: [
      { startTime: '09:00', endTime: '10:00', maxCapacity: 10 },
      { startTime: '10:00', endTime: '11:00', maxCapacity: 15 }
    ]
  })

  const donationTypes = [
    { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
    { value: 'PLASMA', label: 'Plasma' },
    { value: 'PLATELETS', label: 'Platelets' },
    { value: 'DOUBLE_RED_CELLS', label: 'Double Red Cells' }
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
          maxCapacity: 10 
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
      const [hours, minutes] = (value).split(':').map(Number)
      const endTime = new Date()
      endTime.setHours(hours, minutes + 60, 0)
      newTimeSlots[index].endTime = format(endTime, 'HH:mm')
    }
    
    setEvent({ ...event, timeSlots: newTimeSlots })
  }

  const validateForm = () => {
    if (!event.name) {
      toast({
        title: "Error",
        description: "Event name is required",
        variant: "destructive",
      })
      return false
    }
    if (!event.location) {
      toast({
        title: "Error",
        description: "Location is required",
        variant: "destructive",
      })
      return false
    }
    if (!event.donationDate) {
      toast({
        title: "Error",
        description: "Date is required",
        variant: "destructive",
      })
      return false
    }
    if (event.timeSlots.length === 0) {
      toast({
        title: "Error",
        description: "At least one time slot is required",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const newEvent = {
      ...event,
      registeredMemberCount: 0,
      accountId: 1, // From auth context
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      timeSlotDtos: event.timeSlots.map((slot, index) => ({
        ...slot,
        currentRegistrations: 0,
        id: index + 1,
        eventId: Date.now() // Temporary ID
      }))
    }
    
    console.log('Submitting event:', newEvent)
    toast({
      title: "Success",
      description: "Blood donation event created successfully!",
    })
    // router.push('/blood-donation-events')
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
                  placeholder="Community Blood Drive"
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
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Downtown Health Center, 123 Wellness St."
                    className="pl-10"
                    value={event.location}
                    onChange={(e) => setEvent({...event, location: e.target.value})}
                  />
                </div>
              </div>
            
            <div className='space-y-2'>
              <label>Donation Date *</label>
                    <div className='w-[50%]'>
                        <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-2">
                            <CalendarIcon className="text-muted-foreground" />
                            <Input
                                readOnly
                                className="cursor-pointer"
                            />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="" align="start">
                            <Calendar/>
                        </PopoverContent>
                        </Popover>
                    </div>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Event details and instructions for donors..."
                  value={event.description}
                  onChange={(e) => setEvent({
                    ...event, 
                    description: e.target.value
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
                          disabled
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