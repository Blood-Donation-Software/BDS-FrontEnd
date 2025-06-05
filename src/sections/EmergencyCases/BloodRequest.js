'use client'

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useBloodRequests } from "@/context/bloodRequest_context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function BloodRequest() {
  const { bloodRequests } = useBloodRequests()

  const getUrgencyBadge = (urgency) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium"
    if (urgency === 'high') {
      return `${baseClasses} bg-red-100 text-red-800`
    } else if (urgency === 'medium') {
      return `${baseClasses} bg-orange-100 text-orange-800`
    } else if (urgency === 'low') {
      return `${baseClasses} bg-blue-100 text-blue-800`
    }
    return baseClasses
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium"
    if (status === 'Pending') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    } else if (status === 'Canceled') {
      return `${baseClasses} bg-green-100 text-green-800`
    } else if (status === 'Completed') {
      return `${baseClasses} bg-red-100 text-red-800`
    }
    return baseClasses
  }

  return (
    <main className="flex-1 p-6">
    <div className="bg-white rounded border border-gray-200 overflow-x-auto">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {bloodRequests?.map((request) => (
            <TableRow key={request.id}>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.bloodType}</TableCell>
                <TableCell>{request.volume}</TableCell>
                <TableCell>
                <span className={getUrgencyBadge(request.urgency)}>
                    {request.urgency}
                </span>
                </TableCell>
                <TableCell>
                <span className={getStatusBadge(request.status)}>
                    {request.status}
                </span>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
    </main>
  )
}
