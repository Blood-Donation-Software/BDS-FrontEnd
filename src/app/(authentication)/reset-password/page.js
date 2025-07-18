"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { useLanguage } from "@/context/language_context";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [code] = useState(searchParams.get("code") || "");
  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.warning(t?.system?.details_info);
      return;
    }
    if (password !== confirmPassword) {
      toast.warning(t?.system?.unmatched_pass);
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/api/auth/reset-password", {
        email,
        newPassword: password,
        verificationCode: code,
      });
      toast.success(t?.system?.password_reset_success);
      router.push("/login");
    } catch (err) {
      toast.error(t?.system?.password_reset_failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{t?.auth?.reset_password}</h1>
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t?.auth?.new_password}</label>
            <Input
              type="password"
              placeholder={t?.example?.enterPassword}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">{t?.confirmPasswordExample}</label>
            <Input
              type="password"
              placeholder={t?.example?.confirmPasswordExample}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? t?.system?.changing_password : t?.system?.change_passwordSuccess}
          </Button>
        </form>
      </div>
    </div>
  );
}