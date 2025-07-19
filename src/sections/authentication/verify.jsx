'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Card, CardContent } from '@/components/ui/card';

import { verifyOtp, resendOtp, verifyPassword } from '@/apis/auth'; // Make sure to implement resendOtp

// export  function VerifyReset(){
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [cooldown, setCooldown] = useState(0);

//   useEffect(() => {
//     const emailFromQuery = searchParams.get('email');
//     if (emailFromQuery) {
//       setEmail(emailFromQuery);
//     } else {
//       router.push('/reset-password');
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     let timer;
//     if (cooldown > 0) {
//       timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [cooldown]);

//   const handleVerify = async () => {
//     if (!email || otp.length !== 6) {
//       toast.warning('Vui lòng nhập mã OTP hợp lệ');
//       return;
//     }

//     try {
//       const result = await verifyOtp(otp);
//       if (result === 'OTP verified successfully') {
//         toast.success('Xác thực thành công!');
//         router.push('/reset-password');
//       } else {
//         toast.error('Mã OTP không đúng hoặc đã hết hạn');
//       }
//     } catch (err) {
//       toast.error('Đã xảy ra lỗi khi xác thực OTP');
//     }
//   };

//   const handleResendOtp = async () => {
//     if (!email) return;
//     try {
//       await resendOtp(email);
//       toast.success('Mã OTP đã được gửi lại!');
//       setCooldown(60); // 60-second cooldown
//     } catch (err) {
//       toast.error('Gửi lại OTP thất bại');
//     }
//   };
// }


export default function VerifyRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const params = useParams();
  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    } else {
      router.push('/login');
    }
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (!email || otp.length !== 6) {
      toast.warning('Vui lòng nhập mã OTP hợp lệ');
      return;
    }

    try {
      const isReset = searchParams.get('reset') === '1';
      const result = isReset ? await verifyPassword(otp) : await verifyOtp(otp);
      // const result = await verifyPassword(otp);
      if (result === 'User registered successfully' || result === 'Verify password reset code successfully') {
        toast.success('Xác thực thành công!');
        if (isReset) {
          router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${otp}`);
        } else {
          router.push('/login');
        }
      } else {
        toast.error('Mã OTP không đúng hoặc đã hết hạn');
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi xác thực OTP:' + (err?.message || ''));
    }
  };
  const handleResendOtp = async () => {
    if (!email) return;
    try {
      await resendOtp(email);
      toast.success('Mã OTP đã được gửi lại!');
      setCooldown(60); // 60-second cooldown
    } catch (err) {
      toast.error('Gửi lại OTP thất bại');
    }
  };
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-sm shadow-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Xác thực Email</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mã OTP</label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white mb-4"
            onClick={handleVerify}
          >
            Xác thực
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendOtp}
            disabled={cooldown > 0}
          >
            {cooldown > 0
              ? `Gửi lại OTP sau ${cooldown}s`
              : 'Gửi lại mã OTP'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}