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
import { useLanguage } from "@/context/language_context";

export default function SettingsPage() {
  const {t}= useLanguage();
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
      toast.success(t?.settingPage?.toasts?.settingSuccess);
    } catch (error) {
      toast.error(t?.settingPage?.toasts?.settingError);
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t?.settingPage?.password?.errors?.mismatch);
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error(t?.settingPage?.password?.errors?.length);
      return;
    }

    setSaving(true);
    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      toast.success(t?.settingPage?.password?.success);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(t?.settingPage?.password?.errors?.generic);
    }
    setSaving(false);
  };

  return (
    <RoleProtection requiredRole={ROLES.MEMBER}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t?.dropDownMenu?.settings}</h1>
            <p className="text-gray-600 mt-2">{t?.settingPage?.header?.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t?.settingPage?.accountInfo?.title}</CardTitle>
                  <CardDescription>
                    {t?.settingPage?.accountInfo?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t?.settingPage?.accountInfo?.fields?.email}</Label>
                    <p className="font-medium">{account?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t?.settingPage?.accountInfo?.fields?.name}</Label>
                    <p className="font-medium">{profile?.name || t?.settingPage?.accountInfo?.fields?.notUpdated}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t?.settingPage?.accountInfo?.fields?.role}</Label>                    
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      account?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      account?.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                      account?.role === 'MEMBER' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account?.role === 'ADMIN' ? t?.settingPage?.accountInfo?.roles?.admin :
                       account?.role === 'STAFF' ? t?.settingPage?.accountInfo?.roles?.staff :
                       account?.role === 'MEMBER' ? t?.settingPage?.accountInfo?.roles?.member : t?.setttingsPage?.accountInfo?.roles?.guest}
                    </span>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t?.settingPage?.accountInfo?.fields?.joinDate}</Label>
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
                  <CardTitle>{t?.settingPage?.notifications?.title}</CardTitle>
                  <CardDescription>
                    {t?.settingPage?.notifications?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">{t?.settingPage?.notifications?.marketingEmails?.label}</Label>
                      <p className="text-sm text-gray-500">{t?.settingPage?.notifications?.marketingEmails?.description}</p>
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
                  <CardTitle>{t?.settingPage?.password?.title}</CardTitle>
                  <CardDescription>
                    {t?.settingPage?.password?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">{t?.settingPage?.password?.fields?.current}</Label>
                    <Input
                      id="old-password"
                      name="oldPassword"
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder={t?.settingPage?.password?.fields?.current}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t?.settingPage?.password?.fields?.new}</Label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder={t?.settingPage?.password?.fields?.new}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t?.settingPage?.password?.fields?.confirm}</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder={t?.settingPage?.password?.fields?.confirm}
                    />
                  </div>
                  
                  <Button 
                    onClick={changePassword} 
                    disabled={saving || !passwordForm.oldPassword || !passwordForm.newPassword}
                    className="w-full"
                  >
                    {saving ? t?.settingPage?.password?.changing : t?.settingPage?.password?.button}
                  </Button>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>{t?.settingPage?.preferences?.title}</CardTitle>
                  <CardDescription>
                    {t?.settingPage?.preferences?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">{t?.settingPage?.preferences?.language?.label}</Label>
                      <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="vi">{t?.settingPage?.preferences?.language?.options?.vi}</option>
                        <option value="en">{t?.settingPage?.preferences?.language?.options?.en}</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">{t?.settingPage?.preferences?.timezone?.label}</Label>
                      <select
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Ho_Chi_Minh">{t?.settingPage?.preferences?.timezone?.options?.Asia_Ho_Chi_Minh}</option>
                        <option value="UTC">{t?.settingPage?.preferences?.timezone?.options?.utc}</option>
                        <option value="America/New_York">{t?.settingPage?.preferences?.timezone?.options?.America_New_York}</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={saving} size="lg">
                  {saving ? t?.settingPage?.saveButton?.saving: t?.settingPage?.saveButton?.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleProtection>
  );
}
