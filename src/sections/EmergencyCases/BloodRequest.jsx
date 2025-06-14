'use client'

import { useBloodRequests } from "@/context/bloodRequest_context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Archive, Clock, PlusCircle, ArrowUpDown } from "lucide-react"
import { convertBloodType } from "@/utils/utils"
import { useState } from "react"

export default function BloodRequest() {
  const { bloodRequests } = useBloodRequests()
  const [sortConfig, setSortConfig] = useState({ key: 'urgency', direction: 'desc' })

  // Sorting function
  const sortRequests = (requests) => {
    if (!requests) return []
    
    const sortedRequests = [...requests]
    sortedRequests.sort((a, b) => {
      // Urgency priority: HIGH > MEDIUM > LOW
      const urgencyOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      
      if (sortConfig.key === 'urgency') {
        const aValue = urgencyOrder[a.urgency] || 0
        const bValue = urgencyOrder[b.urgency] || 0
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      }
      return 0
    })
    
    return sortedRequests
  }

  // Categorize and sort requests
  const requestsWithStock = sortRequests(bloodRequests?.filter(request => 
    request.status === 'PROCESSING' && request.automation
  )) || []
  
  const requestsWithoutStock = sortRequests(bloodRequests?.filter(request => 
    request.status === 'PENDING' && request.automation
  )) || []
  
  const fulfilledRequests = sortRequests(bloodRequests?.filter(request => 
    request.status === 'FULFILLED'
  )) || []

  const manualRequests = sortRequests(bloodRequests?.filter(request => 
    !request.automation && request.status !== 'FULFILLED'
  )) || []

  const getUrgencyBadge = (urgency) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
    if (urgency === 'HIGH') {
      return `${baseClasses} bg-red-100 text-red-800`
    } else if (urgency === 'MEDIUM') {
      return `${baseClasses} bg-orange-100 text-orange-800`
    } else if (urgency === 'LOW') {
      return `${baseClasses} bg-blue-100 text-blue-800`
    }
    return baseClasses
  }

  const getStatus = (status) => {
    switch(status) {
      case 'PENDING': return 'Chờ xử lý'
      case 'PROCESSING': return 'Đang xử lý'
      case 'FAILED': return 'Đã hủy'
      case 'FULFILLED': return 'Hoàn thành'
      default: return status
    }
  }

  const getUrgencyIcon = (urgency) => {
    switch(urgency) {
      case 'HIGH': return <AlertCircle className="h-3 w-3" />
      case 'MEDIUM': return <Clock className="h-3 w-3" />
      case 'LOW': return <CheckCircle className="h-3 w-3" />
      default: return null
    }
  }

  const requestSort = (key) => {
    let direction = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    }
    setSortConfig({ key, direction })
  }

  const renderRequestTable = (requests, showActions = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Họ tên</TableHead>
          <TableHead>Nhóm máu</TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => requestSort('urgency')}
              className="p-0 hover:bg-transparent"
            >
              Mức độ ưu tiên
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Trạng thái</TableHead>
          {showActions && <TableHead className="text-right">Hành động</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length > 0 ? (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.name}</TableCell>
              <TableCell>{convertBloodType(request.bloodType)}</TableCell>
              <TableCell>
                <span className={getUrgencyBadge(request.urgency)}>
                  {getUrgencyIcon(request.urgency)}
                  {request.urgency === 'HIGH' ? 'Khẩn cấp' : 
                  request.urgency === 'MEDIUM' ? 'Ưu tiên' : 'Bình thường'}
                </span>
              </TableCell>
              <TableCell>
                {getStatus(request.status)}
              </TableCell>
              {showActions && (
                <TableCell className="text-right space-x-2">
                  {request.status !== 'FULFILLED' && (
                    <>
                      <Link href={`/staffs/emergency-request/${request.id}/${request.automation ?  'view-donors':'confirmation'}`}>
                        <Button variant="outline" size="sm">Xử lý</Button>
                      </Link>
                      <Button variant="outline" size="sm">Hủy</Button>
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={showActions ? 5 : 4} className="h-24 text-center">
              Không có yêu cầu nào
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <main className="flex-1 p-6">
      <Tabs defaultValue="withStock" className="w-full">
        <TabsList className="grid w-full grid-cols-3"> {/* could be 4 depends on the tabs */}
          <TabsTrigger value="withStock">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Có đủ máu ({requestsWithStock.length})
          </TabsTrigger>
          <TabsTrigger value="withoutStock">
            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
            Thiếu máu ({requestsWithoutStock.length})
          </TabsTrigger>
          <TabsTrigger value="fulfilled">
            <Archive className="h-4 w-4 mr-2 text-blue-600" />
            Đã hoàn thành ({fulfilledRequests.length})
          </TabsTrigger>
          {/* <TabsTrigger value="manual">
            <PlusCircle className="h-4 w-4 mr-2 text-purple-600" />
            Yêu cầu thủ công ({manualRequests.length})
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="withStock">
          <div className="bg-white rounded border border-gray-200 overflow-x-auto mt-4">
            {renderRequestTable(requestsWithStock)}
          </div>
        </TabsContent>

        <TabsContent value="withoutStock">
          <div className="bg-white rounded border border-gray-200 overflow-x-auto mt-4">
            {renderRequestTable(requestsWithoutStock)}
          </div>
        </TabsContent>

        <TabsContent value="fulfilled">
          <div className="bg-white rounded border border-gray-200 overflow-x-auto mt-4">
            {renderRequestTable(fulfilledRequests, false)}
          </div>
        </TabsContent>

        {/* <TabsContent value="manual">
          <div className="bg-white rounded border border-gray-200 overflow-x-auto mt-4">
            {renderRequestTable(manualRequests)}
          </div>
        </TabsContent> */}
      </Tabs>
    </main>
  )
}