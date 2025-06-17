'use client'
import { useState, useEffect } from "react"
import { getAllAccount } from "@/apis/user"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1
  })

  const getStatusVariant = (status) => {
    switch (status) {
      case 'ENABLE': return 'default'
      case 'DISABLE': return 'destructive'
      default: return 'outline'
    }
  }

  const fetchUsers = async (page = 0, size = 10, sort = 'id,asc') => {
    setLoading(true)
    try {
      const data = await getAllAccount(page, size, sort)
      setAccounts(data.content)
      setPagination({
        pageNumber: data.number,
        pageSize: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages
      })
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    fetchUsers(pagination.pageNumber, pagination.pageSize, `${key},${direction}`)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUsers(newPage)
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || account.role === roleFilter
    const matchesStatus = !statusFilter || account.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Status</SelectItem>
              <SelectItem value="ENABLE">Enable</SelectItem>
              <SelectItem value="DISABLE">Disable</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

            <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* ... (table headers remain the same) */}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.id}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(account.status)}>
                      {account.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {account.status === 'ENABLE' ? (
                        <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700">
                          <Power className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {pagination.pageNumber + 1} of {pagination.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber === pagination.totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}