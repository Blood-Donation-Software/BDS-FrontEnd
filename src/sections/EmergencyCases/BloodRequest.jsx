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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Archive, Clock, PlusCircle, ArrowUpDown, Eye, User, Calendar, FileText, Activity } from "lucide-react"
import { convertBloodType } from "@/utils/utils"
import { useState } from "react"
import { format } from "date-fns"

export default function BloodRequest() {
  const { bloodRequests } = useBloodRequests()
  const [sortConfig, setSortConfig] = useState({ key: 'urgency', direction: 'desc' })
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

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
    request.status === 'PROCESSING'
  )) || []
  
  const requestsWithoutStock = sortRequests(bloodRequests?.filter(request => 
    request.status === 'PENDING'
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

  const viewRequestDetails = (request) => {
    setSelectedRequest(request)
    setShowDetailDialog(true)
  }

  const closeDetailDialog = () => {
    setSelectedRequest(null)
    setShowDetailDialog(false)
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
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length > 0 ? (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.profile.name}</TableCell>
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
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => viewRequestDetails(request)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Chi tiết
                </Button>
                {showActions && request.status !== 'FULFILLED' && (
                  <>
                    <Link href={`/staffs/emergency-request/${request.id}/view-donors`}>
                      <Button variant="outline" size="sm">Xử lý</Button>
                    </Link>
                    <Button variant="outline" size="sm">Hủy</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
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

      {/* Request Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={closeDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Chi tiết yêu cầu máu
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu hiến máu
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 py-4">
              {/* Patient Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Thông tin bệnh nhân</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Họ tên:</span> {selectedRequest.profile.name}
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">CCCD:</span> {selectedRequest.profile.personalId}
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Số điện thoại:</span> {selectedRequest.profile.phone}
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Nhóm máu bệnh nhân:</span> {selectedRequest.profile.bloodType ? convertBloodType(selectedRequest.profile.bloodType) : 'Chưa xác định'}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-blue-700">Địa chỉ:</span> {selectedRequest.profile.address}, {selectedRequest.profile.ward}, {selectedRequest.profile.district}, {selectedRequest.profile.city}
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Activity className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Thông tin yêu cầu</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nhóm máu cần:</span> {convertBloodType(selectedRequest.bloodType)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Mức độ ưu tiên:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      selectedRequest.urgency === 'HIGH' 
                        ? 'bg-red-100 text-red-800' 
                        : selectedRequest.urgency === 'MEDIUM' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedRequest.urgency === 'HIGH' ? 'Khẩn cấp' : 
                       selectedRequest.urgency === 'MEDIUM' ? 'Ưu tiên' : 'Bình thường'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Trạng thái:</span> {getStatus(selectedRequest.status)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ngày cần:</span> {selectedRequest.requiredDate ? format(new Date(selectedRequest.requiredDate), 'dd/MM/yyyy') : 'Chưa xác định'}
                  </div>
                </div>
              </div>

              {/* Blood Components */}
              {selectedRequest.componentRequests && selectedRequest.componentRequests.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-red-900">Thành phần máu cần thiết</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedRequest.componentRequests.map((component, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-red-700">
                          {component.componentType.replace(/_/g, ' ')}:
                        </span>
                        <span className="ml-2 text-red-600">{component.volume} đơn vị</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Conditions */}
              {selectedRequest.medicalConditions && selectedRequest.medicalConditions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-semibold text-yellow-900">Tình trạng bệnh lý</h3>
                  </div>
                  <div className="space-y-1">
                    {selectedRequest.medicalConditions.map((condition, index) => (
                      <div key={index} className="text-sm text-yellow-700">
                        • {condition.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(selectedRequest.additionalMedicalInformation || selectedRequest.additionalNotes) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Thông tin bổ sung</h3>
                  </div>
                  {selectedRequest.additionalMedicalInformation && (
                    <div className="mb-3">
                      <span className="font-medium text-green-700">Thông tin y tế:</span>
                      <p className="text-sm text-green-600 mt-1">{selectedRequest.additionalMedicalInformation}</p>
                    </div>
                  )}
                  {selectedRequest.additionalNotes && (
                    <div>
                      <span className="font-medium text-green-700">Ghi chú:</span>
                      <p className="text-sm text-green-600 mt-1">{selectedRequest.additionalNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}