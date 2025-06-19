<<<<<<< HEAD
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
=======
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function StockDashboard() {
    const bloodStockData = [
        { type: 'aPos', label: 'A+', units: 150 },
        { type: 'aNeg', label: 'A-', units: 80 },
        { type: 'bPos', label: 'B+', units: 120 },
        { type: 'bNeg', label: 'B-', units: 60 },
        { type: 'oPos', label: 'O+', units: 200 },
        { type: 'oNeg', label: 'O-', units: 100 },
        { type: 'abPos', label: 'AB+', units: 90 },
        { type: 'abNeg', label: 'AB-', units: 40 }
    ];
    return(
        <main className="flex-1 p-6">
            <div className="grid grid-cols-4 gap-6">
                {bloodStockData.map((item) => (
                    <div key={item.type} className="bg-white p-6 rounded border border-gray-200">
                        <div className="mb-2 text-sm text-gray-600">{item.label}</div>
                        <div className="text-3xl font-bold text-red-500">{item.units}</div>
                        <div className="text-xs text-gray-500">units available</div>
                    </div>
                ))}
>>>>>>> 874435d2c0dd0c48c141f345f39be682ed8ef5a5
            </div>
        </main>
    );
}