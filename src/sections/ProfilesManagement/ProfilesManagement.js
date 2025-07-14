"use client"

import React, { use, useEffect, useState, useCallback, useMemo } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllProfile, updateProfile, createProfile, getDonationHistoryById } from '@/apis/user';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import vietnamProvinces from '@/data/vietnam-provinces.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { set } from 'lodash';

// DialogForm component for both create and update
const DialogForm = React.memo(({
    profile,
    formData,
    onSubmit,
    onChange,
    onSelectChange,
    loading,
    availableDistricts,
    availableWards,
    vietnamProvinces
}) => {
    const isUpdate = profile !== null;

    return (
        <DialogContent className="sm:max-w-[425px] lg:max-w-[700px] max-h-[90vh]">
            <form onSubmit={onSubmit}>
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
                    <DialogDescription>
                        {isUpdate ? 'Update the profile information below.' : 'Create the profile with information below.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {isUpdate && (
                        <>
                            <input type='hidden' name="id" value={profile?.id || ''} />
                            <input type='hidden' name="accountId" value={profile?.accountId || ''} />
                        </>
                    )}
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-gray-600 mb-1">Full Name</label>
                            <input
                                name="name"
                                required
                                value={formData?.name || ''}
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Phone Number</label>
                            <input
                                name="phone"
                                required
                                value={formData?.phone || ''}
                                pattern="^(03|05|07|08|09)\d{8}$"
                                title="Please enter a valid Vietnamese phone number (e.g., 0912345678)"
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Personal ID</label>
                            <input
                                name="personalId"
                                required
                                value={formData?.personalId || ''}
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Date of Birth</label>
                            <input
                                name="dob"
                                type="date"
                                required
                                value={formData?.dob || ''}
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                                onChange={onChange}
                            />
                        </div>
                        {isUpdate && (
                            <div>
                                <label className="block text-gray-600 mb-1">Last Donation Date</label>
                                <input
                                    name="lastDonationDate"
                                    type="date"
                                    value={formData?.lastDonationDate || ''}
                                    className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                                    onChange={onChange}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-600 mb-1">Blood Type</label>
                            <Select
                                value={formData?.blood_type || ''}
                                onValueChange={(value) => onSelectChange('blood_type', value)}
                            >
                                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4 h-auto">
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A_POSITIVE">A+</SelectItem>
                                    <SelectItem value="A_NEGATIVE">A-</SelectItem>
                                    <SelectItem value="B_POSITIVE">B+</SelectItem>
                                    <SelectItem value="B_NEGATIVE">B-</SelectItem>
                                    <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                                    <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                                    <SelectItem value="O_POSITIVE">O+</SelectItem>
                                    <SelectItem value="O_NEGATIVE">O-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Gender</label>
                            <Select
                                value={formData?.gender || ''}
                                onValueChange={(value) => onSelectChange('gender', value)}
                            >
                                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4 h-auto">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">City/Province</label>
                            <Select
                                value={formData?.city || ''}
                                onValueChange={(value) => onSelectChange('city', value)}
                            >
                                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4 h-auto">
                                    <SelectValue placeholder="Select city/province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vietnamProvinces.map((province, index) => (
                                        <SelectItem key={index} value={province.name}>
                                            {province.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">District</label>
                            <Select
                                value={formData?.district || ''}
                                onValueChange={(value) => onSelectChange('district', value)}
                                disabled={availableDistricts.length === 0}
                            >
                                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4 h-auto">
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDistricts.map((district, index) => (
                                        <SelectItem key={index} value={district.name}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Ward</label>
                            <Select
                                value={formData?.ward || ''}
                                onValueChange={(value) => onSelectChange('ward', value)}
                                disabled={availableWards.length === 0}
                            >
                                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4 h-auto">
                                    <SelectValue placeholder="Select ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableWards.map((ward, index) => (
                                        <SelectItem key={index} value={ward.name}>
                                            {ward.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Address</label>
                            <input
                                name="address"
                                required
                                value={formData?.address || ''}
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4"
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Status</label>
                            <Select
                                value={formData?.status || ''}
                                onValueChange={(value) => onSelectChange('status', value)}
                            >
                                <SelectTrigger className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-4 h-auto">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AVAILABLE">Available</SelectItem>
                                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <button
                            type="button"
                            disabled={loading}
                            className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition"
                    >
                        {loading ? (isUpdate ? "Updating..." : "Creating...") : (isUpdate ? "Save Changes" : "Create Profile")}
                    </button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
});

// Sample data matching ProfileDto structure

export default function ProfilesManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableWards, setAvailableWards] = useState([]);
    const [createAvailableDistricts, setCreateAvailableDistricts] = useState([]);
    const [createAvailableWards, setCreateAvailableWards] = useState([]);
    const [form, setForm] = useState();
    const [createForm, setCreateForm] = useState();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const convertDateFormat = (dateString) => {
        if (!dateString) return '';

        // Check if it's already in YYYY-MM-DD format
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }

        // Convert from DD-MM-YYYY to YYYY-MM-DD
        if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [day, month, year] = dateString.split('-');
            return `${year}-${month}-${day}`;
        }

        return dateString;
    };

    const convertDateForServer = (dateString) => {
        if (!dateString) return '';

        // Check if it's in YYYY-MM-DD format
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-');
            return `${day}-${month}-${year}`;
        }

        return dateString;
    };

    useEffect(() => {
        if (selectedProfile) {
            const data = {
                id: selectedProfile.id || '',
                accountId: selectedProfile.accountId || '',
                name: selectedProfile.name || '',
                phone: selectedProfile.phone || '',
                personalId: selectedProfile.personalId || '',
                address: selectedProfile.address || '',
                blood_type: selectedProfile.bloodType || '',
                ward: selectedProfile.ward || '',
                gender: selectedProfile.gender || '',
                district: selectedProfile.district || '',
                dob: convertDateFormat(selectedProfile.dateOfBirth) || '',
                lastDonationDate: convertDateFormat(selectedProfile.lastDonationDate) || '',
                city: selectedProfile.city || '',
                status: selectedProfile.status || ''
            };
            setForm(data);
        }
    }, [selectedProfile]);

    // Update districts when city changes
    useEffect(() => {
        if (form?.city) {
            const selectedProvince = vietnamProvinces.find(province => province.name === form.city);
            if (selectedProvince) {
                setAvailableDistricts(selectedProvince.districts);
                // Reset district and ward when city changes
                if (form.district && !selectedProvince.districts.find(d => d.name === form.district)) {
                    setForm(prev => ({ ...prev, district: '', ward: '' }));
                    setAvailableWards([]);
                }
            } else {
                setAvailableDistricts([]);
                setAvailableWards([]);
            }
        } else {
            setAvailableDistricts([]);
            setAvailableWards([]);
        }
    }, [form?.city]);

    // Update wards when district changes
    useEffect(() => {
        if (form?.district && availableDistricts.length > 0) {
            const selectedDistrict = availableDistricts.find(district => district.name === form.district);
            if (selectedDistrict) {
                setAvailableWards(selectedDistrict.wards);
                // Reset ward when district changes
                if (form.ward && !selectedDistrict.wards.find(w => w.name === form.ward)) {
                    setForm(prev => ({ ...prev, ward: '' }));
                }
            } else {
                setAvailableWards([]);
            }
        } else {
            setAvailableWards([]);
        }
    }, [form?.district, availableDistricts]);

    // Initialize districts and wards on component mount
    useEffect(() => {
        if (form?.city) {
            const selectedProvince = vietnamProvinces.find(province => province.name === form.city);
            if (selectedProvince) {
                setAvailableDistricts(selectedProvince.districts);

                if (form.district) {
                    const selectedDistrict = selectedProvince.districts.find(district => district.name === form.district);
                    if (selectedDistrict) {
                        setAvailableWards(selectedDistrict.wards);
                    }
                }
            }
        }
    }, []);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const response = await getAllProfile();

                setProfiles(response.content);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // Filter profiles based on search term
    const filteredProfiles = profiles.filter(profile =>
        (profile.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.personalId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (profile.bloodType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Update districts when city changes for createForm
    useEffect(() => {
        if (createForm?.city) {
            const selectedProvince = vietnamProvinces.find(province => province.name === createForm.city);
            if (selectedProvince) {
                setCreateAvailableDistricts(selectedProvince.districts);
                // Reset district and ward when city changes
                if (createForm.district && !selectedProvince.districts.find(d => d.name === createForm.district)) {
                    setCreateForm(prev => ({ ...prev, district: '', ward: '' }));
                    setCreateAvailableWards([]);
                }
            } else {
                setCreateAvailableDistricts([]);
                setCreateAvailableWards([]);
            }
        } else {
            setCreateAvailableDistricts([]);
            setCreateAvailableWards([]);
        }
    }, [createForm?.city]);

    // Update wards when district changes for createForm
    useEffect(() => {
        if (createForm?.district && createAvailableDistricts.length > 0) {
            const selectedDistrict = createAvailableDistricts.find(district => district.name === createForm.district);
            if (selectedDistrict) {
                setCreateAvailableWards(selectedDistrict.wards);
                // Reset ward when district changes
                if (createForm.ward && !selectedDistrict.wards.find(w => w.name === createForm.ward)) {
                    setCreateForm(prev => ({ ...prev, ward: '' }));
                }
            } else {
                setCreateAvailableWards([]);
            }
        } else {
            setCreateAvailableWards([]);
        }
    }, [createForm?.district, createAvailableDistricts]);

    // Initialize districts and wards for createForm when it changes
    useEffect(() => {
        if (createForm?.city) {
            const selectedProvince = vietnamProvinces.find(province => province.name === createForm.city);
            if (selectedProvince) {
                setCreateAvailableDistricts(selectedProvince.districts);

                if (createForm.district) {
                    const selectedDistrict = selectedProvince.districts.find(district => district.name === createForm.district);
                    if (selectedDistrict) {
                        setCreateAvailableWards(selectedDistrict.wards);
                    }
                }
            }
        }
    }, [createForm?.city, createForm?.district]);

    // Initialize createForm when dialog opens
    const handleOpenCreateDialog = () => {
        setCreateForm({
            name: '',
            phone: '',
            personalId: '',
            address: '',
            blood_type: '',
            ward: '',
            gender: '',
            district: '',
            dob: '',
            lastDonationDate: '',
            city: '',
            status: 'AVAILABLE'
        });
        setCreateAvailableDistricts([]);
        setCreateAvailableWards([]);
        setCreateDialogOpen(true);
    };

    // Reset createForm when dialog is closed
    const handleCloseCreateDialog = () => {
        setCreateForm(null);
        setCreateAvailableDistricts([]);
        setCreateAvailableWards([]);
        setCreateDialogOpen(false);
    };

    // Handle opening update dialog
    const handleOpenUpdateDialog = (profile) => {
        setSelectedProfile(profile);
        setUpdateDialogOpen(true);
    };

    // Handle closing update dialog
    const handleCloseUpdateDialog = () => {
        setSelectedProfile(null);
        setForm(null);
        setAvailableDistricts([]);
        setAvailableWards([]);
        setUpdateDialogOpen(false);
    };

    // Handle opening history dialog
    const handleViewHistoryDialog = async (profileId) => {
        try {
            const response = await getDonationHistoryById(profileId);
            setSelectedHistory(response.content);
            console.log('Donation history:', response.content);
        }
        catch (error) {
            console.error('Error fetching donation history:', error);
            alert('Failed to fetch donation history. Please try again.');
        }
    };

    // Handle adding a new profile
    const handleAddNewProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare the data for submission
            const formData = {
                id: createForm.id,
                accountId: createForm.accountId,
                name: createForm.name,
                phone: createForm.phone,
                personalId: createForm.personalId,
                address: createForm.address,
                bloodType: createForm.blood_type,
                ward: createForm.ward,
                gender: createForm.gender,
                district: createForm.district,
                dateOfBirth: convertDateForServer(createForm.dob),
                lastDonationDate: convertDateForServer(createForm.lastDonationDate),
                city: createForm.city,
                status: createForm.status
            };

            console.log('Submitting profile data:', formData);
            const response = await createProfile(formData);
            console.log('Create response:', response);

            // Refresh the profiles list
            const updatedProfiles = await getAllProfile();
            setProfiles(updatedProfiles.content);

            // Close dialog and reset form state
            handleCloseCreateDialog();

            alert('Profile created successfully!');
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (profile) => {
        // Only set selectedProfile if it's different from current
        if (!selectedProfile || selectedProfile.id !== profile.id) {
            setSelectedProfile(profile);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare the data for submission
            const formData = {
                id: form.id,
                accountId: form.accountId,
                name: form.name,
                phone: form.phone,
                personalId: form.personalId,
                address: form.address,
                bloodType: form.blood_type,
                ward: form.ward,
                gender: form.gender,
                district: form.district,
                dateOfBirth: convertDateForServer(form.dob),
                lastDonationDate: convertDateForServer(form.lastDonationDate),
                city: form.city,
                status: form.status
            };

            console.log('Submitting profile data:', formData);
            const response = await updateProfile(formData);
            console.log('Update response:', response);

            // Refresh the profiles list
            const updatedProfiles = await getAllProfile();
            setProfiles(updatedProfiles.content);

            // Close dialog and reset form state
            handleCloseUpdateDialog();

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const getStatusBadge = (status) => {
        if (!status) {
            return (
                <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold">
                    NO STATUS
                </Badge>
            );
        }

        // Handle different status types with appropriate colors
        switch (status.toLowerCase()) {
            case 'available':
                return (
                    <Badge variant="default" className="bg-green-200 hover:bg-green-300 text-green-900 font-bold">
                        AVAILABLE
                    </Badge>
                );
            case 'unavailable':
                return (
                    <Badge variant="secondary" className="bg-red-200 hover:bg-red-300 text-red-900 font-bold">
                        UNAVAILABLE
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="secondary" className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold">
                        PENDING
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold">
                        CANCELLED
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="default" className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold">
                        COMPLETED
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="secondary" className="bg-red-200 hover:bg-red-300 text-red-900 font-bold">
                        REJECTED
                    </Badge>
                );
            case 'checked_in':
            case 'checked in':
                return (
                    <Badge variant="default" className="bg-purple-200 hover:bg-purple-300 text-purple-900 font-bold">
                        CHECKED IN
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold">
                        {status.toUpperCase()}
                    </Badge>
                );
        }
    };

    const formatBloodType = (bloodType) => {
        if (!bloodType) return '';
        return bloodType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        // If date is in dd-MM-yyyy format, convert to display format
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
        return dateString;
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            if (prev?.[name] === value) return prev; // Prevent unnecessary updates
            return { ...prev, [name]: value };
        });
    }, []);

    const handleSelectChange = useCallback((name, value) => {
        setForm((prev) => {
            if (prev?.[name] === value) return prev; // Prevent unnecessary updates
            return { ...prev, [name]: value };
        });
    }, []);

    const handleCreateChange = useCallback((e) => {
        const { name, value } = e.target;
        setCreateForm((prev) => {
            if (prev?.[name] === value) return prev; // Prevent unnecessary updates
            return { ...prev, [name]: value };
        });
    }, []);

    const handleCreateSelectChange = useCallback((name, value) => {
        setCreateForm((prev) => {
            if (prev?.[name] === value) return prev; // Prevent unnecessary updates
            return { ...prev, [name]: value };
        });
    }, []);

    return (
        <>

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4">

                    {/* Search and Add Button Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search by name, phone, ID, city, or blood type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4"
                            />
                        </div>

                        {/* Add New Profile Button */}
                        <Dialog onOpenChange={(open) => {
                            if (open) {
                                handleOpenCreateDialog();
                            } else {
                                handleCloseCreateDialog();
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button
                                    className="bg-red-600 text-white hover:bg-red-700 shadow-md"
                                    size="default"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add new Profile
                                </Button>
                            </DialogTrigger>
                            <DialogForm
                                profile={null}
                                formData={createForm}
                                onSubmit={handleAddNewProfile}
                                onChange={handleCreateChange}
                                onSelectChange={handleCreateSelectChange}
                                loading={loading}
                                availableDistricts={createAvailableDistricts}
                                availableWards={createAvailableWards}
                                vietnamProvinces={vietnamProvinces}
                            />
                        </Dialog>
                    </div>

                    {/* Results count */}
                    <div className="text-sm text-gray-600">
                        {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">NAME</TableHead>
                                <TableHead>DATE OF BIRTH</TableHead>
                                <TableHead>BLOOD TYPE</TableHead>
                                <TableHead>CONTACT</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead className="text-center">DONATION HISTORY</TableHead>
                                <TableHead className="text-right">DETAILS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        Loading profiles...
                                    </TableCell>
                                </TableRow>
                            ) : filteredProfiles.length > 0 ? (
                                filteredProfiles.map((profile) => (
                                    <TableRow key={profile.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {profile.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {profile.personalId || 'No ID'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-900">{formatDate(profile.dateOfBirth) || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium text-red-600">{formatBloodType(profile.bloodType) || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-900">{profile.phone || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{profile.city || 'N/A'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(profile.status)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={() => handleViewHistoryDialog(profile.id)}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] lg:max-w-[900px] max-h-[90vh]">
                                                    <DialogHeader>
                                                        <DialogTitle>Donation history</DialogTitle>
                                                        <DialogDescription>
                                                            View member's donation history here.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[150px]">Donation Name</TableHead>
                                                                <TableHead className="w-[200px]">Location</TableHead>
                                                                <TableHead className="w-[100px]">Type</TableHead>
                                                                <TableHead className="w-[100px]">Status</TableHead>
                                                                <TableHead className="text-right w-[120px]">Donation Date</TableHead>
                                                                <TableHead className="text-right w-[120px]">Registration Date</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {selectedHistory?.map((history) => (
                                                                <TableRow key={history?.registrationId}>
                                                                    <TableCell className="font-medium">{history?.donationName}</TableCell>
                                                                    <TableCell className="w-[200px]">
                                                                        <div className="whitespace-normal break-words text-sm leading-relaxed">
                                                                            {history?.donationLocation}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{history?.donationType}</TableCell>
                                                                    <TableCell>{getStatusBadge(history?.registrationDonationRegistrationStatus)}</TableCell>
                                                                    <TableCell className="text-right">{history?.donationDate}</TableCell>
                                                                    <TableCell className="text-right">{history?.registrationDate}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Close</Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* View history button */}
                                            <Dialog onOpenChange={(open) => {
                                                if (open) {
                                                    handleViewDetails(profile);
                                                } else {
                                                    handleCloseUpdateDialog();
                                                }
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline"
                                                        size="sm"
                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogForm
                                                    profile={profile}
                                                    formData={form}
                                                    onSubmit={handleUpdate}
                                                    onChange={handleChange}
                                                    onSelectChange={handleSelectChange}
                                                    loading={loading}
                                                    availableDistricts={availableDistricts}
                                                    availableWards={availableWards}
                                                    vietnamProvinces={vietnamProvinces}
                                                />
                                            </Dialog>

                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        No profiles found matching your search criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
