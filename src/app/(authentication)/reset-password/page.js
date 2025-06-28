"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";

export default function ResetPasswordPage() {
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
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/api/auth/reset-password", {
        email,
        newPassword: password,
        verificationCode: code,
      });
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      router.push("/login");
    } catch (err) {
      toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h1>
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
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
            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}