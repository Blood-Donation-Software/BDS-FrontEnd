"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/apis/auth";
import { useLanguage } from "@/context/language_context";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning(t?.auth?.pleaseEnterEmail || "Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email); // Gọi API đúng endpoint
      toast.success(t?.auth?.otpSentSuccess || "OTP code has been sent to your email!");
      router.push(`/verify?email=${encodeURIComponent(email)}&reset=1`);
    } catch (err) {
      toast.error(t?.auth?.otpSendFailed || "Failed to send OTP. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{t?.auth?.forgot_password}</h1>
        <form onSubmit={handleForgot}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t?.auth?.email || "Email"}</label>
            <Input
              type="email"
              placeholder={t?.auth?.enterRegisteredEmail || "Enter your registered email"}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? (t?.auth?.sending || "Sending...") : (t?.auth?.sendOTP || "Send OTP Code")}
          </Button>
        </form>
      </div>
    </div>
  );
}
