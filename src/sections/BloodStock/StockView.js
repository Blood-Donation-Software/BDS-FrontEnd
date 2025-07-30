'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MoreVertical, Plus, Search, ArrowUpDown, CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { addToStock, checkStock, deleteStock } from '@/apis/bloodStock'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useLanguage } from '@/context/language_context'

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
  RED_BLOOD_CELLS: "Red Blood Cells"
}

const componentTypeOptions = Object.entries(componentTypeMap).map(([value, label]) => ({
  value,
  label
}))

export default function BloodStockManagement() {
  const { t } = useLanguage()
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
    expiryDate: null
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

        switch (filters.expiryStatus) {
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

    if (diffDays < 0) return { status: t?.StockView?.status?.expired || 'Expired', variant: "destructive" }
    if (diffDays <= 7) return { status: t?.StockView?.status?.critical || 'Critical', variant: "destructive" }
    if (diffDays <= 30) return { status: t?.StockView?.status?.warning || 'Warning', variant: "warning" }
    return { status: t?.StockView?.status?.good || 'Good', variant: "success" }
  }

  const handleDelete = async (id) => {
    try {
      await deleteStock(id)
      setBloodStock(bloodStock.filter(item => item.id !== id))
      toast.success(t?.StockView?.delete?.Success || 'Blood unit deleted successfully')
    } catch (error) {
      toast.error(t?.StockView?.delete?.Error || 'Failed to delete blood unit')
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
    
    // Validate that all required fields are filled
    if (!addForm.bloodType || !addForm.componentType || !addForm.quantity || !addForm.expiryDate) {
      toast.error(t?.StockView?.add?.error?.missingFields || 'Please fill in all required fields')
      return
    }
    
    try {
      // Try to add to backend (if addToStock exists)
      if (typeof addToStock === 'function') {
        await addToStock({
          bloodType: addForm.bloodType,
          componentType: addForm.componentType,
          volume: Number(addForm.quantity),
          expiryDate: format(addForm.expiryDate, 'yyyy-MM-dd')
        })
        toast.success(t?.StockView?.add?.success || 'Blood unit added successfully')
      } else {
        // Fallback: just add locally
        const newUnit = {
          id: Date.now(),
          bloodType: addForm.bloodType,
          componentType: addForm.componentType,
          quantity: Number(addForm.quantity),
          expiryDate: format(addForm.expiryDate, 'yyyy-MM-dd'),
          volume: Number(addForm.quantity) * 450
        }
        setBloodStock([newUnit, ...bloodStock])
        toast.success(t?.StockView?.add?.fallback?.success || 'Blood unit added locally')
      }
      setAddDialogOpen(false)
      setAddForm({
        bloodType: '',
        componentType: '',
        quantity: 1,
        expiryDate: null
      })
    } catch (error) {
      if (error?.message?.includes('Row was updated or deleted by another transaction')) {
        toast.error(t?.StockView?.add?.error?.optimisticLock || 'Data conflict occurred. Please try again.')
      } else {
        toast.error(t?.StockView?.add?.error?.generic || 'Failed to add blood unit')
      }
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">{t?.StockView?.loading || 'Loading...'}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>{t?.StockView?.filters?.title || 'Filters'}</CardTitle>
            <CardDescription>{t?.StockView?.filters?.description || 'Filter and search blood stock inventory'}</CardDescription>
          </div>
          <div className="flex justify-between items-center">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t?.StockView?.add?.button || 'Add Blood Unit'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t?.StockView?.add?.button || 'Add Blood Unit'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-5">
                  <div className='space-y-3'>
                    <Label htmlFor="bloodType">{t?.user?.blood_type || 'Blood Type'}</Label>
                    <Select value={addForm.bloodType} onValueChange={(v) => handleAddSelect('bloodType', v)}>
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder={t?.user?.blood_type || 'Select blood type'} />
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
                    <Label htmlFor="componentType">{t?.StockView?.add?.componentType?.label || 'Component Type'}</Label>
                    <Select value={addForm.componentType} onValueChange={(v) => handleAddSelect('componentType', v)}>
                      <SelectTrigger id="componentType">
                        <SelectValue placeholder={t?.StockView?.add?.componentType?.placeholder || 'Select component'} />
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
                    <Label htmlFor="quantity">{t?.StockView?.add?.quantity?.label || 'Quantity'}</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      placeholder={t?.StockView?.add?.quantity?.placeholder || 'Enter quantity'}
                      value={addForm.quantity}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className='space-y-3'>
                    <Label htmlFor="expiryDate">{t?.StockView?.add?.expiryDate?.label || 'Expiry Date'}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {addForm.expiryDate ? format(addForm.expiryDate, "PPP") : (t?.StockView?.add?.expiryDate?.placeholder || 'Pick a date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={addForm.expiryDate}
                          onSelect={(date) => setAddForm(prev => ({ ...prev, expiryDate: date }))}
                          disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{t?.StockView?.add?.submit || 'Add'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex md:flex-row flex-col gap-4 items-center">
            <div className="relative flex-1/2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t?.StockView?.filters?.search_placeholder || 'Search blood stock...'}
                className="pl-8"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <Select value={filters.bloodType} onValueChange={(v) => setFilters({ ...filters, bloodType: v })}>
              <SelectTrigger>
                <SelectValue placeholder={t?.StockView?.filters?.bloodType || 'All Blood Types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*">{t?.StockView?.filters?.bloodType || 'All Blood Types'}</SelectItem>
                {bloodTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.componentType} onValueChange={(v) => setFilters({ ...filters, componentType: v })}>
              <SelectTrigger>
                <SelectValue placeholder={t?.StockView?.filters?.componentType || 'All Components'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*">{t?.StockView?.filters?.componentType || 'All Components'}</SelectItem>
                {componentTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.expiryStatus} onValueChange={(v) => setFilters({ ...filters, expiryStatus: v })}>
              <SelectTrigger>
                <SelectValue placeholder={t?.StockView?.filters?.expiryStatus?.placeholder || 'All expiry status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*">{t?.StockView?.filters?.expiryStatus || 'All Status'}</SelectItem>
                <SelectItem value="expired">{t?.StockView?.filters?.expired || 'Expired'}</SelectItem>
                <SelectItem value="critical">{t?.StockView?.filters?.critical || 'Critical'}</SelectItem>
                <SelectItem value="warning">{t?.StockView?.filters?.warning || 'Warning'}</SelectItem>
                <SelectItem value="good">{t?.StockView?.filters?.good || 'Good'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blood Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t?.StockView?.table?.title || 'Blood Stock Inventory'}</CardTitle>
          <CardDescription>
            {t?.StockView?.table?.total || 'Total items:'} {filteredStock.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('bloodType')}
                >
                  {t?.StockView?.table?.headers?.bloodType || 'Blood Type'}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('componentType')}
                >
                  {t?.StockView?.table?.headers?.component || 'Component'}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                {/* <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  {t?.StockView?.table?.headers?.quantity || 'Quantity'}  
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead> */}
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('volume')}
                >
                  {t?.StockView?.table?.headers?.volume || 'Volume (ml)'}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('expiryDate')}
                >
                  {t?.StockView?.table?.headers?.expiryDate || 'Expiry Date'}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>
                  {t?.StockView?.table?.headers?.status || 'Status'}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>
                  {t?.StockView?.table?.headers?.actions || 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t?.StockView?.table?.no_results || 'No blood stock found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStock.map((unit) => {
                  const { status, variant } = getExpiryStatus(unit.expiryDate)
                  return (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">
                        {bloodTypeMap[unit.bloodType]}
                      </TableCell>
                      <TableCell>
                        {componentTypeMap[unit.componentType]}
                      </TableCell>
                      <TableCell>{unit.quantity}</TableCell>
                      <TableCell>{unit.volume}</TableCell>
                      <TableCell>
                        {format(new Date(unit.expiryDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant}>{status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDelete(unit.id)}
                              className="text-red-600"
                            >
                              {t?.StockView?.table?.actions?.delete || 'Delete'}  
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}