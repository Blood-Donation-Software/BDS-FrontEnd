'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreVertical, Plus, Search, ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { addToStock, checkStock, deleteStock } from '@/apis/bloodStock'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { add } from 'lodash'
import { toast } from 'sonner'

// Blood type and component mappings
const bloodTypeMap = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-"
}

const bloodTypeOptions = Object.entries(bloodTypeMap).map(([value, label]) => ({
  value,
  label
}))

const componentTypeMap = {
  WHOLE_BLOOD: "Whole Blood",
  PLASMA: "Plasma",
  PLATELETS: "Platelets",
  DOUBLE_RED_CELLS: "Double Red Cells"
}

const componentTypeOptions = Object.entries(componentTypeMap).map(([value, label]) => ({
  value,
  label
}))

export default function BloodStockManagement() {
  const [bloodStock, setBloodStock] = useState([])
  const [filteredStock, setFilteredStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    bloodType: '',
    componentType: '',
    expiryStatus: ''
  })
  const [sortConfig, setSortConfig] = useState({
    key: 'expiryDate',
    direction: 'asc'
  })
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    bloodType: '',
    componentType: '',
    quantity: 1,
    expiryDate: ''
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await checkStock()
        setBloodStock(data)
        setFilteredStock(data)
      } catch (error) {
        console.error("Failed to fetch blood stock:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...bloodStock]

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(unit => 
        bloodTypeMap[unit.bloodType].toLowerCase().includes(searchTerm) ||
        componentTypeMap[unit.componentType].toLowerCase().includes(searchTerm)
      )
    }

    if (filters.bloodType) {
      result = result.filter(unit => unit.bloodType === filters.bloodType)
    }

    if (filters.componentType) {
      result = result.filter(unit => unit.componentType === filters.componentType)
    }

    if (filters.expiryStatus) {
      const today = new Date()
      result = result.filter(unit => {
        const expiryDate = new Date(unit.expiryDate)
        const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
        
        switch(filters.expiryStatus) {
          case 'expired': return diffDays < 0
          case 'critical': return diffDays >= 0 && diffDays <= 7
          case 'warning': return diffDays > 7 && diffDays <= 30
          case 'good': return diffDays > 30
          default: return true
        }
      })
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    setFilteredStock(result)
  }, [bloodStock, filters, sortConfig])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getExpiryStatus = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: "Expired", variant: "destructive" }
    if (diffDays <= 7) return { status: "Critical", variant: "destructive" }
    if (diffDays <= 30) return { status: "Warning", variant: "warning" }
    return { status: "Good", variant: "success" }
  }

  const handleDelete = async (id) => {
    try {
      await deleteStock(id)
      setBloodStock(bloodStock.filter(item => item.id !== id))
      toast.success('Blood unit deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete blood unit. Please try again.')
    }
  }

  const handleAddChange = (e) => {
    const { name, value } = e.target
    setAddForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSelect = (name, value) => {
    setAddForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      // Try to add to backend (if addToStock exists)
      if (typeof addToStock === 'function') {
        await addToStock({
          bloodType: addForm.bloodType,
          componentType: addForm.componentType,
          volume: Number(addForm.quantity),
          expiryDate: addForm.expiryDate
        })
        toast.success('Blood unit added successfully!')
      } else {
        // Fallback: just add locally
        const newUnit = {
          id: Date.now(),
          bloodType: addForm.bloodType,
          componentType: addForm.componentType,
          quantity: Number(addForm.quantity),
          expiryDate: addForm.expiryDate,
          volume: Number(addForm.quantity) * 450
        }
        setBloodStock([newUnit, ...bloodStock])
        toast.success('Blood unit added locally!')
      }
      setAddDialogOpen(false)
      setAddForm({
        bloodType: '',
        componentType: '',
        quantity: 1,
        expiryDate: ''
      })
    } catch (error) {
      if (error?.message?.includes('Row was updated or deleted by another transaction')) {
        toast.error('Failed to add: The stock record was changed or deleted. Please refresh and try again.')
      } else {
        toast.error('Failed to add blood unit. Please try again.')
      }
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading blood stock...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div></div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blood Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Blood Unit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className='space-y-3'>
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={addForm.bloodType} onValueChange={(v) => handleAddSelect('bloodType', v)}>
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-3'>
                <Label htmlFor="componentType">Component Type</Label>
                <Select value={addForm.componentType} onValueChange={(v) => handleAddSelect('componentType', v)}>
                  <SelectTrigger id="componentType">
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    {componentTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-3'>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  value={addForm.quantity}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className='space-y-3'>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={addForm.expiryDate}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter blood units by specific criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blood units..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
             <div className='flex space-x-5'>
                <Select
                value={filters.bloodType}
                onValueChange={(value) => setFilters({...filters, bloodType: value})}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="*">All Blood Types</SelectItem>
                    {bloodTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

                <Select
                value={filters.componentType}
                onValueChange={(value) => setFilters({...filters, componentType: value})}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Component Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="*">All Components</SelectItem>
                    {componentTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

                <Select
                value={filters.expiryStatus}
                onValueChange={(value) => setFilters({...filters, expiryStatus: value})}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Expiry Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="*">All Statuses</SelectItem>
                    <SelectItem value="good">Good (&gt;30 days)</SelectItem>
                    <SelectItem value="warning">Warning (8-30 days)</SelectItem>
                    <SelectItem value="critical">Critical (≤7 days)</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
                </Select>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Blood Stock Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Blood Inventory</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredStock.length} of {bloodStock.length} units
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="px-0">
            <TableHeader className="px-0">
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('bloodType')}
                    className="px-0"
                  >
                    Blood Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Component</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('volume')}
                    className="px-0 py-0"
                  >
                    Volume (ml)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('expiryDate')}
                    className="px-0"
                  >
                    Expiry Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.length > 0 ? (
                filteredStock.map((unit) => {
                  const expiryStatus = getExpiryStatus(unit.expiryDate)
                  return (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {bloodTypeMap[unit.bloodType]}
                        </Badge>
                      </TableCell>
                      <TableCell>{componentTypeMap[unit.componentType]}</TableCell>
                      <TableCell>{unit.volume.toFixed(1)}</TableCell>
                      <TableCell>{format(new Date(unit.expiryDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={expiryStatus.variant}>
                          {expiryStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(unit.id)}
                            >
                              Discard
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No blood units found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bloodStock.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bloodStock.reduce((sum, unit) => sum + unit.volume, 0).toFixed(1)} ml
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {bloodStock.filter(unit => {
                const diffDays = Math.ceil(
                  (new Date(unit.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
                )
                return diffDays <= 7 && diffDays >= 0
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {bloodStock.filter(unit => {
                return new Date(unit.expiryDate) < new Date()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}