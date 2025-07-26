"use client";
import { useState } from "react";
import { useUserProfile } from "@/context/user_context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { RoleProtection, ROLES } from "@/components/auth";
import { updatePassword } from "@/apis/user";
export default function SettingsPage() {
  const { account, profile } = useUserProfile();
  const [settings, setSettings] = useState({
    marketingEmails: profile?.status === 'AVAILABLE' ? true : false,
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Cài đặt đã được lưu thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu cài đặt!");
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setSaving(true);
    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      toast.success("Mật khẩu đã được thay đổi thành công!");
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thay đổi mật khẩu!");
    }
    setSaving(false);
  };

  return (
    <RoleProtection requiredRole={ROLES.MEMBER}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600 mt-2">Quản lý cài đặt tài khoản và tùy chọn của bạn</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>
                    Thông tin cơ bản về tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="font-medium">{account?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Họ tên</Label>
                    <p className="font-medium">{profile?.name || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Vai trò</Label>                    
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      account?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      account?.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                      account?.role === 'MEMBER' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account?.role === 'ADMIN' ? 'Quản trị viên' :
                       account?.role === 'STAFF' ? 'Nhân viên' :
                       account?.role === 'MEMBER' ? 'Thành viên' : 'Khách'}
                    </span>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Ngày tham gia</Label>
                    <p className="font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông báo</CardTitle>
                  <CardDescription>
                    Quản lý cách bạn nhận thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Email marketing</Label>
                      <p className="text-sm text-gray-500">Nhận email về tin tức và ưu đãi</p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                    />
                  </div>
                  
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                  <CardDescription>
                    Cập nhật mật khẩu để bảo mật tài khoản
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Mật khẩu hiện tại</Label>
                    <Input
                      id="old-password"
                      name="oldPassword"
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  
                  <Button 
                    onClick={changePassword} 
                    disabled={saving || !passwordForm.oldPassword || !passwordForm.newPassword}
                    className="w-full"
                  >
                    {saving ? "Đang thay đổi..." : "Đổi mật khẩu"}
                  </Button>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Tùy chọn</CardTitle>
                  <CardDescription>
                    Cài đặt ngôn ngữ và múi giờ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Ngôn ngữ</Label>
                      <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Múi giờ</Label>
                      <select
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={saving} size="lg">
                  {saving ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleProtection>
  );
}
