"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserProfile } from "@/context/user_context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Avatar from "@/components/ui/avatar";
import { updateProfile, uploadAvatar } from "@/apis/user";
import { RoleProtection, ROLES } from "@/components/auth";
import { BASE_URL } from "@/global-config";
import vietnamProvinces from "@/data/vietnam-provinces.json";
import { Camera, Edit2, Save, X, User, Mail, Phone, MapPin, Calendar, IdCard, Droplets } from "lucide-react";
import { convertBloodType } from "@/utils/utils";
import { useLanguage } from "@/context/language_context";

// Sort provinces alphabetically for better UX
const sortedProvinces = vietnamProvinces.sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }));

// Zod validation schema
const profileSchema = z.object({
  name: z.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  phone: z.string()
    .regex(/^[0-9]{10}$/, "Số điện thoại phải có đúng 10 chữ số")
    .optional()
    .or(z.literal("")),
  personalId: z.string()
    .regex(/^[0-9]{12}$/, "Số CCCD/CMND phải có đúng 12 chữ số")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 100;
    }, "Tuổi phải từ 16 đến 100"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", ""]).optional(),
  bloodType: z.enum([
    "A_POSITIVE", "A_NEGATIVE", 
    "B_POSITIVE", "B_NEGATIVE", 
    "AB_POSITIVE", "AB_NEGATIVE", 
    "O_POSITIVE", "O_NEGATIVE", ""
  ]).optional(),
  address: z.string().max(255, "Địa chỉ không được vượt quá 255 ký tự").optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
});
const handleUpdateProfile = async (profileData) => {
    try {
        await updateProfile(profileData); // profileData là object chứa thông tin mới
        // Hiển thị thông báo thành công, cập nhật UI nếu cần
    } catch (error) {
        // Hiển thị thông báo lỗi
    }
};

export default function ProfilePage() {
  const {t} = useLanguage();
  const { profile, account, fetchUserProfile, isLoading, userRole } = useUserProfile();
  
  // Form state with React Hook Form
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      personalId: "",
      dateOfBirth: "",
      gender: "",
      bloodType: "",
      address: "",
      city: "",
      district: "",
      ward: "",
    },
  });

  const { handleSubmit, control, watch, setValue, reset, formState: { isSubmitting } } = form;

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  // Address dropdown states
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);

  // Watch for city and district changes to update dropdowns
  const watchedCity = watch("city");
  const watchedDistrict = watch("district");

  // Helper function to get avatar URL
  const getAvatarUrl = (accountId) => {
    if (!accountId || !BASE_URL) return null;
    return `${BASE_URL}/api/user/account/${accountId}/avatar`;
  };

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        personalId: profile.personalId || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        bloodType: profile.bloodType || "",
        address: profile.address || "",
        city: profile.city || "",
        district: profile.district || "",
        ward: profile.ward || "",
      });

      // Initialize address dropdowns based on profile data
      if (profile.city) {
        const selectedProvince = sortedProvinces.find(p => p.name === profile.city);
        if (selectedProvince) {
          setAvailableDistricts(selectedProvince.districts || []);
          if (profile.district) {
            const selectedDistrict = selectedProvince.districts?.find(d => d.name === profile.district);
            if (selectedDistrict) {
              setAvailableWards(selectedDistrict.wards || []);
            }
          }
        }
      }
    }
  }, [profile, reset]);

  // Handle city changes
  useEffect(() => {
    if (watchedCity) {
      const selectedProvince = sortedProvinces.find(p => p.name === watchedCity);
      setAvailableDistricts(selectedProvince?.districts || []);
      setValue("district", "");
      setValue("ward", "");
      setAvailableWards([]);
    } else {
      setAvailableDistricts([]);
      setAvailableWards([]);
    }
  }, [watchedCity, setValue]);

  // Handle district changes  
  useEffect(() => {
    if (watchedDistrict && watchedCity) {
      const selectedProvince = sortedProvinces.find(p => p.name === watchedCity);
      const selectedDistrict = selectedProvince?.districts?.find(d => d.name === watchedDistrict);
      setAvailableWards(selectedDistrict?.wards || []);
      setValue("ward", "");
    } else {
      setAvailableWards([]);
    }
  }, [watchedDistrict, watchedCity, setValue]);

  // Avatar change handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t?.profilePage?.error?.size);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t?.profilePage?.avatarDialog?.error?.type);
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar function
  const handleAvatarUpload = async () => {
    if (!avatarFile || !account?.id) {
      toast.error(t?.profilePage?.avatarDialog?.error?.auth);
      return;
    }

    setUploadingAvatar(true);
    try {
      await uploadAvatar(account.id, avatarFile);
      toast.success(t?.profilePage?.avatarDialog?.success);
      
      // Refresh user profile to get updated avatar
      await fetchUserProfile();
      
      // Reset avatar states
      setPreviewAvatar(null);
      setAvatarFile(null);
      setAvatarDialogOpen(false);
      
    } catch (error) {
      console.error(t?.profilePage?.error?.upload, error);
      if (error?.response?.data?.message) {
        toast.error(`${t?.profilePage?.error?.generic} ${error.response.data.message}`);
      } else {
        toast.error(t?.profilePage?.error?.failed);
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Cancel avatar upload
  const handleAvatarCancel = () => {
    setPreviewAvatar(null);
    setAvatarFile(null);
    setAvatarDialogOpen(false);
  };

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      // Prepare data for backend (match ProfileDto structure)
      const profileData = {
        name: data.name.trim(),
        phone: data.phone || null,
        address: data.address || null,
        ward: data.ward || null,
        district: data.district || null,
        city: data.city || null,
        bloodType: data.bloodType || null,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth || null,
        personalId: data.personalId || null,
        status: "AVAILABLE",
      };

      // Remove empty strings and convert to null for optional fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === "") {
          profileData[key] = null;
        }
      });

      await updateProfile(profileData);
      toast.success(profilePage?.profileUpdate?.success);
      
      // Refresh user profile to get updated data
      await fetchUserProfile();
      setIsEditing(false);
      
    } catch (error) {
      console.error(t?.profilePage?.error?.generic, error);
      
      // Handle different types of errors
      if (error?.response?.data?.message) {
        toast.error(`${t?.profilePage?.error?.generic} ${error.response.data.message}`);
      } else if (error?.response?.data) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : t?.profilePage?.error?.invalidData;
        toast.error(errorMessage);
      } else if (error?.message) {
        toast.error(`${t?.profilePage?.profileUpdate?.error?.connection} ${error.message}`);
      } else {
        toast.error(t?.profilePage?.profileUpdate?.error?.generic);
      }
    }
  };

  // Cancel edit
  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setPreviewAvatar(null);
    setAvatarFile(null);
  };

  // Helper functions for role display
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'STAFF': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEMBER': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return t?.profilePage?.avatarCard?.roleBadges?.ADMIN;
      case 'STAFF': return t?.profilePage?.avatarCard?.roleBadges?.STAFF;
      case 'MEMBER': return t?.profilePage?.avatarCard?.roleBadges?.MEMBER;
      case 'GUEST': return t?.profilePage?.avatarCard?.roleBadges?.GUEST;
      default: return t?.profilePage?.avatarCard?.roleBadges?.UNKNOWN;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <RoleProtection requiredRole={ROLES.MEMBER}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              {t?.profilePage?.profileForm?.sections?.personalInfo?.title}
            </h1>
            <p className="text-gray-600 mt-2 text-base sm:text-lg">
              {t?.profilePage?.header?.description}
            </p>
          </div>

          {/* Profile Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Avatar and Basic Info Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <Avatar
                      src={previewAvatar || account?.avatar}
                      name={watch("name")}
                      email={account?.email}
                      size={128}
                      className="w-32 h-32 border-4 border-white shadow-lg"
                    />
                    
                    {/* Avatar Upload Dialog */}
                    <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{t?.profilePage?.avatarDialog?.title}</DialogTitle>
                          <DialogDescription>
                            {t?.profilePage?.avatarDialog?.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Avatar
                              src={previewAvatar || (account?.id ? getAvatarUrl(account.id) : null)}
                              name={watch("name")}
                              email={account?.email}
                              size={120}
                              className="w-30 h-30"
                            />
                          </div>
                          
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="avatar-file">{t?.profilePage?.avatarDialog?.Dialog?.selectLabel}</Label>
                            <Input 
                              id="avatar-file" 
                              type="file" 
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="cursor-pointer"
                            />
                          </div>
                          {t?.profilePage?.profileForm?.buttons?.cancel}
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              onClick={handleAvatarCancel}
                              disabled={uploadingAvatar}
                            >
                              
                            </Button>
                            <Button 
                              onClick={handleAvatarUpload}
                              disabled={!avatarFile || uploadingAvatar}
                            >
                              {uploadingAvatar ? t?.profilePage?.loading : t?.profilePage?.profileForm?.buttons?.upload}  
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <CardTitle className="text-xl font-semibold">
                    {watch("name") || t?.profilePage?.avatarCard?.intoFields?.namePlaceholder}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <Badge className={getRoleBadgeColor(userRole)}>
                      {getRoleText(userRole)}
                    </Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium truncate">{account?.email || t?.profilePage?.avatarCard?.intoFields?.emailPlaceholder}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">{t?.profilePage?.avatarCard?.intoFields?.phone}</p>
                        <p className="font-medium truncate">{watch("phone") || t?.profilePage?.avatarCard?.intoFields?.phonePlaceholder}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">{t?.profilePage?.avatarCard?.intoFields?.address}</p>
                        <p className="font-medium truncate">{watch("address") || t?.profilePage?.avatarCard?.intoFields?.addressPlaceholder}</p>
                      </div>
                    </div>

                    {watch("bloodType") && (
                      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Droplets className="h-4 w-4 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-red-600">{t?.profilePage?.avatarCard?.intoFields?.bloodType}</p>
                          <p className="font-medium text-red-700">{convertBloodType(watch("bloodType"))}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Information Form */}
            <div className="lg:col-span-3">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Edit2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">{t?.profilePage?.profileForm?.title}</CardTitle>
                        <CardDescription>
                          {t?.profilePage?.profileForm?.description}
                        </CardDescription>
                      </div>
                    </div>

                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        {t?.profilePage?.profileForm?.buttons?.edit}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleCancel} variant="outline" disabled={isSubmitting} className="gap-2">
                          <X className="h-4 w-4" />
                          {t?.profilePage?.profileForm?.buttons?.cancel}
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2">
                          <Save className="h-4 w-4" />
                          {isSubmitting ? t?.profilePage?.profileForm?.buttons?.saving : t?.profilePage?.profileForm?.buttons?.save}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          {t?.profilePage?.profileForm?.sections?.personalInfo?.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.name?.label}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.name?.placeholder}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50" : ""}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.phone?.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.phone?.placeholder}   
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50" : ""}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="personalId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.personalId?.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.personalId?.placeholder}    
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50" : ""}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.dateOfBirth?.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50" : ""}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.gender?.label}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                                      <SelectValue placeholder={t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.gender?.placeholder} />    
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MALE">
                                      {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.gender?.options?.male}
                                    </SelectItem>
                                    <SelectItem value="FEMALE">
                                      {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.gender?.options?.female}
                                    </SelectItem>
                                    <SelectItem value="OTHER">
                                      {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.gender?.options?.other}                                 </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="bloodType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Droplets className="h-4 w-4" />
                                  {t?.profilePage?.profileForm?.sections?.personalInfo?.fields?.bloodType?.label}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                                      <SelectValue placeholder="Chọn nhóm máu" />
                                    </SelectTrigger>
                                  </FormControl>
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
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Address Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          {t?.profilePage?.profileForm?.sections?.addressInfo?.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <FormField
                            control={control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.address?.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.address?.placeholder}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50" : ""}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.city?.label}
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!isEditing}
                                  >
                                    <FormControl>
                                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                                        <SelectValue placeholder={t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.city?.placeholder} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {sortedProvinces.map((province) => (
                                        <SelectItem key={province.name} value={province.name}>
                                          {province.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name="district"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.district?.label}
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!isEditing || !watchedCity}
                                  >
                                    <FormControl>
                                      <SelectTrigger className={(!isEditing || !watchedCity) ? "bg-gray-50" : ""}>
                                        <SelectValue placeholder={!watchedCity ? t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.district?.placeholder?.noCity : t?.profile?.profileForm?.sections?.addressInfo?.fields?.district?.placeholder?.select} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {availableDistricts.map((district) => (
                                        <SelectItem key={district.name} value={district.name}>
                                          {district.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name="ward"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.ward?.label}
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!isEditing || !watchedDistrict}
                                  >
                                    <FormControl>
                                      <SelectTrigger className={(!isEditing || !watchedDistrict) ? "bg-gray-50" : ""}>
                                        <SelectValue placeholder={!watchedDistrict ? t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.ward?.placeholder?.noDistrict : t?.profilePage?.profileForm?.sections?.addressInfo?.fields?.ward?.placeholder?.select} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {availableWards.map((ward) => (
                                        <SelectItem key={ward.name} value={ward.name}>
                                          {ward.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Donation History Section - Read Only */}
                      {(profile?.lastDonationDate || profile?.nextEligibleDonationDate) && (
                        <>
                          <Separator />
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Droplets className="h-5 w-5 text-red-600" />
                              {t?.profilePage?.profileForm?.sections?.donationHistory?.title}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {profile?.lastDonationDate && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">{t?.profilePage?.profileForm?.sections?.donationHistory?.fields?.lastDonation}</Label>
                                  <Input
                                    type="date"
                                    value={profile.lastDonationDate}
                                    disabled={true}
                                    className="bg-red-50 border-red-200"
                                  />
                                </div>
                              )}

                              {profile?.nextEligibleDonationDate && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">{t?.profilePage?.profileForm?.sections?.donationHistory?.fields?.nextDonation}</Label>
                                  <Input
                                    type="date"
                                    value={profile.nextEligibleDonationDate}
                                    disabled={true}
                                    className="bg-green-50 border-green-200"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </form>
                  </Form>
                  {/* Thêm form đổi mật khẩu */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleProtection>
  );
}
